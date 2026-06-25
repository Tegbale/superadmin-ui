import client from './client'
import type { ApiResponse, PaginatedResponse, Student } from '@/types'

export interface StudentPayload {
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  classroomId?: string
  schoolId?: string
}

export interface ListParams {
  page?: number
  limit?: number
  search?: string
  schoolId?: string
  classroomId?: string
}

export const getStudents = (params?: ListParams) =>
  client.get<PaginatedResponse<Student>>('/students', { params })

export const getStudent = (id: string, schoolId?: string) =>
  client.get<ApiResponse<Student>>(`/students/${id}`, { params: schoolId ? { schoolId } : undefined })

export const createStudent = (payload: StudentPayload) =>
  client.post<ApiResponse<Student>>('/students', payload)

export const updateStudent = (id: string, payload: Partial<Omit<StudentPayload, 'schoolId'>>, schoolId?: string) =>
  client.patch<ApiResponse<Student>>(`/students/${id}`, payload, { params: schoolId ? { schoolId } : undefined })

export const deleteStudent = (id: string, schoolId?: string) =>
  client.delete<ApiResponse<null>>(`/students/${id}`, { params: schoolId ? { schoolId } : undefined })

export const assignClassroom = (id: string, classroomId: string, schoolId?: string) =>
  client.patch<ApiResponse<Student>>(`/students/${id}/classroom`, { classroomId }, { params: schoolId ? { schoolId } : undefined })
