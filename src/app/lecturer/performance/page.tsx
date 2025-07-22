"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Layout from "../../../components/Layout"
import { useStore } from "../../../../lib/store"
import { TrendingUp, Users, Calendar, BookOpen, Award } from "lucide-react"

export default function LecturerPerformance() {
  const { classes, attendanceSessions, students } = useStore()
  const lecturerId = "1" // Mock current lecturer ID

  const lecturerClasses = classes.filter((c) => c.lecturerId === lecturerId)

  const getClassPerformance = () => {
    return lecturerClasses.map((classItem) => {
      const classSessions = attendanceSessions.filter((s) => s.classId === classItem.id)
      const classStudents = students.filter((s) => s.classId === classItem.id)

      const totalSessions = classSessions.length
      const totalRecords = classSessions.reduce((sum, s) => sum + s.records.length, 0)
      const presentRecords = classSessions.reduce(
        (sum, s) => sum + s.records.filter((r) => r.status === "present").length,
        0,
      )

      const averageAttendance = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0

      // Calculate individual student performance
      const studentPerformance = classStudents.map((student) => {
        const studentRecords = classSessions.flatMap((s) => s.records.filter((r) => r.studentId === student.id))
        const attendedSessions = studentRecords.filter((r) => r.status === "present").length
        const attendanceRate = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0

        return {
          ...student,
          attendedSessions,
          totalSessions,
          attendanceRate,
          lastAttended: studentRecords
            .filter((r) => r.status === "present")
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date,
        }
      })

      return {
        ...classItem,
        totalSessions,
        averageAttendance,
        studentPerformance,
        lastSession: classSessions[classSessions.length - 1]?.date,
      }
    })
  }

  const classPerformance = getClassPerformance()

  return (
    <Layout userRole="lecturer">
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl font-bold text-gray-900">Student Performance</h1>
          <p className="text-gray-600 mt-2">Monitor student attendance and performance across your classes</p>
        </motion.div>

        {/* Class Performance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {classPerformance.map((classItem, index) => (
            <motion.div
              key={classItem.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{classItem.name}</h3>
                    <p className="text-indigo-100">
                      Year {classItem.year} • {classItem.department}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-indigo-200" />
                </div>
              </div>

              <div className="p-6">
                {/* Class Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{classItem.studentPerformance.length}</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{classItem.totalSessions}</div>
                    <div className="text-sm text-gray-600">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${classItem.averageAttendance >= 75 ? "text-green-600" : "text-red-600"}`}
                    >
                      {classItem.averageAttendance}%
                    </div>
                    <div className="text-sm text-gray-600">Avg Attendance</div>
                  </div>
                </div>

                {/* Performance Indicator */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Class Performance</span>
                    <span
                      className={`text-sm font-medium ${classItem.averageAttendance >= 75 ? "text-green-600" : "text-red-600"}`}
                    >
                      {classItem.averageAttendance >= 85
                        ? "Excellent"
                        : classItem.averageAttendance >= 75
                          ? "Good"
                          : "Needs Improvement"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${classItem.averageAttendance >= 75 ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${classItem.averageAttendance}%` }}
                    ></div>
                  </div>
                </div>

                <Link href={`/lecturer/performance/${classItem.id}`}>
                  <motion.button
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Student Details
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Performance Summary */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <h3 className="text-xl font-semibold text-gray-900">Performance Summary</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {classPerformance.reduce((sum, c) => sum + c.studentPerformance.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {classPerformance.reduce((sum, c) => sum + c.totalSessions, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>

            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(
                  classPerformance.reduce((sum, c) => sum + c.averageAttendance, 0) / (classPerformance.length || 1),
                )}
                %
              </div>
              <div className="text-sm text-gray-600">Overall Average</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {classPerformance.filter((c) => c.averageAttendance >= 85).length}
              </div>
              <div className="text-sm text-gray-600">Excellent Classes</div>
            </div>
          </div>
        </motion.div>

        {classPerformance.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Found</h3>
            <p className="text-gray-600 mb-4">You haven't been assigned any classes yet.</p>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
