"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Animated } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import Voice from "@react-native-voice/voice"
import Tts from "react-native-tts"
import { useTheme } from "../providers/ThemeProvider"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

const AIAssistantScreen = () => {
  const { colors } = useTheme()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI First Aid Assistant. I can help you with emergency first aid guidance. Please describe the situation you're dealing with, and I'll provide step-by-step instructions. Remember: For serious emergencies, always call 108 immediately!",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const pulseAnim = useRef(new Animated.Value(1)).current

  const quickQuestions = [
    "How to treat a minor cut?",
    "What to do for choking?",
    "How to help someone having a heart attack?",
    "Treatment for burns",
    "How to stop bleeding?",
    "What to do for allergic reactions?",
  ]

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart
    Voice.onSpeechEnd = onSpeechEnd
    Voice.onSpeechResults = onSpeechResults
    Voice.onSpeechError = onSpeechError

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  const onSpeechStart = () => {
    setIsListening(true)
    startPulseAnimation()
  }

  const onSpeechEnd = () => {
    setIsListening(false)
    stopPulseAnimation()
  }

  const onSpeechResults = (event: any) => {
    const transcript = event.value[0]
    setInputMessage(transcript)
  }

  const onSpeechError = (event: any) => {
    console.error("Speech recognition error:", event.error)
    setIsListening(false)
    stopPulseAnimation()
  }

  const startPulseAnimation = () => {
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
  }

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation()
    pulseAnim.setValue(1)
  }

  const startListening = async () => {
    try {
      await Voice.start("en-US")
    } catch (error) {
      console.error("Error starting voice recognition:", error)
    }
  }

  const stopListening = async () => {
    try {
      await Voice.stop()
    } catch (error) {
      console.error("Error stopping voice recognition:", error)
    }
  }

  const sendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Simulate AI response (replace with actual API call)
      const response = await fetch("YOUR_API_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm sorry, I couldn't process your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Text-to-speech for AI responses
      Tts.speak(aiMessage.content)
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, there was an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }

    setIsLoading(false)
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: colors.primary,
      alignItems: "center",
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
      marginTop: 4,
    },
    warningBanner: {
      backgroundColor: "#fef2f2",
      borderLeftWidth: 4,
      borderLeftColor: "#ef4444",
      padding: 12,
      margin: 16,
      borderRadius: 8,
    },
    warningText: {
      color: "#dc2626",
      fontSize: 14,
      fontWeight: "600",
    },
    quickQuestions: {
      padding: 16,
    },
    quickQuestionsTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    quickQuestionButton: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickQuestionText: {
      color: colors.text,
      fontSize: 14,
    },
    messagesContainer: {
      flex: 1,
      padding: 16,
    },
    messageWrapper: {
      marginBottom: 16,
    },
    userMessage: {
      alignSelf: "flex-end",
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 12,
      maxWidth: "80%",
    },
    aiMessage: {
      alignSelf: "flex-start",
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 12,
      maxWidth: "80%",
    },
    messageText: {
      fontSize: 16,
      lineHeight: 22,
    },
    userMessageText: {
      color: "white",
    },
    aiMessageText: {
      color: colors.text,
    },
    loadingMessage: {
      alignSelf: "flex-start",
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    loadingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.textSecondary,
      marginHorizontal: 2,
    },
    inputContainer: {
      flexDirection: "row",
      padding: 16,
      backgroundColor: colors.surface,
      alignItems: "center",
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
      marginRight: 8,
    },
    voiceButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    sendButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>AI First Aid Assistant</Text>
        <Text style={styles.headerSubtext}>Get immediate first aid guidance</Text>
      </View>

      <View style={styles.warningBanner}>
        <Text style={styles.warningText}>⚠️ For life-threatening emergencies, call 108 immediately!</Text>
      </View>

      <ScrollView style={styles.quickQuestions} horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <Text style={styles.quickQuestionsTitle}>Quick Questions</Text>
          {quickQuestions.map((question, index) => (
            <TouchableOpacity key={index} style={styles.quickQuestionButton} onPress={() => sendMessage(question)}>
              <Text style={styles.quickQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView ref={scrollViewRef} style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View key={message.id} style={styles.messageWrapper}>
            <View style={message.isUser ? styles.userMessage : styles.aiMessage}>
              <Text style={[styles.messageText, message.isUser ? styles.userMessageText : styles.aiMessageText]}>
                {message.content}
              </Text>
            </View>
          </View>
        ))}

        {isLoading && (
          <View style={styles.loadingMessage}>
            <Animated.View style={[styles.loadingDot, { opacity: pulseAnim }]} />
            <Animated.View style={[styles.loadingDot, { opacity: pulseAnim }]} />
            <Animated.View style={[styles.loadingDot, { opacity: pulseAnim }]} />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Describe the emergency situation..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.voiceButton, isListening && { backgroundColor: "#ef4444" }]}
            onPress={isListening ? stopListening : startListening}
          >
            <Icon name={isListening ? "mic-off" : "mic"} size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => sendMessage(inputMessage)}
          disabled={!inputMessage.trim() || isLoading}
        >
          <Icon name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AIAssistantScreen
