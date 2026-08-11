import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001').replace(/\/+$/, '')

const client = axios.create({
  baseURL: `${BASE}/api/v1`,
})

client.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const auth = useAuthStore()
        await auth.refreshTokens()
        original.headers.Authorization = `Bearer ${auth.accessToken}`
        return client(original)
      } catch {
        const auth = useAuthStore()
        auth.logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error.response?.data?.message ?? 'Something went wrong')
  },
)

export default client
