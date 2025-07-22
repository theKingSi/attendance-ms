"use client"

import { motion } from "framer-motion"
import Layout from "../../components/Layout"
import StatsCard from "../../components/StatsCard"
import { BookOpen, Users, Calendar, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import { useStore } from "../../../lib/store"

export default function LecturerDashboard() {
  const { classes, attendanceSessions, students } = useStore()
  const lecturerId = "1" // Mock current lecturer ID

  // Calculate stats
  const lecturerClasses = classes.filter((c) => c.lecturerId === lecturerId)
  const totalStudents = lecturerClasses.reduce((sum, c) => sum + c.students.length, 0)
  const recentSessions = attendanceSessions.filter((s) => s.lecturerId === lecturerId).length

  return (
    <Layout userRole="lecturer">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, Dr. Cooper!</h1>
              <p className="text-amber-100 text-lg">Manage your classes and track student attendance</p>
            </div>
            <motion.div
              className="hidden md:block"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <BookOpen className="h-16 w-16 text-amber-200" />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="My Classes" value={lecturerClasses.length} icon={BookOpen} color="blue" />
          <StatsCard title="Total Students" value={totalStudents} icon={Users} color="green" />
          <StatsCard title="Attendance Sessions" value={recentSessions} icon={Calendar} color="amber" />
          <StatsCard
            title="Avg. Attendance"
            value="87%"
            icon={TrendingUp}
            color="green"
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/lecturer/attendance/create">
              <motion.div
                className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="bg-indigo-600 p-3 rounded-lg">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create Attendance</h3>
                  <p className="text-sm text-gray-600">Mark attendance for your classes</p>
                </div>
              </motion.div>
            </Link>

            <Link href="/lecturer/attendance/classes">
              <motion.div
                className="flex items-center space-x-4 p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="bg-amber-600 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Classes</h3>
                  <p className="text-sm text-gray-600">View and manage your classes</p>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Classes */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">My Classes</h3>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {lecturerClasses.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">{classItem.name}</h4>
                    <p className="text-sm text-gray-600">
                      {classItem.students.length} students • Year {classItem.year}
                    </p>
                  </div>
                  <Link href={`/lecturer/attendance/classes/${classItem.id}`}>
                    <motion.button
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Details
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
