"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, Navigation, Search, RefreshCw } from "lucide-react"

interface Hospital {
  id: string
  name: string
  address: string
  phone?: string
  distance?: number
  lat: number
  lon: number
  type?: string
}

export default function NearbyHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // Auto-refresh every 5 minutes
  const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

  const getCurrentLocation = useCallback(() => {
    setError(null)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }
          setUserLocation(location)
          searchNearbyHospitals(location)
          setLastRefresh(new Date())
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Unable to get your location. Using default location (Delhi).")
          // Default to Delhi, India
          const defaultLocation = { lat: 28.6139, lon: 77.209 }
          setUserLocation(defaultLocation)
          searchNearbyHospitals(defaultLocation)
          setLastRefresh(new Date())
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
      const defaultLocation = { lat: 28.6139, lon: 77.209 }
      setUserLocation(defaultLocation)
      searchNearbyHospitals(defaultLocation)
      setLastRefresh(new Date())
    }
  }, [])

  // Initial load
  useEffect(() => {
    getCurrentLocation()
  }, [getCurrentLocation])

  // Auto-refresh effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (userLocation && !loading) {
        console.log("Auto-refreshing hospital data...")
        searchNearbyHospitals(userLocation)
        setLastRefresh(new Date())
      }
    }, AUTO_REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [userLocation, loading])

  const searchNearbyHospitals = async (location: { lat: number; lon: number }) => {
    setLoading(true)
    setError(null)

    try {
      // First try Overpass API for real hospital data
      const overpassData = await fetchFromOverpass(location)

      if (overpassData.length > 0) {
        setHospitals(overpassData)
      } else {
        // Fallback to mock data if no real data found
        const fallbackData = getFallbackHospitals(location)
        setHospitals(fallbackData)
        setError("Using sample hospital data. Real hospital data may not be available in your area.")
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error)
      // Use fallback data on error
      const fallbackData = getFallbackHospitals(location)
      setHospitals(fallbackData)
      setError("Unable to fetch real-time hospital data. Showing sample hospitals.")
    }

    setLoading(false)
  }

  const fetchFromOverpass = async (location: { lat: number; lon: number }): Promise<Hospital[]> => {
    const radius = 10000 // 10km radius
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${location.lat},${location.lon});
        way["amenity"="hospital"](around:${radius},${location.lat},${location.lon});
        relation["amenity"="hospital"](around:${radius},${location.lat},${location.lon});
        node["amenity"="clinic"](around:${radius},${location.lat},${location.lon});
        way["amenity"="clinic"](around:${radius},${location.lat},${location.lon});
        node["healthcare"="hospital"](around:${radius},${location.lat},${location.lon});
        way["healthcare"="hospital"](around:${radius},${location.lat},${location.lon});
      );
      out center meta;
    `

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: query,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    const hospitalData: Hospital[] = data.elements
      .map((element: any) => {
        const lat = element.lat || element.center?.lat || 0
        const lon = element.lon || element.center?.lon || 0

        if (lat === 0 || lon === 0) return null

        const distance = calculateDistance(location.lat, location.lon, lat, lon)
        const name =
          element.tags?.name ||
          element.tags?.["name:en"] ||
          element.tags?.["healthcare:speciality"] ||
          `${element.tags?.amenity === "clinic" ? "Clinic" : "Hospital"}`

        const address =
          [
            element.tags?.["addr:housenumber"],
            element.tags?.["addr:street"],
            element.tags?.["addr:suburb"],
            element.tags?.["addr:city"],
            element.tags?.["addr:state"],
          ]
            .filter(Boolean)
            .join(", ") ||
          element.tags?.["addr:full"] ||
          "Address not available"

        return {
          id: element.id.toString(),
          name: name,
          address: address,
          phone: element.tags?.phone || element.tags?.["contact:phone"],
          distance: Math.round(distance * 100) / 100,
          lat,
          lon,
          type: element.tags?.amenity || element.tags?.healthcare || "hospital",
        }
      })
      .filter(
        (hospital: Hospital | null): hospital is Hospital =>
          hospital !== null && hospital.name !== "Hospital" && hospital.name !== "Clinic" && hospital.distance! <= 50, // Filter out hospitals more than 50km away
      )
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 20) // Limit to 20 results

    return hospitalData
  }

  const getFallbackHospitals = (location: { lat: number; lon: number }): Hospital[] => {
    // Generate realistic hospital data based on location
    const baseHospitals = [
      {
        name: "City General Hospital",
        addressSuffix: "Main Street, City Center",
        phone: "+91-11-12345678",
        offset: { lat: 0.01, lon: 0.01 },
      },
      {
        name: "Emergency Medical Center",
        addressSuffix: "Hospital Road, Medical District",
        phone: "+91-11-87654321",
        offset: { lat: 0.02, lon: -0.01 },
      },
      {
        name: "Metro Heart Institute",
        addressSuffix: "Cardiac Care Avenue",
        phone: "+91-11-11111111",
        offset: { lat: -0.015, lon: 0.02 },
      },
      {
        name: "Community Health Center",
        addressSuffix: "Healthcare Boulevard",
        phone: "+91-11-22222222",
        offset: { lat: 0.025, lon: 0.015 },
      },
      {
        name: "Regional Medical College",
        addressSuffix: "University Campus",
        phone: "+91-11-33333333",
        offset: { lat: -0.02, lon: -0.02 },
      },
      {
        name: "Trauma Care Center",
        addressSuffix: "Emergency Services Road",
        phone: "+91-11-44444444",
        offset: { lat: 0.03, lon: -0.015 },
      },
    ]

    return baseHospitals
      .map((hospital, index) => {
        const lat = location.lat + hospital.offset.lat
        const lon = location.lon + hospital.offset.lon
        const distance = calculateDistance(location.lat, location.lon, lat, lon)

        return {
          id: `fallback-${index}`,
          name: hospital.name,
          address: hospital.addressSuffix,
          phone: hospital.phone,
          distance: Math.round(distance * 100) / 100,
          lat,
          lon,
          type: "hospital",
        }
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const callHospital = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const getDirections = (lat: number, lon: number, name: string) => {
    // Try Google Maps first, fallback to Apple Maps on iOS
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=${encodeURIComponent(name)}`
    const appleMapsUrl = `http://maps.apple.com/?daddr=${lat},${lon}&q=${encodeURIComponent(name)}`

    // Detect if user is on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

    if (isIOS) {
      // Try Apple Maps first on iOS
      window.open(appleMapsUrl, "_blank")
    } else {
      // Use Google Maps on other platforms
      window.open(googleMapsUrl, "_blank")
    }
  }

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatLastRefresh = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8 pt-4 md:pt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Nearby Hospitals</h1>
              {lastRefresh && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Last updated: {formatLastRefresh(lastRefresh)} • Auto-refreshes every 5 minutes
                </p>
              )}
            </div>
            <Button onClick={getCurrentLocation} disabled={loading} variant="outline" className="w-full md:w-auto">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Now
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="mb-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-yellow-800 dark:text-yellow-300 text-sm font-medium">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {loading && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Finding nearby hospitals...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a few moments</p>
            </CardContent>
          </Card>
        )}

        {/* Hospitals List */}
        <div className="space-y-3 md:space-y-4">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start space-x-3 mb-3 md:mb-0">
                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg flex-shrink-0">
                      <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">
                          {hospital.name}
                        </h3>
                        {hospital.type === "clinic" && (
                          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">
                            Clinic
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-1 md:mb-2">
                        {hospital.address}
                      </p>
                      {hospital.phone && (
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-mono mb-1 md:mb-2">
                          📞 {hospital.phone}
                        </p>
                      )}
                      {hospital.distance && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          📍 {hospital.distance} km away
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                    {hospital.phone && (
                      <Button
                        size="sm"
                        onClick={() => callHospital(hospital.phone!)}
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => getDirections(hospital.lat, hospital.lon, hospital.name)}
                      className="dark:text-gray-200 dark:border-gray-600"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHospitals.length === 0 && !loading && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8 md:p-12 text-center">
              <MapPin className="h-10 w-10 md:h-12 md:w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Hospitals Found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {searchQuery ? "Try adjusting your search terms." : "Unable to find hospitals in your area."}
              </p>
              <Button onClick={() => getCurrentLocation()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Location Info */}
        {userLocation && (
          <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>
                  Searching near: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
