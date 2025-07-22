"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Layout from "../../../../components/Layout"
import { Clock, Save } from "lucide-react"
import { useStore } from "../../../../../lib/store"

export default function CreateAttendance() {
  const { classes, createAttendanceSession } = useStore()
  const lecturerId = "1" // Mock current lecturer ID

  const [formData, setFormData] = useState({
    classId: "",
    courseCode: "",
    courseTitle: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    duration: 60, // in minutes
  })

  const lecturerClasses = classes.filter((c) => c.lecturerId === lecturerId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.classId || !formData.courseCode || !formData.courseTitle || !formData.startTime) {
      alert("Please fill in all required fields")
      return
    }

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`)
    const endDateTime = new Date(startDateTime.getTime() + formData.duration * 60000)

    const session = {
      id: `session-${Date.now()}`,
      classId: formData.classId,
      courseCode: formData.courseCode,
      courseTitle: formData.courseTitle,
      date: formData.date,
      startTime: formData.startTime,
      endTime: endDateTime.toTimeString().slice(0, 5),
      duration: formData.duration,
      lecturerId,
      isActive: true,
      records: [],
      createdAt: new Date().toISOString(),
    }

    createAttendanceSession(session)

    // Reset form
    setFormData({
      classId: "",
      courseCode: "",
      courseTitle: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "",
      duration: 60,
    })

    alert("Attendance session created successfully! Students can now mark their attendance.")
  }

  const handleClassChange = (classId: string) => {
    const selectedClass = classes.find((c) => c.id === classId)
    if (selectedClass) {
      setFormData((prev) => ({
        ...prev,
        classId,
        courseTitle: selectedClass.name,
      }))
    }
  }

  return (
    <Layout userRole="lecturer">
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl font-bold text-gray-900">Create Attendance Session</h1>
          <p className="text-gray-600 mt-2">Set up a new attendance session for your students</p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Class Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                >
                  <option value="">Choose a class...</option>
                  {lecturerClasses.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name} - Year {classItem.year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.courseCode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, courseCode: e.target.value }))}
                  placeholder="e.g., CS301"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Course Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.courseTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, courseTitle: e.target.value }))}
                placeholder="e.g., Advanced Web Development"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
              </div>
            </div>

            {/* Session Info */}
            {formData.startTime && (
              <motion.div
                className="bg-indigo-50 border border-indigo-200 rounded-lg p-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <h4 className="font-medium text-indigo-900">Session Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-indigo-700 font-medium">Start:</span>
                    <p className="text-indigo-600">{formData.startTime}</p>
                  </div>
                  <div>
                    <span className="text-indigo-700 font-medium">End:</span>
                    <p className="text-indigo-600">
                      {formData.startTime &&
                      new Date(`2000-01-01T${formData.startTime}`).getTime() + formData.duration * 60000
                        ? new Date(new Date(`2000-01-01T${formData.startTime}`).getTime() + formData.duration * 60000)
                            .toTimeString()
                            .slice(0, 5)
                        : ""}
                    </p>
                  </div>
                  <div>
                    <span className="text-indigo-700 font-medium">Duration:</span>
                    <p className="text-indigo-600">{formData.duration} minutes</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="h-5 w-5" />
              <span>Create Attendance Session</span>
            </motion.button>
          </form>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="bg-amber-50 border border-amber-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="font-semibold text-amber-900 mb-3">How it works:</h3>
          <ul className="space-y-2 text-amber-800">
            <li className="flex items-start space-x-2">
              <span className="text-amber-600 mt-1">•</span>
              <span>Create an attendance session with course details and duration</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-600 mt-1">•</span>
              <span>Students will see the active session and can mark their attendance</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-600 mt-1">•</span>
              <span>Session automatically closes after the specified duration</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-600 mt-1">•</span>
              <span>Students who don't mark attendance are automatically marked absent</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </Layout>
  )
}
