import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as staffApi from '@/api/staff'
import type { User, PaginatedMeta } from '@/types'

export const useStaffStore = defineStore('staff', () => {
  const staff = ref<User[]>([])
  const current = ref<User | null>(null)
  const meta = ref<PaginatedMeta>({ total: 0, page: 1, limit: 20, totalPages: 0 })
  const loading = ref(false)

  async function fetchAll(params?: staffApi.ListParams) {
    loading.value = true
    try {
      const { data } = await staffApi.getStaff(params)
      staff.value = data.data
      meta.value = data.meta
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string) {
    const { data } = await staffApi.getStaffMember(id)
    current.value = data.data
    return data.data
  }

  async function create(payload: staffApi.StaffPayload) {
    const { data } = await staffApi.createStaffMember(payload)
    staff.value.unshift(data.data)
    meta.value.total++
    return data.data
  }

  async function update(id: string, payload: Parameters<typeof staffApi.updateStaffMember>[1]) {
    const { data } = await staffApi.updateStaffMember(id, payload)
    const idx = staff.value.findIndex((u) => u.id === id)
    if (idx !== -1) staff.value[idx] = data.data
    if (current.value?.id === id) current.value = data.data
    return data.data
  }

  async function toggleStatus(id: string) {
    const { data } = await staffApi.toggleStaffStatus(id)
    const idx = staff.value.findIndex((u) => u.id === id)
    if (idx !== -1) staff.value[idx] = data.data
    return data.data
  }

  async function remove(id: string) {
    await staffApi.deleteStaffMember(id)
    staff.value = staff.value.filter((u) => u.id !== id)
    meta.value.total--
  }

  return { staff, current, meta, loading, fetchAll, fetchOne, create, update, toggleStatus, remove }
})
