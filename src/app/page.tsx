"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GraduationCap, ClapperboardIcon as ChalkboardTeacher, Shield, ArrowRight } from "lucide-react"

export default function HomePage() {
  const roles = [
    {
      title: "Student Portal",
      description: "View your attendance records and track your progress",
      icon: GraduationCap,
      href: "/student",
      color: "from-blue-600 to-indigo-700",
      hoverColor: "hover:from-blue-700 hover:to-indigo-800",
    },
    {
      title: "Lecturer Portal",
      description: "Manage classes and mark student attendance",
      icon: ChalkboardTeacher,
      href: "/lecturer",
      color: "from-amber-500 to-orange-600",
      hoverColor: "hover:from-amber-600 hover:to-orange-700",
    },
    {
      title: "Admin Portal",
      description: "Oversee the entire attendance management system",
      icon: Shield,
      href: "/admin",
      color: "from-purple-600 to-indigo-700",
      hoverColor: "hover:from-purple-700 hover:to-indigo-800",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Attendance Management System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A modern, efficient solution for tracking and managing student attendance across educational institutions
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Link href={role.href}>
                <motion.div
                  className={`bg-gradient-to-br ${role.color} ${role.hoverColor} rounded-2xl p-8 text-white cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      className="mb-6"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <role.icon className="h-16 w-16" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-4">{role.title}</h3>
                    <p className="text-lg opacity-90 mb-6">{role.description}</p>

                    <motion.div className="flex items-center space-x-2 text-lg font-medium" whileHover={{ x: 5 }}>
                      <span>Get Started</span>
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              "Real-time Attendance Tracking",
              "Comprehensive Reporting",
              "Multi-role Access Control",
              "Mobile Responsive Design",
            ].map((feature, index) => (
              <motion.div
                key={feature}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <p className="font-medium text-gray-900">{feature}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
