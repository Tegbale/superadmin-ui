import client from './client'
import type { ApiResponse, PaginatedResponse, User } from '@/types'

export interface StaffPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: 'SCHOOL_ADMIN' | 'STAFF' | 'TEACHER'
}

export interface ListParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  schoolId?: string
}

export const getStaff = (params?: ListParams) =>
  client.get<PaginatedResponse<User>>('/staff', { params })

export const getStaffMember = (id: string) =>
  client.get<ApiResponse<User>>(`/staff/${id}`)

export const createStaffMember = (payload: StaffPayload) =>
  client.post<ApiResponse<User>>('/staff', payload)

export const updateStaffMember = (id: string, payload: Partial<Pick<StaffPayload, 'firstName' | 'lastName' | 'phone'>>) =>
  client.patch<ApiResponse<User>>(`/staff/${id}`, payload)

export const toggleStaffStatus = (id: string) =>
  client.patch<ApiResponse<User>>(`/staff/${id}/toggle-status`)

export const deleteStaffMember = (id: string) =>
  client.delete<ApiResponse<null>>(`/staff/${id}`)
