"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Menu, Bell, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"

interface HeaderProps {
  onMenuClick: () => void
  userRole: "student" | "lecturer" | "admin"
}

export default function Header({ onMenuClick, userRole }: HeaderProps) {
  const getUserName = () => {
    switch (userRole) {
      case "student":
        return "John Doe"
      case "lecturer":
        return "Dr. Alice Cooper"
      case "admin":
        return "Admin User"
      default:
        return "User"
    }
  }

  // Add state for dropdowns
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications || showUserMenu) {
        setShowNotifications(false)
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showNotifications, showUserMenu])

  return (
    <motion.header
      className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </motion.button>

          <div>
            <h1 className="text-xl font-semibold text-gray-900">Attendance Management System</h1>
            <p className="text-sm text-gray-500 capitalize">{userRole} Dashboard</p>
          </div>
        </div>

        {/* Replace the notification and user sections with: */}
        <div className="flex items-center space-x-4">
          {/* Notifications Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">New attendance session created</p>
                        <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors text-red-600">
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
