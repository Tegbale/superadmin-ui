import client from './client'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { Parent } from '@/types'

export interface ParentPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface ListParams {
  page?: number
  limit?: number
  search?: string
  schoolId?: string
}

export const getParents = (params?: ListParams) =>
  client.get<PaginatedResponse<Parent>>('/parents', { params })

export const getParent = (id: string) =>
  client.get<ApiResponse<Parent>>(`/parents/${id}`)

export const createParent = (payload: ParentPayload) =>
  client.post<ApiResponse<Parent>>('/parents', payload)

export const updateParent = (id: string, payload: Partial<Pick<ParentPayload, 'firstName' | 'lastName' | 'phone'>>) =>
  client.patch<ApiResponse<Parent>>(`/parents/${id}`, payload)

export const toggleParentStatus = (id: string) =>
  client.patch<ApiResponse<{ id: string; isActive: boolean }>>(`/parents/${id}/toggle-status`)

export const deleteParent = (id: string) =>
  client.delete<ApiResponse<null>>(`/parents/${id}`)

export const assignWard = (parentId: string, studentId: string) =>
  client.post<ApiResponse<Parent>>(`/parents/${parentId}/wards`, { studentId })

export const removeWard = (parentId: string, studentId: string) =>
  client.delete<ApiResponse<Parent>>(`/parents/${parentId}/wards/${studentId}`)
