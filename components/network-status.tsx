"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)

      // Show status indicator when offline or when coming back online
      if (!online) {
        setShowStatus(true)
      } else if (showStatus) {
        // Show "back online" briefly then hide
        setTimeout(() => setShowStatus(false), 3000)
      }
    }

    // Set initial status
    updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [showStatus])

  if (!showStatus && isOnline) {
    return null
  }

  return (
    <div
      className={`fixed top-16 md:top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 transition-all duration-300 ${
        showStatus ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div
        className={`p-3 rounded-lg shadow-lg ${
          isOnline
            ? "bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800"
            : "bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600 dark:text-red-400" />
          )}
          <span
            className={`text-sm font-medium ${
              isOnline ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"
            }`}
          >
            {isOnline ? "Back online" : "No internet connection"}
          </span>
        </div>
        {!isOnline && (
          <p className="text-xs text-red-700 dark:text-red-400 mt-1">Emergency features require internet connection</p>
        )}
      </div>
    </div>
  )
}
