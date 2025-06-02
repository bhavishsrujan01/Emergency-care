"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  colors: {
    primary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
  }
}

const lightColors = {
  primary: "#dc2626",
  background: "#ffffff",
  surface: "#f8f9fa",
  text: "#1f2937",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
}

const darkColors = {
  primary: "#ef4444",
  background: "#111827",
  surface: "#1f2937",
  text: "#f9fafb",
  textSecondary: "#d1d5db",
  border: "#374151",
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colors: lightColors,
})

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const colors = isDark ? darkColors : lightColors

  return <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>{children}</ThemeContext.Provider>
}
