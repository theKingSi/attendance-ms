export interface Student {
  id: string
  name: string
  regNo: string
  email: string
  year: number
  department: string
  classId: string
}

export interface Lecturer {
  id: string
  name: string
  email: string
  department: string
  classes: string[]
}

export interface Class {
  id: string
  name: string
  subject: string
  lecturerId: string
  students: Student[]
  year: number
  department: string
}

export interface AttendanceRecord {
  id: string
  classId: string
  date: string
  studentId: string
  status: "present" | "absent"
  lecturerId: string
}

export interface AttendanceSession {
  id: string
  classId: string
  courseCode: string
  courseTitle: string
  date: string
  startTime: string
  endTime: string
  duration: number // in minutes
  lecturerId: string
  isActive: boolean
  records: AttendanceRecord[]
  createdAt: string
}

export interface PendingAccount {
  id: string
  name: string
  email: string
  department: string
  role: "lecturer" | "student"
  status: "pending" | "approved" | "rejected"
  createdAt: string
  documents?: string[]
}

export interface StudentPerformance {
  studentId: string
  classId: string
  totalSessions: number
  attendedSessions: number
  attendanceRate: number
  lastAttended?: string
}

export interface ClassPerformance {
  classId: string
  lecturerId: string
  totalSessions: number
  averageAttendance: number
  totalStudents: number
  semester: string
}
