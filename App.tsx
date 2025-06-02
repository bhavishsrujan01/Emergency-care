"use client"

import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar, Platform } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import SplashScreen from "react-native-splash-screen"

// Import screens
import HomeScreen from "./src/screens/HomeScreen"
import EmergencyContactsScreen from "./src/screens/EmergencyContactsScreen"
import NearbyHospitalsScreen from "./src/screens/NearbyHospitalsScreen"
import AIAssistantScreen from "./src/screens/AIAssistantScreen"
import DonorsScreen from "./src/screens/DonorsScreen"
import AuthScreen from "./src/screens/AuthScreen"
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen"

// Import providers
import { AuthProvider, useAuth } from "./src/providers/AuthProvider"
import { ThemeProvider } from "./src/providers/ThemeProvider"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = "home"
          } else if (route.name === "Contacts") {
            iconName = "contacts"
          } else if (route.name === "Hospitals") {
            iconName = "local-hospital"
          } else if (route.name === "AI Assistant") {
            iconName = "chat"
          } else if (route.name === "Donors") {
            iconName = "favorite"
          }

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#dc2626",
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: "#dc2626",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Contacts" component={EmergencyContactsScreen} />
      <Tab.Screen name="Hospitals" component={NearbyHospitalsScreen} />
      <Tab.Screen name="AI Assistant" component={AIAssistantScreen} />
      <Tab.Screen name="Donors" component={DonorsScreen} />
    </Tab.Navigator>
  )
}

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  )
}

const AppNavigator = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return null // Show splash screen
  }

  return user ? <TabNavigator /> : <AuthStack />
}

const App = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      SplashScreen.hide()
    }
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#dc2626" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
