"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useTheme } from "../providers/ThemeProvider"
import { supabase } from "../lib/supabase"

const AuthScreen = ({ navigation }: any) => {
  const { colors } = useTheme()
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          Alert.alert("Success", "Check your email for the confirmation link!")
        }
      } else if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email)

        if (error) throw error

        Alert.alert("Success", "Check your email for the password reset link!")
      }
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setLoading(false)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
    },
    header: {
      alignItems: "center",
      marginBottom: 40,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
    form: {
      marginBottom: 20,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    inputIcon: {
      padding: 12,
    },
    input: {
      flex: 1,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    eyeButton: {
      padding: 12,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      marginTop: 20,
    },
    submitButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    linkButton: {
      alignItems: "center",
      marginTop: 16,
    },
    linkText: {
      color: colors.primary,
      fontSize: 16,
    },
    switchContainer: {
      alignItems: "center",
      marginTop: 20,
    },
    switchText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
    switchButton: {
      marginTop: 8,
    },
    switchButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "600",
    },
  })

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Icon name="favorite" size={40} color="white" />
          </View>
          <Text style={styles.title}>Emergency Care</Text>
          <Text style={styles.subtitle}>Your medical emergency companion</Text>
        </View>

        <View style={styles.form}>
          {mode === "signup" && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Icon name="person" size={24} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Icon name="email" size={24} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {mode !== "reset" && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock" size={24} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Icon name={showPassword ? "visibility-off" : "visibility"} size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.submitButtonText}>
              {loading
                ? "Loading..."
                : mode === "signin"
                  ? "Sign In"
                  : mode === "signup"
                    ? "Sign Up"
                    : "Send Reset Link"}
            </Text>
          </TouchableOpacity>

          {mode === "signin" && (
            <TouchableOpacity style={styles.linkButton} onPress={() => setMode("reset")}>
              <Text style={styles.linkText}>Forgot your password?</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.switchContainer}>
          {mode === "signin" && (
            <>
              <Text style={styles.switchText}>Don't have an account?</Text>
              <TouchableOpacity style={styles.switchButton} onPress={() => setMode("signup")}>
                <Text style={styles.switchButtonText}>Sign up</Text>
              </TouchableOpacity>
            </>
          )}

          {mode === "signup" && (
            <>
              <Text style={styles.switchText}>Already have an account?</Text>
              <TouchableOpacity style={styles.switchButton} onPress={() => setMode("signin")}>
                <Text style={styles.switchButtonText}>Sign in</Text>
              </TouchableOpacity>
            </>
          )}

          {mode === "reset" && (
            <TouchableOpacity style={styles.switchButton} onPress={() => setMode("signin")}>
              <Text style={styles.switchButtonText}>Back to sign in</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default AuthScreen
