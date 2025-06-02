"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Animated } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useTheme } from "../providers/ThemeProvider"
import { useAuth } from "../providers/AuthProvider"

const HomeScreen = ({ navigation }: any) => {
  const { colors } = useTheme()
  const { user, signOut } = useAuth()
  const [isEmergency, setIsEmergency] = useState(false)
  const [pulseAnim] = useState(new Animated.Value(1))

  const handleSOSPress = () => {
    setIsEmergency(true)

    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Call emergency number
    Linking.openURL("tel:108")

    // Reset after 3 seconds
    setTimeout(() => {
      setIsEmergency(false)
      pulseAnim.stopAnimation()
      pulseAnim.setValue(1)
    }, 3000)
  }

  const quickActions = [
    {
      title: "Emergency Contacts",
      description: "Quick access to your emergency contacts",
      icon: "contacts",
      screen: "Contacts",
      color: "#3b82f6",
    },
    {
      title: "Nearby Hospitals",
      description: "Find hospitals near you",
      icon: "local-hospital",
      screen: "Hospitals",
      color: "#10b981",
    },
    {
      title: "First Aid AI",
      description: "AI-powered first aid guidance",
      icon: "chat",
      screen: "AI Assistant",
      color: "#8b5cf6",
    },
    {
      title: "Blood Donors",
      description: "Connect with blood donors",
      icon: "favorite",
      screen: "Donors",
      color: "#ef4444",
    },
  ]

  const emergencyNumbers = [
    { name: "Ambulance", number: "108" },
    { name: "Police", number: "100" },
    { name: "Fire", number: "101" },
  ]

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: colors.primary,
      alignItems: "center",
    },
    headerText: {
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 5,
    },
    headerSubtext: {
      color: "white",
      fontSize: 16,
      opacity: 0.9,
    },
    userInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    userName: {
      color: "white",
      fontSize: 16,
    },
    logoutButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    sosContainer: {
      alignItems: "center",
      marginVertical: 30,
    },
    sosButton: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    sosText: {
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 5,
    },
    sosSubtext: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 10,
      textAlign: "center",
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginVertical: 20,
    },
    actionCard: {
      width: "48%",
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    actionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    actionDescription: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    emergencySection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    emergencyRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    emergencyButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      marginHorizontal: 4,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    emergencyButtonText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
    },
  })

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Emergency Care</Text>
        <Text style={styles.headerSubtext}>Your medical emergency companion</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Welcome, {user?.user_metadata?.full_name || user?.email}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Icon name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* SOS Button */}
        <View style={styles.sosContainer}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.sosButton, isEmergency && { backgroundColor: "#dc2626" }]}
              onPress={handleSOSPress}
              disabled={isEmergency}
            >
              <Icon name={isEmergency ? "warning" : "phone"} size={40} color="white" />
              <Text style={styles.sosText}>{isEmergency ? "CALLING..." : "SOS"}</Text>
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.sosSubtext}>Press to call emergency services (108)</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard} onPress={() => navigation.navigate(action.screen)}>
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Icon name={action.icon} size={24} color="white" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Numbers */}
        <View style={styles.emergencySection}>
          <Text style={styles.sectionTitle}>Emergency Numbers</Text>
          <View style={styles.emergencyRow}>
            {emergencyNumbers.map((emergency, index) => (
              <TouchableOpacity
                key={index}
                style={styles.emergencyButton}
                onPress={() => Linking.openURL(`tel:${emergency.number}`)}
              >
                <Icon name="phone" size={20} color={colors.primary} />
                <Text style={styles.emergencyButtonText}>
                  {emergency.name} ({emergency.number})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default HomeScreen
