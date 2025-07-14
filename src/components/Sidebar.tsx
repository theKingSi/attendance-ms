"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Home,
  Users,
  Calendar,
  BookOpen,
  UserCheck,
  Settings,
  X,
  GraduationCap,
  ClapperboardIcon as ChalkboardTeacher,
  Shield,
  TrendingUp,
  LogOut,
} from "lucide-react"

interface SidebarProps {
  userRole: "student" | "lecturer" | "admin"
  onClose: () => void
}

const menuItems = {
  student: [
    { name: "Dashboard", href: "/student", icon: Home },
    { name: "Take Attendance", href: "/student/attendance", icon: UserCheck },
    { name: "My Records", href: "/student/records", icon: Calendar },
  ],
  lecturer: [
    { name: "Dashboard", href: "/lecturer", icon: Home },
    { name: "Create Attendance", href: "/lecturer/attendance/create", icon: Calendar },
    { name: "My Classes", href: "/lecturer/attendance/classes", icon: BookOpen },
    { name: "Student Performance", href: "/lecturer/performance", icon: TrendingUp },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Lecturers", href: "/admin/lecturers", icon: Users },
    { name: "Performance", href: "/admin/performance", icon: TrendingUp },
    { name: "Pending Accounts", href: "/admin/accounts", icon: UserCheck },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
}

const roleIcons = {
  student: GraduationCap,
  lecturer: ChalkboardTeacher,
  admin: Shield,
}

const roleColors = {
  student: "from-blue-600 to-indigo-700",
  lecturer: "from-amber-500 to-orange-600",
  admin: "from-purple-600 to-indigo-700",
}

export default function Sidebar({ userRole, onClose }: SidebarProps) {
  const pathname = usePathname()
  const RoleIcon = roleIcons[userRole]

  return (
    <motion.div
      className="h-full bg-white shadow-xl border-r border-gray-200"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`bg-gradient-to-r ${roleColors[userRole]} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RoleIcon className="h-8 w-8" />
              <div>
                <h2 className="text-lg font-semibold capitalize">{userRole}</h2>
                <p className="text-sm opacity-90">Portal</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 rounded-md hover:bg-white/20 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems[userRole].map((item, index) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                      isActive ? "text-indigo-700" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <motion.button
            onClick={() => {
              // Handle logout logic here
              console.log("Logout clicked")
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
