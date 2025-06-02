"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, Linking } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Picker } from "@react-native-picker/picker"
import { useTheme } from "../providers/ThemeProvider"
import { useAuth } from "../providers/AuthProvider"
import { supabase } from "../lib/supabase"

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

const DonorsScreen = () => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const [donors, setDonors] = useState<Donor[]>([])
  const [isAddingDonor, setIsAddingDonor] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBloodGroup, setFilterBloodGroup] = useState("All")
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
    fetchDonors()
  }, [])

  const fetchDonors = async () => {
    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .eq("available", true)
      .order("created_at", { ascending: false })

    if (data) {
      setDonors(data)
    }
  }

  const addDonor = async () => {
    if (!newDonor.name || !newDonor.blood_group || !newDonor.phone || !user) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    const { error } = await supabase.from("donors").insert([
      {
        ...newDonor,
        user_id: user.id,
        age: Number.parseInt(newDonor.age),
        available: true,
      },
    ])

    if (!error) {
      setNewDonor({
        name: "",
        blood_group: "",
        age: "",
        gender: "",
        phone: "",
        location: "",
      })
      setIsAddingDonor(false)
      fetchDonors()
      Alert.alert("Success", "You have been registered as a blood donor!")
    } else {
      Alert.alert("Error", "Failed to register as donor")
    }
  }

  const callDonor = (phone: string) => {
    Linking.openURL(`tel:${phone}`)
  }

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBloodGroup = filterBloodGroup === "All" || donor.blood_group === filterBloodGroup
    return matchesSearch && matchesBloodGroup
  })

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: colors.primary,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    headerText: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
    },
    headerSubtext: {
      color: "white",
      fontSize: 14,
      opacity: 0.9,
      marginBottom: 12,
    },
    addButton: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 20,
      padding: 8,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 8,
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
    filterContainer: {
      backgroundColor: "white",
      borderRadius: 8,
      paddingHorizontal: 12,
    },
    picker: {
      height: 50,
      color: colors.text,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    donorCard: {
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
    donorHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    donorIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    donorInfo: {
      flex: 1,
    },
    donorName: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    donorDetails: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    bloodGroupBadge: {
      backgroundColor: "#ef4444",
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 4,
      alignSelf: "flex-start",
    },
    bloodGroupText: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
    },
    donorContact: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    contactInfo: {
      flex: 1,
    },
    phoneText: {
      fontSize: 16,
      color: colors.text,
      fontFamily: "monospace",
    },
    locationText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    callButton: {
      backgroundColor: "#10b981",
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    callButtonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
      marginLeft: 4,
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
    emptyButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    emptyButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    modal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 24,
      width: "90%",
      maxWidth: 400,
      maxHeight: "80%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 20,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      marginHorizontal: 4,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.textSecondary,
    },
    modalButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerText}>Blood Donors</Text>
            <Text style={styles.headerSubtext}>Connect with blood donors in your area</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setIsAddingDonor(true)}>
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name or location..."
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.filterContainer}>
          <Picker selectedValue={filterBloodGroup} onValueChange={setFilterBloodGroup} style={styles.picker}>
            <Picker.Item label="All Blood Groups" value="All" />
            {bloodGroups.map((group) => (
              <Picker.Item key={group} label={group} value={group} />
            ))}
          </Picker>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {filteredDonors.length > 0 ? (
          filteredDonors.map((donor) => (
            <View key={donor.id} style={styles.donorCard}>
              <View style={styles.donorHeader}>
                <View style={styles.donorIcon}>
                  <Icon name="person" size={24} color="white" />
                </View>
                <View style={styles.donorInfo}>
                  <Text style={styles.donorName}>{donor.name}</Text>
                  <Text style={styles.donorDetails}>
                    {donor.gender}, {donor.age} years
                  </Text>
                </View>
                <View style={styles.bloodGroupBadge}>
                  <Text style={styles.bloodGroupText}>{donor.blood_group}</Text>
                </View>
              </View>

              <View style={styles.donorContact}>
                <View style={styles.contactInfo}>
                  <Text style={styles.phoneText}>{donor.phone}</Text>
                  <Text style={styles.locationText}>{donor.location}</Text>
                </View>
                <TouchableOpacity style={styles.callButton} onPress={() => callDonor(donor.phone)}>
                  <Icon name="phone" size={16} color="white" />
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Icon name="favorite" size={40} color={colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No Donors Found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery || filterBloodGroup !== "All"
                ? "Try adjusting your search criteria."
                : "Be the first to register as a blood donor in your area."}
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => setIsAddingDonor(true)}>
              <Text style={styles.emptyButtonText}>Register as Donor</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal visible={isAddingDonor} transparent animationType="slide" onRequestClose={() => setIsAddingDonor(false)}>
        <View style={styles.modal}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Register as Blood Donor</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={newDonor.name}
                  onChangeText={(text) => setNewDonor({ ...newDonor, name: text })}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={newDonor.phone}
                  onChangeText={(text) => setNewDonor({ ...newDonor, phone: text })}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Blood Group *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newDonor.blood_group}
                    onValueChange={(value) => setNewDonor({ ...newDonor, blood_group: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select blood group" value="" />
                    {bloodGroups.map((group) => (
                      <Picker.Item key={group} label={group} value={group} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Age *</Text>
                <TextInput
                  style={styles.input}
                  value={newDonor.age}
                  onChangeText={(text) => setNewDonor({ ...newDonor, age: text })}
                  placeholder="Enter your age"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newDonor.gender}
                    onValueChange={(value) => setNewDonor({ ...newDonor, gender: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={newDonor.location}
                  onChangeText={(text) => setNewDonor({ ...newDonor, location: text })}
                  placeholder="Enter your location"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsAddingDonor(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={addDonor}>
                  <Text style={styles.modalButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

export default DonorsScreen
