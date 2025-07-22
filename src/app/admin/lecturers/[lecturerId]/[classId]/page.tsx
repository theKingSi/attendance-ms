"use client"

import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import Layout from "../../../../../components/Layout"
import { useStore } from "../../../../../lib/store"
import { Users, BookOpen, Calendar } from "lucide-react"

export default function ClassStudents() {
  const params = useParams()
  const lecturerId = params.lecturerId as string
  const classId = params.classId as string
  const { lecturers, classes, students, attendanceSessions } = useStore()

  const lecturer = lecturers.find((l) => l.id === lecturerId)
  const classData = classes.find((c) => c.id === classId)
  const classStudents = students.filter((s) => s.classId === classId)
  const classSessions = attendanceSessions.filter((s) => s.classId === classId)

  if (!lecturer || !classData) {
    return (
      <Layout userRole="admin">
        <div className="text-center py-12">
          <p className="text-gray-500">Class or lecturer not found</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <BookOpen className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold">{classData.name}</h1>
              <p className="text-indigo-100 text-lg">
                {lecturer.name} • {classStudents.length} Students • Year {classData.year}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{classStudents.length}</p>
                <p className="text-gray-600">Total Students</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{classSessions.length}</p>
                <p className="text-gray-600">Sessions Held</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {classSessions.reduce((sum, s) => {
                    const present = s.records.filter((r) => r.status === "present").length
                    const total = s.records.length
                    return sum + (total > 0 ? (present / total) * 100 : 0)
                  }, 0) / (classSessions.length || 1)}
                  %
                </p>
                <p className="text-gray-600">Avg Attendance</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Students Table */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Students</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reg No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classStudents.map((student, index) => {
                  const studentRecords = classSessions.flatMap((s) =>
                    s.records.filter((r) => r.studentId === student.id),
                  )
                  const presentCount = studentRecords.filter((r) => r.status === "present").length
                  const attendanceRate =
                    studentRecords.length > 0 ? Math.round((presentCount / studentRecords.length) * 100) : 0

                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.regNo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Year {student.year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${attendanceRate >= 75 ? "text-green-600" : "text-red-600"}`}
                        >
                          {attendanceRate}%
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {classStudents.length === 0 && (
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
