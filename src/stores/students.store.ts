import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as studentsApi from '@/api/students'
import type { Student, PaginatedMeta } from '@/types'

export const useStudentsStore = defineStore('students', () => {
  const students = ref<Student[]>([])
  const current = ref<Student | null>(null)
  const meta = ref<PaginatedMeta>({ total: 0, page: 1, limit: 20, totalPages: 0 })
  const loading = ref(false)

  async function fetchAll(params?: studentsApi.ListParams) {
    loading.value = true
    try {
      const { data } = await studentsApi.getStudents(params)
      students.value = data.data
      meta.value = data.meta
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string, schoolId?: string) {
    const { data } = await studentsApi.getStudent(id, schoolId)
    current.value = data.data
    return data.data
  }

  async function create(payload: studentsApi.StudentPayload) {
    const { data } = await studentsApi.createStudent(payload)
    students.value.unshift(data.data)
    meta.value.total++
    return data.data
  }

  async function update(id: string, payload: Partial<Omit<studentsApi.StudentPayload, 'schoolId'>>, schoolId?: string) {
    const { data } = await studentsApi.updateStudent(id, payload, schoolId)
    const idx = students.value.findIndex((s) => s.id === id)
    if (idx !== -1) students.value[idx] = data.data
    return data.data
  }

  async function remove(id: string, schoolId?: string) {
    await studentsApi.deleteStudent(id, schoolId)
    students.value = students.value.filter((s) => s.id !== id)
    meta.value.total--
  }

  return { students, current, meta, loading, fetchAll, fetchOne, create, update, remove }
})
