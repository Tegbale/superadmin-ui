<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 class="text-3xl font-normal text-tegbale-navy-blue font-roboto">Students</h1>
      <BaseButton @click="showCreate = true" class="flex items-center gap-2 rounded-full px-5">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Add Student
      </BaseButton>
    </div>

    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-50">
        <div class="flex-1 min-w-[160px] max-w-xs">
          <SearchInput v-model="search" placeholder="Search students..." />
        </div>
        <div class="ml-auto shrink-0">
          <ExportDropdown
            :rows="store.students"
            :columns="exportColumns"
            filename="students"
            :disabled="!store.students.length"
          />
        </div>
      </div>

      <div v-if="store.loading && !store.students.length" class="p-6 space-y-3">
        <div v-for="i in 5" :key="i" class="h-12 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm font-roboto min-w-[560px]">
          <thead>
            <tr class="text-left text-tegbale-text-gray border-b border-gray-100">
              <th class="px-6 py-4 font-normal">S/N</th>
              <th class="px-6 py-4 font-normal">Full Name</th>
              <th class="px-6 py-4 font-normal hidden md:table-cell">School</th>
              <th class="px-6 py-4 font-normal hidden lg:table-cell">Classroom</th>
              <th class="px-6 py-4 font-normal hidden lg:table-cell">Gender</th>
              <th class="px-6 py-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="(student, i) in store.students" :key="student.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-tegbale-text-gray">{{ (page - 1) * limit.value + i + 1 }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray">{{ student.firstName }} {{ student.lastName }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray hidden md:table-cell">{{ student.school?.name ?? '—' }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray hidden lg:table-cell">{{ student.classroom?.name ?? '—' }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray hidden lg:table-cell capitalize">{{ student.gender ?? '—' }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <button class="text-tegbale-blue hover:text-blue-700" title="View" @click="viewTarget = student">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button class="text-tegbale-green hover:text-green-700" title="Edit" @click="openEdit(student)">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button class="text-red-400 hover:text-red-600" title="Delete" @click="handleDelete(student)">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!store.students.length && !store.loading">
              <td colspan="6" class="px-6 py-12 text-center text-tegbale-text-gray">No students found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-6 py-4">
        <div class="flex items-center gap-2 text-sm font-roboto text-tegbale-text-gray">
          <span>Rows per page:</span>
          <div class="relative">
            <select v-model="limit" class="appearance-none rounded-full border border-gray-200 bg-white pl-3 pr-7 py-1.5 text-sm font-roboto text-gray-700 focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            <svg class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-tegbale-text-gray" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
          <span v-if="store.meta.total">of {{ store.meta.total }} student{{ store.meta.total !== 1 ? 's' : '' }}</span>
        </div>
        <div v-if="store.meta.totalPages > 1" class="flex gap-2">
          <BaseButton variant="secondary" size="sm" :disabled="page <= 1" @click="changePage(page - 1)">Prev</BaseButton>
          <span class="flex items-center px-3 text-sm font-roboto text-tegbale-text-gray">{{ page }} / {{ store.meta.totalPages }}</span>
          <BaseButton variant="secondary" size="sm" :disabled="page >= store.meta.totalPages" @click="changePage(page + 1)">Next</BaseButton>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <BaseModal :show="!!viewTarget" title="View Student" @close="viewTarget = null">
      <div v-if="viewTarget" class="space-y-4 font-roboto text-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">First Name</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.firstName }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">Last Name</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.lastName }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">School</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.school?.name ?? '—' }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">Classroom</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.classroom?.name ?? '—' }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">Gender</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700 capitalize">{{ viewTarget.gender ?? '—' }}</p>
          </div>
        </div>
        <div class="flex justify-end pt-2">
          <BaseButton variant="ghost" @click="viewTarget = null">Close</BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Create Modal -->
    <BaseModal :show="showCreate" title="Add Student" @close="showCreate = false">
      <StudentForm :loading="formLoading" @submit="handleCreate" />
    </BaseModal>

    <!-- Edit Modal -->
    <BaseModal :show="!!editTarget" title="Edit Student" @close="editTarget = null">
      <StudentForm v-if="editTarget" :initial="editTarget" :loading="formLoading" @submit="handleUpdate" />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students.store'
import { useToastStore } from '@/stores/toast.store'
import type { Student } from '@/types'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import ExportDropdown from '@/components/base/ExportDropdown.vue'
import StudentForm from './StudentForm.vue'
import SearchInput from '@/components/base/SearchInput.vue'

const store = useStudentsStore()
const toast = useToastStore()

const page = ref(1)
const limit = ref<number>(10)
const showCreate = ref(false)
const viewTarget = ref<Student | null>(null)
const editTarget = ref<Student | null>(null)
const formLoading = ref(false)

const search = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

const exportColumns = [
  { header: 'S/N', value: (_: Student, i: number) => i },
  { header: 'First Name', value: (s: Student) => s.firstName },
  { header: 'Last Name', value: (s: Student) => s.lastName },
  { header: 'School', value: (s: Student) => s.school?.name ?? '' },
  { header: 'Classroom', value: (s: Student) => s.classroom?.name ?? '' },
  { header: 'Gender', value: (s: Student) => s.gender ?? '' },
]

const fetchStudents = () => store.fetchAll({ page: page.value, limit: limit.value, ...(search.value && { search: search.value }) })
const changePage = (p: number) => { page.value = p; fetchStudents() }

watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { page.value = 1; fetchStudents() }, 350)
})
watch(limit, () => { page.value = 1; fetchStudents() })
const openEdit = (student: Student) => { editTarget.value = { ...student } }

const handleCreate = async (payload: any) => {
  formLoading.value = true
  try {
    await store.create(payload)
    showCreate.value = false
    toast.success('Student created')
  } catch (err) {
    toast.error(typeof err === 'string' ? err : 'Failed to create student')
  } finally {
    formLoading.value = false
  }
}

const handleUpdate = async (payload: any) => {
  if (!editTarget.value) return
  formLoading.value = true
  try {
    await store.update(editTarget.value.id, payload)
    editTarget.value = null
    toast.success('Student updated')
  } catch {
    toast.error('Failed to update student')
  } finally {
    formLoading.value = false
  }
}

const handleDelete = async (student: Student) => {
  if (!confirm(`Delete ${student.firstName} ${student.lastName}? This cannot be undone.`)) return
  try {
    await store.remove(student.id)
    toast.success('Student deleted')
  } catch {
    toast.error('Failed to delete student')
  }
}

onMounted(fetchStudents)
</script>
