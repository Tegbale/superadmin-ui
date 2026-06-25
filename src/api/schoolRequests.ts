import client from './client'
import type { ApiResponse, SchoolRequest } from '@/types'

export interface ListRequestsParams {
  page?: number
  limit?: number
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface ListRequestsData {
  requests: SchoolRequest[]
  total: number
  page: number
  limit: number
}

export const getSchoolRequests = (params?: ListRequestsParams) =>
  client.get<ApiResponse<ListRequestsData>>('/school-requests', { params })

export const getSchoolRequest = (id: string) =>
  client.get<ApiResponse<SchoolRequest>>(`/school-requests/${id}`)

export const approveSchoolRequest = (id: string) =>
  client.post<ApiResponse<{ school: any; admin: any }>>(`/school-requests/${id}/approve`)

export const rejectSchoolRequest = (id: string, notes?: string) =>
  client.patch<ApiResponse<SchoolRequest>>(`/school-requests/${id}/reject`, { notes })
