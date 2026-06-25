import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as parentsApi from '@/api/parents'
import type { Parent, PaginatedMeta } from '@/types'

export const useParentsStore = defineStore('parents', () => {
  const parents = ref<Parent[]>([])
  const current = ref<Parent | null>(null)
  const meta = ref<PaginatedMeta>({ total: 0, page: 1, limit: 20, totalPages: 0 })
  const loading = ref(false)

  async function fetchAll(params?: parentsApi.ListParams) {
    loading.value = true
    try {
      const { data } = await parentsApi.getParents(params)
      parents.value = data.data
      meta.value = data.meta
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string) {
    const { data } = await parentsApi.getParent(id)
    current.value = data.data
    return data.data
  }

  async function create(payload: parentsApi.ParentPayload) {
    const { data } = await parentsApi.createParent(payload)
    parents.value.unshift(data.data)
    meta.value.total++
    return data.data
  }

  async function update(id: string, payload: Parameters<typeof parentsApi.updateParent>[1]) {
    const { data } = await parentsApi.updateParent(id, payload)
    const idx = parents.value.findIndex((p) => p.id === id)
    if (idx !== -1) parents.value[idx] = { ...parents.value[idx], user: { ...parents.value[idx].user, ...data.data } }
    return data.data
  }

  async function toggleStatus(id: string) {
    const { data } = await parentsApi.toggleParentStatus(id)
    const idx = parents.value.findIndex((p) => p.id === id)
    if (idx !== -1) parents.value[idx].user.isActive = data.data.isActive
    return data.data
  }

  async function remove(id: string) {
    await parentsApi.deleteParent(id)
    parents.value = parents.value.filter((p) => p.id !== id)
    meta.value.total--
  }

  return { parents, current, meta, loading, fetchAll, fetchOne, create, update, toggleStatus, remove }
})
