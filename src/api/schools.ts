import client from './client'
import type { ApiResponse, PaginatedResponse, School } from '@/types'

export interface SchoolPayload {
  name: string
  email: string
  phone?: string
  address?: string
}

export interface ListParams {
  page?: number
  limit?: number
  search?: string
}

export const getSchools = (params?: ListParams) =>
  client.get<PaginatedResponse<School>>('/schools', { params })

export const getSchool = (id: string) =>
  client.get<ApiResponse<School>>(`/schools/${id}`)

export const createSchool = (payload: SchoolPayload) =>
  client.post<ApiResponse<School>>('/schools', payload)

export const updateSchool = (id: string, payload: Partial<SchoolPayload>) =>
  client.patch<ApiResponse<School>>(`/schools/${id}`, payload)

export const toggleSchoolStatus = (id: string) =>
  client.patch<ApiResponse<School>>(`/schools/${id}/toggle-status`)

export const deleteSchool = (id: string) =>
  client.delete(`/schools/${id}`)
