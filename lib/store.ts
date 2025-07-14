"use client"

import { create } from "zustand"
import type { Student, Lecturer, Class, AttendanceSession, PendingAccount, ClassPerformance } from "./types"
import { mockStudents, mockLecturers, mockClasses, mockAttendanceSessions } from "../data/mockData"

interface AppState {
  students: Student[]
  lecturers: Lecturer[]
  classes: Class[]
  attendanceSessions: AttendanceSession[]
  pendingAccounts: PendingAccount[]
  classPerformances: ClassPerformance[]
  currentUser: { id: string; role: string; name: string } | null

  // Existing actions...
  addStudent: (student: Student) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void
  addStudentsToClass: (classId: string, students: Student[]) => void
  createAttendanceSession: (session: AttendanceSession) => void

  // New actions
  addClass: (classData: Class) => void
  approvePendingAccount: (id: string) => void
  rejectPendingAccount: (id: string) => void
  markAttendance: (sessionId: string, studentId: string, status: "present" | "absent") => void
  updateAttendanceSession: (id: string, updates: Partial<AttendanceSession>) => void
  setCurrentUser: (user: { id: string; role: string; name: string }) => void
}

export const useStore = create<AppState>((set) => ({
  students: mockStudents,
  lecturers: mockLecturers,
  classes: mockClasses,
  attendanceSessions: mockAttendanceSessions,
  pendingAccounts: [],
  classPerformances: [],
  currentUser: null,

  addStudent: (student) => set((state) => ({ students: [...state.students, student] })),

  updateStudent: (id, updatedStudent) =>
    set((state) => ({
      students: state.students.map((s) => (s.id === id ? { ...s, ...updatedStudent } : s)),
    })),

  deleteStudent: (id) =>
    set((state) => ({
      students: state.students.filter((s) => s.id !== id),
    })),

  addStudentsToClass: (classId, newStudents) =>
    set((state) => ({
      students: [...state.students, ...newStudents],
      classes: state.classes.map((c) => (c.id === classId ? { ...c, students: [...c.students, ...newStudents] } : c)),
    })),

  createAttendanceSession: (session) =>
    set((state) => ({
      attendanceSessions: [...state.attendanceSessions, session],
    })),

  addClass: (classData) => set((state) => ({ classes: [...state.classes, classData] })),

  approvePendingAccount: (id) =>
    set((state) => ({
      pendingAccounts: state.pendingAccounts.map((account) =>
        account.id === id ? { ...account, status: "approved" } : account,
      ),
    })),

  rejectPendingAccount: (id) =>
    set((state) => ({
      pendingAccounts: state.pendingAccounts.map((account) =>
        account.id === id ? { ...account, status: "rejected" } : account,
      ),
    })),

  markAttendance: (sessionId, studentId, status) =>
    set((state) => ({
      attendanceSessions: state.attendanceSessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              records: [
                ...session.records.filter((r) => r.studentId !== studentId),
                {
                  id: `${Date.now()}-${studentId}`,
                  classId: session.classId,
                  date: session.date,
                  studentId,
                  status,
                  lecturerId: session.lecturerId,
                },
              ],
            }
          : session,
      ),
    })),

  updateAttendanceSession: (id, updates) =>
    set((state) => ({
      attendanceSessions: state.attendanceSessions.map((session) =>
        session.id === id ? { ...session, ...updates } : session,
      ),
    })),

  setCurrentUser: (user) => set({ currentUser: user }),
}))
