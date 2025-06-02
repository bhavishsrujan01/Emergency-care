"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Plus, User, Trash2, X } from "lucide-react"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
}

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  })

  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const [isLongPressing, setIsLongPressing] = useState<string | null>(null)

  useEffect(() => {
    // Load contacts from localStorage
    const savedContacts = localStorage.getItem("emergency-contacts")
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    }
  }, [])

  const saveContacts = (updatedContacts: EmergencyContact[]) => {
    setContacts(updatedContacts)
    localStorage.setItem("emergency-contacts", JSON.stringify(updatedContacts))
  }

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return

    const newContactWithId = {
      ...newContact,
      id: Date.now().toString(),
    }

    const updatedContacts = [...contacts, newContactWithId]
    saveContacts(updatedContacts)
    setNewContact({ name: "", phone: "", relationship: "" })
    setIsAdding(false)
  }

  const deleteContact = (id: string) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id)
    saveContacts(updatedContacts)
    setShowDeleteConfirm(null)
  }

  const callContact = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleLongPressStart = (contactId: string) => {
    setIsLongPressing(contactId)
    longPressTimer.current = setTimeout(() => {
      setShowDeleteConfirm(contactId)
      setIsLongPressing(null)
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }, 800) // 800ms long press
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    setIsLongPressing(null)
  }

  const handleContactClick = (phone: string, contactId: string) => {
    // If not long pressing, make the call
    if (!isLongPressing) {
      callContact(phone)
    }
  }

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8 pt-4 md:pt-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Emergency Contacts</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tap to call • Long press to delete</p>
          </div>
          <Button onClick={() => setIsAdding(true)} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Add Contact Form */}
        {isAdding && (
          <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Add New Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Enter contact name"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="relationship" className="text-gray-700 dark:text-gray-300">
                  Relationship
                </Label>
                <Input
                  id="relationship"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  placeholder="e.g., Family, Friend, Doctor"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <Button onClick={addContact} className="w-full md:w-auto">
                  Add Contact
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                  className="w-full md:w-auto dark:text-gray-200 dark:border-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contacts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <Card
              key={contact.id}
              className={`transition-all duration-200 cursor-pointer select-none dark:bg-gray-800 dark:border-gray-700 ${
                isLongPressing === contact.id
                  ? "scale-95 shadow-lg bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : "hover:shadow-lg"
              }`}
              onMouseDown={() => handleLongPressStart(contact.id)}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={() => handleLongPressStart(contact.id)}
              onTouchEnd={handleLongPressEnd}
              onTouchCancel={handleLongPressEnd}
              onClick={() => handleContactClick(contact.phone, contact.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Contact Icon */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isLongPressing === contact.id
                          ? "bg-red-100 dark:bg-red-900/50"
                          : "bg-blue-100 dark:bg-blue-900/50"
                      }`}
                    >
                      <User
                        className={`h-6 w-6 ${
                          isLongPressing === contact.id
                            ? "text-red-600 dark:text-red-400"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{contact.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{contact.relationship}</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-mono">{contact.phone}</p>
                  </div>

                  {/* Call Button */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isLongPressing === contact.id
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {isLongPressing === contact.id ? (
                        <Trash2 className="h-5 w-5 text-white" />
                      ) : (
                        <Phone className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Long Press Progress Indicator */}
                {isLongPressing === contact.id && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-red-600 dark:bg-red-500 h-1 rounded-full animate-pulse"
                        style={{
                          width: "100%",
                          animation: "progress 0.8s linear forwards",
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 text-center">Hold to delete...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {contacts.length === 0 && !isAdding && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Emergency Contacts</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Add your emergency contacts for quick access during emergencies.
              </p>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Contact
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <Trash2 className="h-5 w-5 mr-2 text-red-600 dark:text-red-500" />
                  Delete Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{contacts.find((c) => c.id === showDeleteConfirm)?.name}</span>? This
                  action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 dark:text-gray-200 dark:border-gray-600"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={() => deleteContact(showDeleteConfirm)}
                    className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}
