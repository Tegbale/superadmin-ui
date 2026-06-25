import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as classroomsApi from '@/api/classrooms'
import type { Classroom, PaginatedMeta } from '@/types'

export const useClassroomsStore = defineStore('classrooms', () => {
  const classrooms = ref<Classroom[]>([])
  const current = ref<Classroom | null>(null)
  const meta = ref<PaginatedMeta>({ total: 0, page: 1, limit: 20, totalPages: 0 })
  const loading = ref(false)

  async function fetchAll(params?: classroomsApi.ListParams) {
    loading.value = true
    try {
      const { data } = await classroomsApi.getClassrooms(params)
      classrooms.value = data.data
      meta.value = data.meta
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string, schoolId?: string) {
    const { data } = await classroomsApi.getClassroom(id, schoolId)
    current.value = data.data
    return data.data
  }

  async function create(payload: classroomsApi.ClassroomPayload) {
    const { data } = await classroomsApi.createClassroom(payload)
    classrooms.value.unshift(data.data)
    meta.value.total++
    return data.data
  }

  async function update(id: string, payload: Partial<Pick<classroomsApi.ClassroomPayload, 'name' | 'level'>>, schoolId?: string) {
    const { data } = await classroomsApi.updateClassroom(id, payload, schoolId)
    const idx = classrooms.value.findIndex((c) => c.id === id)
    if (idx !== -1) classrooms.value[idx] = data.data
    return data.data
  }

  async function remove(id: string, schoolId?: string) {
    await classroomsApi.deleteClassroom(id, schoolId)
    classrooms.value = classrooms.value.filter((c) => c.id !== id)
    meta.value.total--
  }

  return { classrooms, current, meta, loading, fetchAll, fetchOne, create, update, remove }
})
