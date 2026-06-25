import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/auth'
import type { User } from '@/types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)

    const isAuthenticated = computed(() => !!accessToken.value)
    const isSuperAdmin = computed(() => user.value?.role === 'SUPER_ADMIN')
    const fullName = computed(() =>
      user.value ? `${user.value.firstName} ${user.value.lastName}` : '',
    )

    async function login(email: string, password: string) {
      const { data } = await authApi.login({ email, password })
      user.value = data.data.user
      accessToken.value = data.data.accessToken
      refreshToken.value = data.data.refreshToken
    }

    async function fetchMe() {
      const { data } = await authApi.me()
      user.value = data.data
    }

    async function refreshTokens() {
      if (!refreshToken.value) throw new Error('No refresh token')
      const { data } = await authApi.refresh(refreshToken.value)
      accessToken.value = data.data.accessToken
    }

    async function logout() {
      try {
        if (refreshToken.value) await authApi.logout(refreshToken.value)
      } finally {
        user.value = null
        accessToken.value = null
        refreshToken.value = null
      }
    }

    return { user, accessToken, refreshToken, isAuthenticated, isSuperAdmin, fullName, login, fetchMe, refreshTokens, logout }
  },
  { persist: true },
)
