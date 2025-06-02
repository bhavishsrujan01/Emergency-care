"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import Geolocation from "react-native-geolocation-service"
import { useTheme } from "../providers/ThemeProvider"

interface Hospital {
  id: string
  name: string
  address: string
  phone?: string
  distance?: number
  lat: number
  lon: number
}

const NearbyHospitalsScreen = () => {
  const { colors } = useTheme()
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lon: number
  } | null>(null)

  useEffect(() => {
    requestLocationPermission()
  }, [])

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: "Location Permission",
          message: "This app needs access to location to find nearby hospitals.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        })
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation()
        }
      } catch (err) {
        console.warn(err)
      }
    } else {
      getCurrentLocation()
    }
  }

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }
        setUserLocation(location)
        searchNearbyHospitals(location)
      },
      (error) => {
        console.error("Error getting location:", error)
        // Use default location (Delhi)
        const defaultLocation = { lat: 28.6139, lon: 77.209 }
        setUserLocation(defaultLocation)
        searchNearbyHospitals(defaultLocation)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )
  }

  const searchNearbyHospitals = async (location: { lat: number; lon: number }) => {
    setLoading(true)
    try {
      // Mock data for demonstration
      const mockHospitals: Hospital[] = [
        {
          id: "1",
          name: "City General Hospital",
          address: "Main Street, City Center",
          phone: "+91-11-12345678",
          distance: 1.2,
          lat: location.lat + 0.01,
          lon: location.lon + 0.01,
        },
        {
          id: "2",
          name: "Emergency Medical Center",
          address: "Hospital Road, Medical District",
          phone: "+91-11-87654321",
          distance: 2.5,
          lat: location.lat + 0.02,
          lon: location.lon + 0.02,
        },
        {
          id: "3",
          name: "Metro Heart Institute",
          address: "Cardiac Care Avenue",
          phone: "+91-11-11111111",
          distance: 3.1,
          lat: location.lat - 0.01,
          lon: location.lon - 0.01,
        },
      ]

      setHospitals(mockHospitals)
    } catch (error) {
      console.error("Error fetching hospitals:", error)
      Alert.alert("Error", "Failed to fetch nearby hospitals")
    }
    setLoading(false)
  }

  const callHospital = (phone: string) => {
    Linking.openURL(`tel:${phone}`)
  }

  const getDirections = (lat: number, lon: number, name: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lon}`,
      android: `geo:0,0?q=${lat},${lon}(${name})`,
    })

    if (url) {
      Linking.openURL(url)
    }
  }

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: colors.primary,
    },
    headerText: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 12,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 8,
      paddingHorizontal: 12,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 16,
    },
    hospitalCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    hospitalHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    hospitalIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "#ef4444",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    hospitalInfo: {
      flex: 1,
    },
    hospitalName: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    hospitalAddress: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    hospitalPhone: {
      fontSize: 14,
      color: colors.text,
      fontFamily: "monospace",
      marginBottom: 4,
    },
    hospitalDistance: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "600",
    },
    hospitalActions: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      borderRadius: 8,
      marginHorizontal: 4,
    },
    callButton: {
      backgroundColor: "#10b981",
    },
    directionsButton: {
      backgroundColor: colors.primary,
    },
    actionButtonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 8,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 24,
    },
    refreshButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    refreshButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Nearby Hospitals</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search hospitals..."
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Icon name="local-hospital" size={48} color={colors.textSecondary} />
          <Text style={styles.loadingText}>Finding nearby hospitals...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospital) => (
              <View key={hospital.id} style={styles.hospitalCard}>
                <View style={styles.hospitalHeader}>
                  <View style={styles.hospitalIcon}>
                    <Icon name="local-hospital" size={24} color="white" />
                  </View>
                  <View style={styles.hospitalInfo}>
                    <Text style={styles.hospitalName}>{hospital.name}</Text>
                    <Text style={styles.hospitalAddress}>{hospital.address}</Text>
                    {hospital.phone && <Text style={styles.hospitalPhone}>{hospital.phone}</Text>}
                    {hospital.distance && <Text style={styles.hospitalDistance}>{hospital.distance} km away</Text>}
                  </View>
                </View>
                <View style={styles.hospitalActions}>
                  {hospital.phone && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.callButton]}
                      onPress={() => callHospital(hospital.phone!)}
                    >
                      <Icon name="phone" size={20} color="white" />
                      <Text style={styles.actionButtonText}>Call</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.directionsButton]}
                    onPress={() => getDirections(hospital.lat, hospital.lon, hospital.name)}
                  >
                    <Icon name="directions" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Icon name="local-hospital" size={40} color={colors.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>No Hospitals Found</Text>
              <Text style={styles.emptyDescription}>
                {searchQuery ? "Try adjusting your search terms." : "Unable to find hospitals in your area."}
              </Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => userLocation && searchNearbyHospitals(userLocation)}
              >
                <Text style={styles.refreshButtonText}>Refresh Search</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}

export default NearbyHospitalsScreen
