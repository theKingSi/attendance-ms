"use client"

import { motion } from "framer-motion"
import Layout from "../../../components/Layout"
import StatsCard from "../../../components/StatsCard"
import { TrendingUp, Calendar, Award, Target } from "lucide-react"
import { useStore } from "../../../../lib/store"

export default function AdminPerformance() {
  const { lecturers, classes, attendanceSessions, students } = useStore()

  // Calculate performance metrics
  const calculateLecturerPerformance = () => {
    return lecturers.map((lecturer) => {
      const lecturerClasses = classes.filter((c) => c.lecturerId === lecturer.id)
      const lecturerSessions = attendanceSessions.filter((s) => s.lecturerId === lecturer.id)

      const totalStudents = lecturerClasses.reduce((sum, c) => sum + c.students.length, 0)
      const totalSessions = lecturerSessions.length

      const totalRecords = lecturerSessions.reduce((sum, s) => sum + s.records.length, 0)
      const presentRecords = lecturerSessions.reduce(
        (sum, s) => sum + s.records.filter((r) => r.status === "present").length,
        0,
      )

      const averageAttendance = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0

      return {
        ...lecturer,
        totalClasses: lecturerClasses.length,
        totalStudents,
        totalSessions,
        averageAttendance,
        lastSession: lecturerSessions[lecturerSessions.length - 1]?.date || "N/A",
      }
    })
  }

  const lecturerPerformance = calculateLecturerPerformance()
  const totalSessions = attendanceSessions.length
  const activeSessions = attendanceSessions.filter((s) => s.isActive).length
  const overallAttendanceRate = Math.round(
    attendanceSessions.reduce((sum, s) => {
      const present = s.records.filter((r) => r.status === "present").length
      const total = s.records.length
      return sum + (total > 0 ? (present / total) * 100 : 0)
    }, 0) / (attendanceSessions.length || 1),
  )

  return (
    <Layout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-2">Monitor lecturer and class performance across the institution</p>
        </motion.div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Sessions"
            value={totalSessions}
            icon={Calendar}
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard title="Active Sessions" value={activeSessions} icon={Target} color="green" />
          <StatsCard
            title="Overall Attendance"
            value={`${overallAttendanceRate}%`}
            icon={TrendingUp}
            color={overallAttendanceRate >= 75 ? "green" : "red"}
            trend={{ value: overallAttendanceRate >= 75 ? 5 : -3, isPositive: overallAttendanceRate >= 75 }}
          />
          <StatsCard
            title="Top Performers"
            value={lecturerPerformance.filter((l) => l.averageAttendance >= 85).length}
            icon={Award}
            color="amber"
          />
        </div>

        {/* Lecturer Performance Table */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Lecturer Performance</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lecturer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lecturerPerformance.map((lecturer, index) => (
                  <motion.tr
                    key={lecturer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lecturer.name}</div>
                        <div className="text-sm text-gray-500">{lecturer.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lecturer.totalClasses}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lecturer.totalStudents}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lecturer.totalSessions}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          lecturer.averageAttendance >= 85
                            ? "text-green-600"
                            : lecturer.averageAttendance >= 70
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {lecturer.averageAttendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lecturer.lastSession !== "N/A" ? new Date(lecturer.lastSession).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          lecturer.averageAttendance >= 85
                            ? "bg-green-100 text-green-800"
                            : lecturer.averageAttendance >= 70
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {lecturer.averageAttendance >= 85
                          ? "Excellent"
                          : lecturer.averageAttendance >= 70
                            ? "Good"
                            : "Needs Improvement"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Class Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Classes</h3>
            <div className="space-y-4">
              {classes
                .map((classItem) => {
                  const classSessions = attendanceSessions.filter((s) => s.classId === classItem.id)
                  const totalRecords = classSessions.reduce((sum, s) => sum + s.records.length, 0)
                  const presentRecords = classSessions.reduce(
                    (sum, s) => sum + s.records.filter((r) => r.status === "present").length,
                    0,
                  )
                  const rate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0
                  return { ...classItem, attendanceRate: rate, totalSessions: classSessions.length }
                })
                .sort((a, b) => b.attendanceRate - a.attendanceRate)
                .slice(0, 5)
                .map((classItem, index) => (
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
                        {classItem.totalSessions} sessions • {classItem.students.length} students
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${classItem.attendanceRate >= 75 ? "text-green-600" : "text-red-600"}`}
                      >
                        {classItem.attendanceRate}%
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
            <div className="space-y-4">
              {Array.from(new Set(lecturers.map((l) => l.department))).map((department, index) => {
                const deptLecturers = lecturers.filter((l) => l.department === department)
                const deptClasses = classes.filter((c) => deptLecturers.some((l) => l.id === c.lecturerId))
                const deptSessions = attendanceSessions.filter((s) => deptLecturers.some((l) => l.id === s.lecturerId))

                const totalRecords = deptSessions.reduce((sum, s) => sum + s.records.length, 0)
                const presentRecords = deptSessions.reduce(
                  (sum, s) => sum + s.records.filter((r) => r.status === "present").length,
                  0,
                )
                const rate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0

                return (
                  <motion.div
                    key={department}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{department}</h4>
                      <p className="text-sm text-gray-600">
                        {deptLecturers.length} lecturers • {deptClasses.length} classes
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${rate >= 75 ? "text-green-600" : "text-red-600"}`}>
                        {rate}%
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
