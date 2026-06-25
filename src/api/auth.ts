import client from './client'
import type { ApiResponse, User } from '@/types'

export interface LoginPayload { email: string; password: string }
export interface LoginData { accessToken: string; refreshToken: string; user: User }

export const login = (payload: LoginPayload) =>
  client.post<ApiResponse<LoginData>>('/auth/login', payload)

export const me = () =>
  client.get<ApiResponse<User>>('/auth/me')

export const refresh = (refreshToken: string) =>
  client.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken })

export const logout = (refreshToken: string) =>
  client.post('/auth/logout', { refreshToken })

export const changePassword = (payload: { currentPassword: string; newPassword: string }) =>
  client.patch('/auth/change-password', payload)
