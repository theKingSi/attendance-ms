"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import Layout from "../../../../../components/Layout"
import { Users, Upload, Plus, Edit, Trash2, BookOpen } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useStore } from "../../../../../../lib/store"

export default function ClassDetails() {
  const params = useParams()
  const classId = params.classId as string
  const { classes, students, addStudentsToClass, updateStudent, deleteStudent } = useStore()

  const [showAddForm, setShowAddForm] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: "",
    regNo: "",
    email: "",
    year: 1,
    department: "",
  })

  const classData = classes.find((c) => c.id === classId)
  const classStudents = students.filter((s) => s.classId === classId)

  const onDrop = (acceptedFiles: File[]) => {
    // Mock CSV processing
    const file = acceptedFiles[0]
    if (file) {
      // In a real app, you'd parse the CSV here
      console.log("Processing file:", file.name)
      alert("File upload functionality would be implemented here")
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  })

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.regNo || !newStudent.email) return

    const student = {
      id: `student-${Date.now()}`,
      ...newStudent,
      classId,
      department: classData?.department || newStudent.department,
    }

    addStudentsToClass(classId, [student])
    setNewStudent({ name: "", regNo: "", email: "", year: 1, department: "" })
    setShowAddForm(false)
  }

  if (!classData) {
    return (
      <Layout userRole="lecturer">
        <div className="text-center py-12">
          <p className="text-gray-500">Class not found</p>
        </div>
      </Layout>
    )
  }

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
            <BookOpen className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold">{classData.name}</h1>
              <p className="text-indigo-100 text-lg">
                {classData.subject} • Year {classData.year} • {classStudents.length} Students
              </p>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        {classStudents.length === 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Student List</h2>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? "Drop the file here" : "Drag & drop student list"}
              </p>
              <p className="text-gray-600">
                Supports CSV, XLS, XLSX files or <span className="text-indigo-600 font-medium">browse files</span>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4">Or add students manually</p>
              <motion.button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-5 w-5" />
                <span>Add Student Manually</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Add Student Form */}
        {showAddForm && (
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Student</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Student Name"
                value={newStudent.name}
                onChange={(e) => setNewStudent((prev) => ({ ...prev, name: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Registration Number"
                value={newStudent.regNo}
                onChange={(e) => setNewStudent((prev) => ({ ...prev, regNo: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newStudent.email}
                onChange={(e) => setNewStudent((prev) => ({ ...prev, email: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <select
                value={newStudent.year}
                onChange={(e) => setNewStudent((prev) => ({ ...prev, year: Number.parseInt(e.target.value) }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
              </select>
            </div>

            <div className="flex space-x-3 mt-4">
              <motion.button
                onClick={handleAddStudent}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Student
              </motion.button>
              <motion.button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Students List */}
        {classStudents.length > 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Students ({classStudents.length})</h3>
              </div>
              <motion.button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-4 w-4" />
                <span>Add Student</span>
              </motion.button>
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classStudents.map((student, index) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <motion.button
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => deleteStudent(student.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
