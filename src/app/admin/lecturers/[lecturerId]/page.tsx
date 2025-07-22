"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import Layout from "../../../../components/Layout"
import { Users, BookOpen, Mail, Calendar, ArrowRight } from "lucide-react"
import { useStore } from "../../../../../lib/store"

export default function LecturerDetails() {
  const params = useParams()
  const lecturerId = params.lecturerId as string
  const { lecturers, classes, attendanceSessions } = useStore()

  const lecturer = lecturers.find((l) => l.id === lecturerId)
  const lecturerClasses = classes.filter((c) => c.lecturerId === lecturerId)
  const lecturerSessions = attendanceSessions.filter((s) => s.lecturerId === lecturerId)

  if (!lecturer) {
    return (
      <Layout userRole="admin">
        <div className="text-center py-12">
          <p className="text-gray-500">Lecturer not found</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{lecturer.name}</h1>
              <p className="text-blue-100 text-lg">{lecturer.department}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Mail className="h-4 w-4" />
                <span className="text-blue-100">{lecturer.email}</span>
              </div>
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
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{lecturerClasses.length}</p>
                <p className="text-gray-600">Classes</p>
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
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {lecturerClasses.reduce((sum, c) => sum + c.students.length, 0)}
                </p>
                <p className="text-gray-600">Students</p>
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
              <Calendar className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{lecturerSessions.length}</p>
                <p className="text-gray-600">Sessions</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Classes */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Classes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lecturerClasses.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">{classItem.name}</h4>
                    <p className="text-sm text-gray-600">
                      {classItem.students.length} students • Year {classItem.year} • {classItem.department}
                    </p>
                  </div>
                  <Link href={`/admin/lecturers/${lecturerId}/${classItem.id}`}>
                    <motion.button
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>View Students</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>

            {lecturerClasses.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No classes assigned yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
