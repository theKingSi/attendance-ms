"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "../../../components/Layout"
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useStore } from "../../../../lib/store"

export default function StudentAttendance() {
  const { attendanceSessions, markAttendance, classes } = useStore()
  const studentId = "1" // Mock current student ID
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Get active sessions for the student
  const getActiveSessions = () => {
    return attendanceSessions.filter((session) => {
      const sessionDate = new Date(session.date)
      const sessionStart = new Date(`${session.date}T${session.startTime}`)
      const sessionEnd = new Date(sessionStart.getTime() + session.duration * 60000)

      // Check if session is today and currently active
      const isToday = sessionDate.toDateString() === currentTime.toDateString()
      const isActive = currentTime >= sessionStart && currentTime <= sessionEnd

      return session.isActive && isToday && isActive
    })
  }

  // Get upcoming sessions (today but not started yet)
  const getUpcomingSessions = () => {
    return attendanceSessions.filter((session) => {
      const sessionDate = new Date(session.date)
      const sessionStart = new Date(`${session.date}T${session.startTime}`)

      const isToday = sessionDate.toDateString() === currentTime.toDateString()
      const isUpcoming = currentTime < sessionStart

      return session.isActive && isToday && isUpcoming
    })
  }

  // Get past sessions
  const getPastSessions = () => {
    return attendanceSessions
      .filter((session) => {
        const sessionDate = new Date(session.date)
        const sessionStart = new Date(`${session.date}T${session.startTime}`)
        const sessionEnd = new Date(sessionStart.getTime() + session.duration * 60000)

        return currentTime > sessionEnd || !session.isActive
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const activeSessions = getActiveSessions()
  const upcomingSessions = getUpcomingSessions()
  const pastSessions = getPastSessions()

  const handleMarkAttendance = (sessionId: string, status: "present" | "absent") => {
    markAttendance(sessionId, studentId, status)
  }

  const getTimeRemaining = (session: any) => {
    const sessionStart = new Date(`${session.date}T${session.startTime}`)
    const sessionEnd = new Date(sessionStart.getTime() + session.duration * 60000)
    const remaining = sessionEnd.getTime() - currentTime.getTime()

    if (remaining <= 0) return "Expired"

    const minutes = Math.floor(remaining / 60000)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m remaining`
    }
    return `${minutes}m remaining`
  }

  return (
    <Layout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl font-bold text-gray-900">Take Attendance</h1>
          <p className="text-gray-600 mt-2">Mark your attendance for active sessions</p>
          <div className="mt-2 text-sm text-gray-500">Current time: {currentTime.toLocaleString()}</div>
        </motion.div>

        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <motion.div
            className="bg-green-50 border border-green-200 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-green-900">Active Sessions</h2>
            </div>

            <div className="space-y-4">
              {activeSessions.map((session, index) => {
                const classData = classes.find((c) => c.id === session.classId)
                const hasMarked = session.records.some((record) => record.studentId === studentId)
                const studentRecord = session.records.find((record) => record.studentId === studentId)

                return (
                  <motion.div
                    key={session.id}
                    className="bg-white rounded-lg p-6 border border-green-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{session.courseTitle}</h3>
                        <p className="text-gray-600">{session.courseCode}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>📅 {new Date(session.date).toLocaleDateString()}</span>
                          <span>
                            🕐 {session.startTime} - {session.endTime}
                          </span>
                          <span>⏱️ {getTimeRemaining(session)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-600 font-medium mb-2">🟢 ACTIVE</div>
                        {hasMarked && (
                          <div
                            className={`text-sm font-medium ${
                              studentRecord?.status === "present" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            ✓ Marked as {studentRecord?.status}
                          </div>
                        )}
                      </div>
                    </div>

                    {!hasMarked ? (
                      <div className="flex space-x-3">
                        <motion.button
                          onClick={() => handleMarkAttendance(session.id, "present")}
                          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <CheckCircle className="h-5 w-5" />
                          <span>Mark Present</span>
                        </motion.button>
                        <motion.button
                          onClick={() => handleMarkAttendance(session.id, "absent")}
                          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <XCircle className="h-5 w-5" />
                          <span>Mark Absent</span>
                        </motion.button>
                      </div>
                    ) : (
                      <div className="text-center py-3 bg-gray-100 rounded-lg">
                        <span className="text-gray-600">Attendance already marked</span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Upcoming Sessions */}
        {upcomingSessions.length > 0 && (
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-900">Upcoming Sessions</h2>
            </div>

            <div className="space-y-3">
              {upcomingSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  className="bg-white rounded-lg p-4 border border-blue-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{session.courseTitle}</h4>
                      <p className="text-sm text-gray-600">{session.courseCode}</p>
                    </div>
                    <div className="text-right text-sm text-blue-600">
                      <div>🕐 {session.startTime}</div>
                      <div>⏱️ {session.duration} minutes</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Past Sessions */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Past Sessions</h3>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {pastSessions.slice(0, 10).map((session, index) => {
              const studentRecord = session.records.find((record) => record.studentId === studentId)
              const status = studentRecord?.status || "absent"

              return (
                <motion.div
                  key={session.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{session.courseTitle}</h4>
                      <p className="text-sm text-gray-600">
                        {session.courseCode} • {new Date(session.date).toLocaleDateString()} • {session.startTime}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {status === "present" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium capitalize ${
                          status === "present" ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {pastSessions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No past attendance sessions</p>
            </div>
          )}
        </motion.div>

        {/* No Active Sessions Message */}
        {activeSessions.length === 0 && upcomingSessions.length === 0 && (
          <motion.div
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">No Active Sessions</h3>
            <p className="text-yellow-800">
              There are no attendance sessions available right now. Check back when your lecturer creates a new session.
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
