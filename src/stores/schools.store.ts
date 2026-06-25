import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as schoolsApi from '@/api/schools'
import type { School, PaginatedMeta } from '@/types'

export const useSchoolsStore = defineStore('schools', () => {
  const schools = ref<School[]>([])
  const current = ref<School | null>(null)
  const meta = ref<PaginatedMeta>({ total: 0, page: 1, limit: 20, totalPages: 0 })
  const loading = ref(false)

  async function fetchAll(params?: schoolsApi.ListParams) {
    loading.value = true
    try {
      const { data } = await schoolsApi.getSchools(params)
      schools.value = data.data
      meta.value = data.meta
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string) {
    loading.value = true
    try {
      const { data } = await schoolsApi.getSchool(id)
      current.value = data.data
    } finally {
      loading.value = false
    }
  }

  async function create(payload: schoolsApi.SchoolPayload) {
    const { data } = await schoolsApi.createSchool(payload)
    schools.value.unshift(data.data)
    meta.value.total++
    return data.data
  }

  async function update(id: string, payload: Partial<schoolsApi.SchoolPayload>) {
    const { data } = await schoolsApi.updateSchool(id, payload)
    const idx = schools.value.findIndex((s) => s.id === id)
    if (idx !== -1) schools.value[idx] = data.data
    if (current.value?.id === id) current.value = data.data
    return data.data
  }

  async function toggleStatus(id: string) {
    const { data } = await schoolsApi.toggleSchoolStatus(id)
    const idx = schools.value.findIndex((s) => s.id === id)
    if (idx !== -1) schools.value[idx] = data.data
    return data.data
  }

  async function remove(id: string) {
    await schoolsApi.deleteSchool(id)
    schools.value = schools.value.filter((s) => s.id !== id)
    meta.value.total--
  }

  return { schools, current, meta, loading, fetchAll, fetchOne, create, update, toggleStatus, remove }
})
