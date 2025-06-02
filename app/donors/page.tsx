"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"

interface Donor {
  id: string
  name: string
  blood_group: string
  age: number
  gender: string
  phone: string
  location: string
  available: boolean
}

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBloodGroup, setFilterBloodGroup] = useState("All Blood Groups")
  const [newDonor, setNewDonor] = useState({
    name: "",
    blood_group: "",
    age: "",
    gender: "",
    phone: "",
    location: "",
  })

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  useEffect(() => {
    // Load donors from localStorage
    const savedDonors = localStorage.getItem("blood-donors")
    if (savedDonors) {
      setDonors(JSON.parse(savedDonors))
    } else {
      // Add some sample donors
      const sampleDonors = [
        {
          id: "1",
          name: "John Doe",
          blood_group: "O+",
          age: 28,
          gender: "Male",
          phone: "+91-98765-43210",
          location: "Delhi",
          available: true,
        },
        {
          id: "2",
          name: "Jane Smith",
          blood_group: "A+",
          age: 32,
          gender: "Female",
          phone: "+91-87654-32109",
          location: "Mumbai",
          available: true,
        },
      ]
      setDonors(sampleDonors)
      localStorage.setItem("blood-donors", JSON.stringify(sampleDonors))
    }
  }, [])

  const saveDonors = (updatedDonors: Donor[]) => {
    setDonors(updatedDonors)
    localStorage.setItem("blood-donors", JSON.stringify(updatedDonors))
  }

  const addDonor = () => {
    if (!newDonor.name || !newDonor.blood_group || !newDonor.phone) return

    const newDonorWithId = {
      ...newDonor,
      id: Date.now().toString(),
      age: Number.parseInt(newDonor.age),
      available: true,
    }

    const updatedDonors = [...donors, newDonorWithId]
    saveDonors(updatedDonors)
    setNewDonor({
      name: "",
      blood_group: "",
      age: "",
      gender: "",
      phone: "",
      location: "",
    })
    setIsAdding(false)
  }

  const callDonor = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBloodGroup = filterBloodGroup === "All Blood Groups" || donor.blood_group === filterBloodGroup
    return matchesSearch && matchesBloodGroup
  })

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8 pt-4 md:pt-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Blood Donors</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 md:mt-2">Connect with blood donors in your area</p>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Register as Donor
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="mb-4 md:mb-6 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Select value={filterBloodGroup} onValueChange={setFilterBloodGroup}>
                <SelectTrigger className="w-full md:w-48 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Filter by blood group" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="All Blood Groups">All Blood Groups</SelectItem>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Donor Form */}
        {isAdding && (
          <Card className="mb-4 md:mb-6 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Register as Blood Donor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="donor-name" className="text-gray-700 dark:text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="donor-name"
                    value={newDonor.name}
                    onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="donor-phone" className="text-gray-700 dark:text-gray-300">
                    Phone Number
                  </Label>
                  <Input
                    id="donor-phone"
                    value={newDonor.phone}
                    onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="donor-blood-group" className="text-gray-700 dark:text-gray-300">
                    Blood Group
                  </Label>
                  <Select
                    value={newDonor.blood_group}
                    onValueChange={(value) => setNewDonor({ ...newDonor, blood_group: value })}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="donor-age" className="text-gray-700 dark:text-gray-300">
                    Age
                  </Label>
                  <Input
                    id="donor-age"
                    type="number"
                    value={newDonor.age}
                    onChange={(e) => setNewDonor({ ...newDonor, age: e.target.value })}
                    placeholder="Enter your age"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="donor-gender" className="text-gray-700 dark:text-gray-300">
                    Gender
                  </Label>
                  <Select
                    value={newDonor.gender}
                    onValueChange={(value) => setNewDonor({ ...newDonor, gender: value })}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="donor-location" className="text-gray-700 dark:text-gray-300">
                    Location
                  </Label>
                  <Input
                    id="donor-location"
                    value={newDonor.location}
                    onChange={(e) => setNewDonor({ ...newDonor, location: e.target.value })}
                    placeholder="Enter your location"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  onClick={addDonor}
                  className="w-full md:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  Register
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                  className="w-full md:w-auto dark:text-gray-200 dark:border-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Donor List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonors.map((donor) => (
            <Card key={donor.id} className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{donor.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Blood Group:</span> {donor.blood_group}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Age:</span> {donor.age}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Gender:</span> {donor.gender}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Location:</span> {donor.location}
                </p>
                <Button
                  onClick={() => callDonor(donor.phone)}
                  className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                >
                  Call Donor
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredDonors.length === 0 && (
          <div className="text-center mt-8 text-gray-500 dark:text-gray-400">
            No donors found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}
