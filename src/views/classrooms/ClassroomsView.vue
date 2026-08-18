<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 class="text-3xl font-normal text-tegbale-navy-blue font-roboto">Classrooms</h1>
      <BaseButton @click="showCreate = true" class="flex items-center gap-2 rounded-full px-5">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Add Classroom
      </BaseButton>
    </div>

    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-50">
        <div class="flex-1 min-w-[160px] max-w-xs">
          <SearchInput v-model="search" placeholder="Search classrooms..." />
        </div>
        <div class="ml-auto shrink-0">
          <ExportDropdown
            :rows="store.classrooms"
            :columns="exportColumns"
            filename="classrooms"
            :disabled="!store.classrooms.length"
          />
        </div>
      </div>

      <div v-if="store.loading && !store.classrooms.length" class="p-6 space-y-3">
        <div v-for="i in 5" :key="i" class="h-12 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm font-roboto min-w-[580px]">
          <thead>
            <tr class="text-left text-tegbale-text-gray border-b border-gray-100">
              <th class="px-6 py-4 font-normal">S/N</th>
              <th class="px-6 py-4 font-normal">Name</th>
              <th class="px-6 py-4 font-normal hidden md:table-cell">School</th>
              <th class="px-6 py-4 font-normal hidden md:table-cell">Level</th>
              <th class="px-6 py-4 font-normal hidden lg:table-cell">Students</th>
              <th class="px-6 py-4 font-normal hidden lg:table-cell">Teachers</th>
              <th class="px-6 py-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="(classroom, i) in store.classrooms" :key="classroom.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-tegbale-text-gray">{{ (page - 1) * limit.value + i + 1 }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray">{{ classroom.name }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray hidden md:table-cell">{{ classroom.school?.name ?? '—' }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray hidden md:table-cell">{{ classroom.level ?? '—' }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray hidden lg:table-cell">{{ classroom._count?.students ?? 0 }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray hidden lg:table-cell">{{ classroom._count?.teachers ?? 0 }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <button class="text-tegbale-blue hover:text-blue-700" title="View" @click="viewTarget = classroom">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button class="text-tegbale-green hover:text-green-700" title="Edit" @click="openEdit(classroom)">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button class="text-red-400 hover:text-red-600" title="Delete" @click="handleDelete(classroom)">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!store.classrooms.length && !store.loading">
              <td colspan="7" class="px-6 py-12 text-center text-tegbale-text-gray">No classrooms found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-6 py-4">
        <div class="flex items-center gap-2 text-sm font-roboto text-tegbale-text-gray">
          <span>Rows per page:</span>
          <PerPageSelect v-model="limit" />
          <span v-if="store.meta.total">of {{ store.meta.total }} classroom{{ store.meta.total !== 1 ? 's' : '' }}</span>
        </div>
        <div v-if="store.meta.totalPages > 1" class="flex gap-2">
          <BaseButton variant="secondary" size="sm" :disabled="page <= 1" @click="changePage(page - 1)">Prev</BaseButton>
          <span class="flex items-center px-3 text-sm font-roboto text-tegbale-text-gray">{{ page }} / {{ store.meta.totalPages }}</span>
          <BaseButton variant="secondary" size="sm" :disabled="page >= store.meta.totalPages" @click="changePage(page + 1)">Next</BaseButton>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <BaseModal :show="!!viewTarget" title="View Classroom" @close="viewTarget = null">
      <div v-if="viewTarget" class="space-y-4 font-roboto text-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">Name</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.name }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">Level</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.level ?? '—' }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">School</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.school?.name ?? '—' }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">Students</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget._count?.students ?? 0 }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">Teachers</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget._count?.teachers ?? 0 }}</p>
          </div>
        </div>
        <div class="flex justify-end pt-2">
          <BaseButton variant="ghost" @click="viewTarget = null">Close</BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Create Modal -->
    <BaseModal :show="showCreate" title="Add Classroom" @close="showCreate = false">
      <ClassroomForm :loading="formLoading" @submit="handleCreate" />
    </BaseModal>

    <!-- Edit Modal -->
    <BaseModal :show="!!editTarget" title="Edit Classroom" @close="editTarget = null">
      <ClassroomForm v-if="editTarget" :initial="editTarget" :loading="formLoading" @submit="handleUpdate" />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useClassroomsStore } from '@/stores/classrooms.store'
import { useToastStore } from '@/stores/toast.store'
import type { Classroom } from '@/types'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import ExportDropdown from '@/components/base/ExportDropdown.vue'
import ClassroomForm from './ClassroomForm.vue'
import SearchInput from '@/components/base/SearchInput.vue'
import PerPageSelect from '@/components/base/PerPageSelect.vue'

const store = useClassroomsStore()
const toast = useToastStore()

const page = ref(1)
const limit = ref<number>(10)
const showCreate = ref(false)
const viewTarget = ref<Classroom | null>(null)
const editTarget = ref<Classroom | null>(null)
const formLoading = ref(false)

const search = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

const exportColumns = [
  { header: 'S/N', value: (_: Classroom, i: number) => i },
  { header: 'Name', value: (c: Classroom) => c.name },
  { header: 'School', value: (c: Classroom) => c.school?.name ?? '' },
  { header: 'Level', value: (c: Classroom) => c.level ?? '' },
  { header: 'Students', value: (c: Classroom) => c._count?.students ?? 0 },
  { header: 'Teachers', value: (c: Classroom) => c._count?.teachers ?? 0 },
]

const fetchClassrooms = () => store.fetchAll({ page: page.value, limit: limit.value, ...(search.value && { search: search.value }) })
const changePage = (p: number) => { page.value = p; fetchClassrooms() }

watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { page.value = 1; fetchClassrooms() }, 350)
})
watch(limit, () => { page.value = 1; fetchClassrooms() })
const openEdit = (classroom: Classroom) => { editTarget.value = { ...classroom } }

const handleCreate = async (payload: any) => {
  formLoading.value = true
  try {
    await store.create(payload)
    showCreate.value = false
    toast.success('Classroom created')
  } catch (err) {
    toast.error(typeof err === 'string' ? err : 'Failed to create classroom')
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
    toast.success('Classroom updated')
  } catch {
    toast.error('Failed to update classroom')
  } finally {
    formLoading.value = false
  }
}

const handleDelete = async (classroom: Classroom) => {
  if (!confirm(`Delete classroom "${classroom.name}"? This cannot be undone.`)) return
  try {
    await store.remove(classroom.id)
    toast.success('Classroom deleted')
  } catch {
    toast.error('Failed to delete classroom')
  }
}

onMounted(fetchClassrooms)
</script>
