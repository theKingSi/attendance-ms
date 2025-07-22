"use client"

import { motion } from "framer-motion"
import Layout from "../../components/Layout"
import StatsCard from "../../components/StatsCard"
import { Users, BookOpen, GraduationCap, TrendingUp, Calendar, UserCheck } from "lucide-react"
import { useStore } from "../../../lib/store"

export default function AdminDashboard() {
  const { lecturers, students, classes, attendanceSessions } = useStore()

  // Calculate stats
  const totalLecturers = lecturers.length
  const totalStudents = students.length
  const totalClasses = classes.length
  const totalSessions = attendanceSessions.length

  // Calculate attendance rate
  const totalRecords = attendanceSessions.reduce((sum, session) => sum + session.records.length, 0)
  const presentRecords = attendanceSessions.reduce(
    (sum, session) => sum + session.records.filter((record) => record.status === "present").length,
    0,
  )
  const attendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0

  return (
    <Layout userRole="admin">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-purple-100 text-lg">Manage your institution's attendance system</p>
            </div>
            <motion.div
              className="hidden md:block"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Users className="h-16 w-16 text-purple-200" />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Lecturers"
            value={totalLecturers}
            icon={Users}
            color="blue"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Total Students"
            value={totalStudents}
            icon={GraduationCap}
            color="green"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard title="Total Classes" value={totalClasses} icon={BookOpen} color="amber" />
          <StatsCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            icon={TrendingUp}
            color={attendanceRate >= 75 ? "green" : "red"}
            trend={{ value: attendanceRate >= 75 ? 5 : -2, isPositive: attendanceRate >= 75 }}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sessions */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {attendanceSessions.slice(0, 5).map((session, index) => {
                  const classData = classes.find((c) => c.id === session.classId)
                  const lecturer = lecturers.find((l) => l.id === session.lecturerId)
                  const presentCount = session.records.filter((r) => r.status === "present").length

                  return (
                    <motion.div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{classData?.name}</h4>
                        <p className="text-sm text-gray-600">
                          {lecturer?.name} • {new Date(session.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {presentCount}/{session.records.length}
                        </div>
                        <div className="text-xs text-gray-500">Present</div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Top Performing Classes */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <UserCheck className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Classes</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {classes.map((classItem, index) => {
                  const classSessions = attendanceSessions.filter((s) => s.classId === classItem.id)
                  const totalRecords = classSessions.reduce((sum, s) => sum + s.records.length, 0)
                  const presentRecords = classSessions.reduce(
                    (sum, s) => sum + s.records.filter((r) => r.status === "present").length,
                    0,
                  )
                  const rate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0

                  return (
                    <motion.div
                      key={classItem.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                        <p className="text-sm text-gray-600">
                          {classItem.students.length} students • Year {classItem.year}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${rate >= 75 ? "text-green-600" : "text-red-600"}`}>
                          {rate}%
                        </div>
                        <div className="text-xs text-gray-500">Attendance</div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
