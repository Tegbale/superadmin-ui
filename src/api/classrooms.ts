import client from './client'
import type { ApiResponse, PaginatedResponse, Classroom } from '@/types'

export interface ClassroomPayload {
  name: string
  level?: string
  schoolId?: string
}

export interface ListParams {
  page?: number
  limit?: number
  search?: string
  schoolId?: string
}

export const getClassrooms = (params?: ListParams) =>
  client.get<PaginatedResponse<Classroom>>('/classrooms', { params })

export const getClassroom = (id: string, schoolId?: string) =>
  client.get<ApiResponse<Classroom>>(`/classrooms/${id}`, { params: schoolId ? { schoolId } : undefined })

export const createClassroom = (payload: ClassroomPayload) =>
  client.post<ApiResponse<Classroom>>('/classrooms', payload)

export const updateClassroom = (id: string, payload: Partial<Pick<ClassroomPayload, 'name' | 'level'>>, schoolId?: string) =>
  client.patch<ApiResponse<Classroom>>(`/classrooms/${id}`, payload, { params: schoolId ? { schoolId } : undefined })

export const deleteClassroom = (id: string, schoolId?: string) =>
  client.delete<ApiResponse<null>>(`/classrooms/${id}`, { params: schoolId ? { schoolId } : undefined })
