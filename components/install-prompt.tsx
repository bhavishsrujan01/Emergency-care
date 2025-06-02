"use client"

import { useState, useEffect } from "react"
import { X, Download, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return // Already installed, don't show prompt
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // For non-iOS devices, listen for beforeinstallprompt
    if (!isIOSDevice) {
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e as BeforeInstallPromptEvent)
        setShowPrompt(true)
      }

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      }
    } else {
      // For iOS, check if in standalone mode
      const isInStandaloneMode = window.navigator.standalone === true
      if (!isInStandaloneMode) {
        // Show iOS install instructions after a delay
        const timer = setTimeout(() => {
          setShowPrompt(true)
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
    }

    // Clear the saved prompt as it can't be used again
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
    // Save to localStorage to avoid showing again in this session
    localStorage.setItem("installPromptDismissed", "true")
  }

  if (!showPrompt || localStorage.getItem("installPromptDismissed") === "true") {
    return null
  }

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <Card className="p-4 shadow-lg border-2 border-red-200 dark:border-red-900 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
            <Download className="h-5 w-5 mr-2 text-red-600 dark:text-red-500" />
            Install Emergency Care
          </h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={dismissPrompt}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Install this app for faster access during emergencies. Quick launch from your home screen.
        </p>

        {/* Internet requirement notice */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          <Wifi className="h-3 w-3 mr-1" />
          <span>Requires internet connection for all emergency features</span>
        </div>

        {isIOS ? (
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="mb-2">To install:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Tap the share icon <span className="inline-block w-5 h-5 text-center leading-5">⎙</span> at the bottom
                of your browser
              </li>
              <li>Scroll and tap "Add to Home Screen"</li>
              <li>Tap "Add" in the top right</li>
            </ol>
          </div>
        ) : (
          <Button onClick={handleInstall} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Install App
          </Button>
        )}
      </Card>
    </div>
  )
}
