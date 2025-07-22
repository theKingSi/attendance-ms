"use client"

import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import Layout from "../../../../components/Layout"

import { Users, TrendingUp, Calendar, Award, AlertTriangle } from "lucide-react"
import { useStore } from "../../../../../lib/store"

export default function ClassStudentPerformance() {
  const params = useParams()
  const classId = params.classId as string
  const { classes, attendanceSessions, students } = useStore()

  const classData = classes.find((c) => c.id === classId)
  const classSessions = attendanceSessions.filter((s) => s.classId === classId)
  const classStudents = students.filter((s) => s.classId === classId)

  if (!classData) {
    return (
      <Layout userRole="lecturer">
        <div className="text-center py-12">
          <p className="text-gray-500">Class not found</p>
        </div>
      </Layout>
    )
  }

  const getStudentPerformance = () => {
    return classStudents.map((student) => {
      const studentRecords = classSessions.flatMap((s) => s.records.filter((r) => r.studentId === student.id))
      const attendedSessions = studentRecords.filter((r) => r.status === "present").length
      const totalSessions = classSessions.length
      const attendanceRate = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0

      const recentSessions = studentRecords
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

      return {
        ...student,
        attendedSessions,
        totalSessions,
        attendanceRate,
        recentSessions,
        lastAttended: studentRecords
          .filter((r) => r.status === "present")
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date,
      }
    })
  }

  const studentPerformance = getStudentPerformance()
  const totalSessions = classSessions.length
  const averageAttendance = Math.round(
    studentPerformance.reduce((sum, s) => sum + s.attendanceRate, 0) / (studentPerformance.length || 1),
  )

  const excellentStudents = studentPerformance.filter((s) => s.attendanceRate >= 90).length
  const goodStudents = studentPerformance.filter((s) => s.attendanceRate >= 75 && s.attendanceRate < 90).length
  const atRiskStudents = studentPerformance.filter((s) => s.attendanceRate < 75).length

  return (
    <Layout userRole="lecturer">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <Users className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold">{classData.name}</h1>
              <p className="text-indigo-100 text-lg">
                Student Performance Analysis • {studentPerformance.length} Students • {totalSessions} Sessions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            className="bg-green-50 rounded-xl p-6 border border-green-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{excellentStudents}</p>
                <p className="text-gray-600">Excellent (90%+)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-blue-50 rounded-xl p-6 border border-blue-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{goodStudents}</p>
                <p className="text-gray-600">Good (75-89%)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-red-50 rounded-xl p-6 border border-red-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{atRiskStudents}</p>
                <p className="text-gray-600">At Risk (&lt;75%)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-purple-50 rounded-xl p-6 border border-purple-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{averageAttendance}%</p>
                <p className="text-gray-600">Class Average</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Student Performance Table */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Individual Student Performance</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sessions Attended
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Attended
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recent Pattern
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentPerformance
                  .sort((a, b) => b.attendanceRate - a.attendanceRate)
                  .map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.regNo}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div
                              className={`text-lg font-bold ${
                                student.attendanceRate >= 90
                                  ? "text-green-600"
                                  : student.attendanceRate >= 75
                                    ? "text-blue-600"
                                    : "text-red-600"
                              }`}
                            >
                              {student.attendanceRate}%
                            </div>
                            <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${
                                  student.attendanceRate >= 90
                                    ? "bg-green-500"
                                    : student.attendanceRate >= 75
                                      ? "bg-blue-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${student.attendanceRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.attendedSessions} / {student.totalSessions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.lastAttended ? new Date(student.lastAttended).toLocaleDateString() : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.attendanceRate >= 90
                              ? "bg-green-100 text-green-800"
                              : student.attendanceRate >= 75
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.attendanceRate >= 90
                            ? "Excellent"
                            : student.attendanceRate >= 75
                              ? "Good"
                              : "At Risk"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {student.recentSessions.slice(0, 5).map((session, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                session.status === "present" ? "bg-green-500" : "bg-red-500"
                              }`}
                              title={`${new Date(session.date).toLocaleDateString()} - ${session.status}`}
                            ></div>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>

          {studentPerformance.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No students enrolled in this class</p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}
