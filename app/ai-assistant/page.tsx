"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Bot, User } from "lucide-react"
import { VoiceInput } from "@/components/voice-input"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function AIAssistantPage() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    "How to treat a minor cut?",
    "What to do for choking?",
    "How to help someone having a heart attack?",
    "Treatment for burns",
    "How to stop bleeding?",
    "What to do for allergic reactions?",
  ]

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
      const response = await fetch("/api/ai-assistant", {
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
      if ("speechSynthesis" in window && data.response) {
        const utterance = new SpeechSynthesisUtterance(data.response)
        utterance.rate = 0.8
        utterance.pitch = 1
        speechSynthesis.speak(utterance)
      }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputMessage)
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInputMessage(transcript)
  }

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8 pt-4 md:pt-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">AI First Aid Assistant</h1>
          <p className="text-gray-600 dark:text-gray-300">Get immediate first aid guidance powered by AI</p>
        </div>

        {/* Emergency Warning */}
        <Card className="mb-4 md:mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse"></div>
              <p className="text-red-800 dark:text-red-300 text-sm md:text-base font-medium">
                For life-threatening emergencies, call 108 immediately before using this assistant.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions - Hidden on mobile */}
        <Card className="hidden md:block mb-4 md:mb-6 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="p-4 pb-2 md:pb-3">
            <CardTitle className="text-base md:text-lg text-gray-900 dark:text-white">Quick Questions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(question)}
                  className="text-left justify-start h-auto p-2 md:p-3 dark:text-gray-200 dark:border-gray-600"
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="flex flex-col h-[500px] md:h-[550px] dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="p-4 pb-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <CardTitle className="flex items-center text-base md:text-lg text-gray-900 dark:text-white">
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat with AI Assistant
            </CardTitle>
          </CardHeader>

          {/* Messages Container */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl transition-all duration-200 ${
                      message.isUser
                        ? "bg-blue-600 dark:bg-blue-700 text-white rounded-br-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {!message.isUser && (
                        <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                      )}
                      <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{message.content}</div>
                      {message.isUser && <User className="h-4 w-4 mt-1 flex-shrink-0 text-blue-100" />}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
              <form onSubmit={handleSubmit} className="flex items-end space-x-2">
                <div className="flex-1">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Describe the emergency situation..."
                    disabled={isLoading}
                    className="min-h-[44px] resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                </div>
                <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />
                <Button type="submit" disabled={isLoading || !inputMessage.trim()} className="min-h-[44px] px-4">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
