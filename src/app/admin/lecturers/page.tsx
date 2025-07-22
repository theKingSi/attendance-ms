"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Layout from "../../../components/Layout"
import { Users, BookOpen, Mail, Plus } from "lucide-react"
import { useStore } from "../../../../lib/store"

export default function AdminLecturers() {
  const { lecturers, classes } = useStore()

  return (
    <Layout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lecturers</h1>
            <p className="text-gray-600 mt-2">Manage lecturers and their classes</p>
          </div>

          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="h-4 w-4" />
            <span>Add Lecturer</span>
          </motion.button>
        </motion.div>

        {/* Lecturers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lecturers.map((lecturer, index) => {
            const lecturerClasses = classes.filter((c) => c.lecturerId === lecturer.id)
            const totalStudents = lecturerClasses.reduce((sum, c) => sum + c.students.length, 0)

            return (
              <motion.div
                key={lecturer.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{lecturer.name}</h3>
                      <p className="text-blue-100">{lecturer.department}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{lecturer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm">{lecturerClasses.length} Classes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{totalStudents} Students</span>
                    </div>
                  </div>

                  <Link href={`/admin/lecturers/${lecturer.id}`}>
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
            )
          })}
        </div>

        {lecturers.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Lecturers Found</h3>
            <p className="text-gray-600 mb-4">Start by adding your first lecturer.</p>
            <motion.button
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Lecturer
            </motion.button>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
