"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, MapPin, MessageCircle, Heart, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isEmergency, setIsEmergency] = useState(false)

  const handleSOSClick = () => {
    setIsEmergency(true)
    // Call emergency number
    window.location.href = "tel:108"

    // Reset after 3 seconds
    setTimeout(() => {
      setIsEmergency(false)
    }, 3000)
  }

  const quickActions = [
    {
      title: "Emergency Contacts",
      description: "Quick access to your emergency contacts",
      icon: Phone,
      href: "/emergency-contacts",
      color: "bg-blue-500 dark:bg-blue-600",
    },
    {
      title: "Nearby Hospitals",
      description: "Find hospitals and medical centers near you",
      icon: MapPin,
      href: "/nearby-hospitals",
      color: "bg-green-500 dark:bg-green-600",
    },
    {
      title: "First Aid Assistant",
      description: "AI-powered first aid guidance",
      icon: MessageCircle,
      href: "/ai-assistant",
      color: "bg-purple-500 dark:bg-purple-600",
    },
    {
      title: "Blood Donors",
      description: "Connect with blood donors in your area",
      icon: Heart,
      href: "/donors",
      color: "bg-red-500 dark:bg-red-600",
    },
  ]

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12 pt-4 md:pt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Emergency Care Center</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
            Quick access to emergency services and medical assistance
          </p>

          {/* SOS Button */}
          <div className="mb-8 md:mb-12">
            <Button
              onClick={handleSOSClick}
              className={cn(
                "h-28 w-28 md:h-32 md:w-32 rounded-full text-xl md:text-2xl font-bold transition-all duration-300 transform hover:scale-110 shadow-lg",
                isEmergency
                  ? "bg-red-700 dark:bg-red-800 animate-pulse"
                  : "bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800",
              )}
              disabled={isEmergency}
            >
              {isEmergency ? (
                <div className="flex flex-col items-center">
                  <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 mb-1 md:mb-2" />
                  <span>CALLING...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Phone className="h-6 w-6 md:h-8 md:w-8 mb-1 md:mb-2" />
                  <span>SOS</span>
                </div>
              )}
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Press to call emergency services (108)</p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer dark:bg-gray-800 dark:border-gray-700 transform hover:scale-105">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start space-x-4">
                      <div className={cn("p-3 rounded-lg", action.color)}>
                        <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 md:mb-2">
                          {action.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Emergency Numbers */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
              Important Emergency Numbers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "tel:108")}
                  className="w-full dark:text-gray-200 dark:border-gray-600 transition-all duration-200 hover:scale-105"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Ambulance (108)
                </Button>
              </div>
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "tel:100")}
                  className="w-full dark:text-gray-200 dark:border-gray-600 transition-all duration-200 hover:scale-105"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Police (100)
                </Button>
              </div>
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "tel:101")}
                  className="w-full dark:text-gray-200 dark:border-gray-600 transition-all duration-200 hover:scale-105"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Fire (101)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
