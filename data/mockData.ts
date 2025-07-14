import type { Student, Lecturer, Class, AttendanceSession, PendingAccount } from "../lib/types"

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    regNo: "CS2021001",
    email: "john.doe@university.edu",
    year: 3,
    department: "Computer Science",
    classId: "1",
  },
  {
    id: "2",
    name: "Jane Smith",
    regNo: "CS2021002",
    email: "jane.smith@university.edu",
    year: 3,
    department: "Computer Science",
    classId: "1",
  },
  {
    id: "3",
    name: "Mike Johnson",
    regNo: "CS2021003",
    email: "mike.johnson@university.edu",
    year: 3,
    department: "Computer Science",
    classId: "1",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    regNo: "EE2021001",
    email: "sarah.wilson@university.edu",
    year: 2,
    department: "Electrical Engineering",
    classId: "2",
  },
  {
    id: "5",
    name: "David Brown",
    regNo: "EE2021002",
    email: "david.brown@university.edu",
    year: 2,
    department: "Electrical Engineering",
    classId: "2",
  },
]

export const mockLecturers: Lecturer[] = [
  {
    id: "1",
    name: "Dr. Alice Cooper",
    email: "alice.cooper@university.edu",
    department: "Computer Science",
    classes: ["1", "3"],
  },
  {
    id: "2",
    name: "Prof. Bob Martin",
    email: "bob.martin@university.edu",
    department: "Electrical Engineering",
    classes: ["2"],
  },
]

export const mockClasses: Class[] = [
  {
    id: "1",
    name: "Advanced Web Development",
    subject: "Computer Science",
    lecturerId: "1",
    students: mockStudents.filter((s) => s.classId === "1"),
    year: 3,
    department: "Computer Science",
  },
  {
    id: "2",
    name: "Circuit Analysis",
    subject: "Electrical Engineering",
    lecturerId: "2",
    students: mockStudents.filter((s) => s.classId === "2"),
    year: 2,
    department: "Electrical Engineering",
  },
  {
    id: "3",
    name: "Data Structures",
    subject: "Computer Science",
    lecturerId: "1",
    students: [],
    year: 2,
    department: "Computer Science",
  },
]

export const mockPendingAccounts: PendingAccount[] = [
  {
    id: "pending-1",
    name: "Dr. Emily Johnson",
    email: "emily.johnson@university.edu",
    department: "Mathematics",
    role: "lecturer",
    status: "pending",
    createdAt: "2024-01-10",
    documents: ["cv.pdf", "certificates.pdf"],
  },
  {
    id: "pending-2",
    name: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    department: "Physics",
    role: "lecturer",
    status: "pending",
    createdAt: "2024-01-12",
  },
  {
    id: "pending-3",
    name: "Lisa Anderson",
    email: "lisa.anderson@student.edu",
    department: "Computer Science",
    role: "student",
    status: "pending",
    createdAt: "2024-01-15",
  },
]

// Update mockAttendanceSessions with new structure
export const mockAttendanceSessions: AttendanceSession[] = [
  {
    id: "1",
    classId: "1",
    courseCode: "CS301",
    courseTitle: "Advanced Web Development",
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "10:30",
    duration: 90,
    lecturerId: "1",
    isActive: false,
    createdAt: "2024-01-15T08:30:00Z",
    records: [
      { id: "1", classId: "1", date: "2024-01-15", studentId: "1", status: "present", lecturerId: "1" },
      { id: "2", classId: "1", date: "2024-01-15", studentId: "2", status: "present", lecturerId: "1" },
      { id: "3", classId: "1", date: "2024-01-15", studentId: "3", status: "absent", lecturerId: "1" },
    ],
  },
  {
    id: "2",
    classId: "1",
    courseCode: "CS301",
    courseTitle: "Advanced Web Development",
    date: "2024-01-16",
    startTime: "09:00",
    endTime: "10:30",
    duration: 90,
    lecturerId: "1",
    isActive: true,
    createdAt: "2024-01-16T08:30:00Z",
    records: [],
  },
]
