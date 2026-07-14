export type Role = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'STAFF' | 'TEACHER' | 'PARENT'
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface SchoolRequest {
  id: string
  schoolName: string
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  contactPhone?: string | null
  city?: string | null
  country?: string | null
  message?: string | null
  cacDocumentUrl?: string | null
  govtDocumentUrl?: string | null
  status: RequestStatus
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  phone?: string | null
  avatar?: string | null
  schoolId?: string | null
  isActive: boolean
  createdAt: string
}

export interface School {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  logo?: string | null
  isActive: boolean
  createdAt: string
  _count?: { classrooms: number; students: number; staff: number }
}

export interface Event {
  id: string
  title: string
  description?: string | null
  startDate: string
  endDate?: string | null
  location?: string | null
  status: EventStatus
  schoolId: string
  createdAt: string
}

export interface Student {
  id: string
  firstName: string
  lastName: string
  dateOfBirth?: string | null
  gender?: string | null
  avatar?: string | null
  schoolId: string
  classroomId?: string | null
  createdAt: string
  classroom?: { id: string; name: string; level?: string | null } | null
  school?: { id: string; name: string } | null
}

export interface Classroom {
  id: string
  name: string
  level?: string | null
  schoolId: string
  createdAt: string
  school?: { id: string; name: string } | null
  _count?: { students: number; teachers: number }
  teachers?: Array<{ id: string; user: { id: string; firstName: string; lastName: string } }>
}

export interface Ward {
  id: string
  firstName: string
  lastName: string
  schoolId: string
  classroomId?: string | null
}

export interface Parent {
  id: string
  userId: string
  createdAt: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    isActive: boolean
    createdAt: string
  }
  wards: Ward[]
}

export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta: PaginatedMeta
}
