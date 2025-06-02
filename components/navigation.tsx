"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone, MapPin, MessageCircle, Heart, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"

export function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/emergency-contacts", label: "Emergency Contacts", icon: Phone },
    { href: "/nearby-hospitals", label: "Nearby Hospitals", icon: MapPin },
    { href: "/ai-assistant", label: "First Aid AI", icon: MessageCircle },
    { href: "/donors", label: "Blood Donors", icon: Heart },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white dark:bg-gray-900 shadow-lg border-b-2 border-red-200 dark:border-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Heart className="h-8 w-8 text-red-600 dark:text-red-500" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Emergency Care</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors",
                        pathname === item.href
                          ? "border-red-500 text-red-600 dark:text-red-500"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-gray-300",
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 transition-colors",
                  pathname === item.href
                    ? "text-red-600 dark:text-red-500"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label.split(" ")[0]}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center h-14 px-4">
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-red-600 dark:text-red-500" />
            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">Emergency Care</span>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile spacing for bottom nav */}
      <div className="md:hidden h-16"></div>
    </>
  )
}
