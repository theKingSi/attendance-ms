"use client"

import { motion } from "framer-motion"
import Layout from "../../components/Layout"
import StatsCard from "../../components/StatsCard"
import { Calendar, CheckCircle, TrendingUp, Clock, Award, Target } from "lucide-react"
import { useStore } from "../../../lib/store"

export default function StudentDashboard() {
  const { attendanceSessions, classes } = useStore()
  const studentId = "1" // Mock current student ID

  // Calculate semester performance
  const studentRecords = attendanceSessions.flatMap((session) =>
    session.records.filter((record) => record.studentId === studentId),
  )

  const totalClasses = studentRecords.length
  const presentCount = studentRecords.filter((record) => record.status === "present").length
  const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0

  // Calculate performance by class
  const classPerformance = classes
    .map((classItem) => {
      const classRecords = studentRecords.filter((record) =>
        attendanceSessions.find((session) => session.id === record.id && session.classId === classItem.id),
      )
      const classPresent = classRecords.filter((record) => record.status === "present").length
      const classTotal = classRecords.length
      const classRate = classTotal > 0 ? Math.round((classPresent / classTotal) * 100) : 0

      return {
        ...classItem,
        attendedSessions: classPresent,
        totalSessions: classTotal,
        attendanceRate: classRate,
      }
    })
    .filter((c) => c.totalSessions > 0)

  // Recent attendance sessions
  const recentSessions = attendanceSessions
    .filter((session) => session.records.some((record) => record.studentId === studentId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Layout userRole="student">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
              <p className="text-indigo-100 text-lg">Here's your semester performance overview</p>
              <div className="mt-4 flex items-center space-x-6">
                <div>
                  <span className="text-2xl font-bold">{attendancePercentage}%</span>
                  <p className="text-indigo-200 text-sm">Overall Attendance</p>
                </div>
                <div>
                  <span className="text-2xl font-bold">{presentCount}</span>
                  <p className="text-indigo-200 text-sm">Classes Attended</p>
                </div>
                <div>
                  <span className="text-2xl font-bold">{classPerformance.length}</span>
                  <p className="text-indigo-200 text-sm">Active Classes</p>
                </div>
              </div>
            </div>
            <motion.div
              className="hidden md:block"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Calendar className="h-16 w-16 text-indigo-200" />
            </motion.div>
          </div>
        </motion.div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Classes" value={totalClasses} icon={Calendar} color="blue" />
          <StatsCard
            title="Classes Attended"
            value={presentCount}
            icon={CheckCircle}
            color="green"
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Attendance Rate"
            value={`${attendancePercentage}%`}
            icon={TrendingUp}
            color={attendancePercentage >= 75 ? "green" : "red"}
            trend={{ value: attendancePercentage >= 75 ? 2 : -3, isPositive: attendancePercentage >= 75 }}
          />
          <StatsCard
            title="Performance"
            value={attendancePercentage >= 90 ? "Excellent" : attendancePercentage >= 75 ? "Good" : "At Risk"}
            icon={Award}
            color={attendancePercentage >= 90 ? "green" : attendancePercentage >= 75 ? "amber" : "red"}
          />
        </div>

        {/* Class-wise Performance */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Class Performance</h3>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {classPerformance.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{classItem.name}</h4>
                    <p className="text-sm text-gray-600">
                      {classItem.attendedSessions} / {classItem.totalSessions} sessions attended
                    </p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${classItem.attendanceRate >= 75 ? "bg-green-500" : "bg-red-500"}`}
                        style={{ width: `${classItem.attendanceRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div
                      className={`text-2xl font-bold ${
                        classItem.attendanceRate >= 75 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {classItem.attendanceRate}%
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        classItem.attendanceRate >= 90
                          ? "bg-green-100 text-green-800"
                          : classItem.attendanceRate >= 75
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {classItem.attendanceRate >= 90
                        ? "Excellent"
                        : classItem.attendanceRate >= 75
                          ? "Good"
                          : "At Risk"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {classPerformance.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No attendance records found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Attendance</h3>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {recentSessions.map((session, index) => {
                const studentRecord = session.records.find((record) => record.studentId === studentId)
                const classData = classes.find((c) => c.id === session.classId)

                return (
                  <motion.div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{session.courseTitle}</h4>
                      <p className="text-sm text-gray-600">
                        {session.courseCode} • {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {studentRecord?.status === "present" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium capitalize ${
                          studentRecord?.status === "present" ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {studentRecord?.status || "absent"}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {recentSessions.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent attendance sessions</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
