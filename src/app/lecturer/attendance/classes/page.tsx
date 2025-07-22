"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Layout from "../../../../components/Layout"
import { BookOpen, Users, Calendar, Plus } from "lucide-react"
import { useStore } from "../../../../../lib/store"

export default function LecturerClasses() {
  const { classes } = useStore()
  const lecturerId = "1" // Mock current lecturer ID

  const lecturerClasses = classes.filter((c) => c.lecturerId === lecturerId)

  return (
    <Layout userRole="lecturer">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
            <p className="text-gray-600 mt-2">Manage your classes and students</p>
          </div>

          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="h-4 w-4" />
            <span>Add Class</span>
          </motion.button>
        </motion.div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lecturerClasses.map((classItem, index) => (
            <motion.div
              key={classItem.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-white" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{classItem.name}</h3>
                    <p className="text-indigo-100 text-sm">{classItem.subject}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{classItem.students.length} Students</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Year {classItem.year}</span>
                  </div>
                  <div className="text-sm text-gray-600">Department: {classItem.department}</div>
                </div>

                <Link href={`/lecturer/attendance/classes/${classItem.id}`}>
                  <motion.button
                    className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {lecturerClasses.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Found</h3>
            <p className="text-gray-600 mb-4">You haven't been assigned any classes yet.</p>
            <motion.button
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Administrator
            </motion.button>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
