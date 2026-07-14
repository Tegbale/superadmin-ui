<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 class="text-3xl font-normal text-tegbale-navy-blue font-roboto">Schools</h1>
      <BaseButton @click="showCreate = true" class="flex items-center gap-2 rounded-full px-5">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Add School
      </BaseButton>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- Table header row with export -->
      <div class="flex items-center justify-end px-4 py-3 border-b border-gray-50">
        <ExportDropdown
          :rows="store.schools"
          :columns="exportColumns"
          filename="schools"
          :disabled="!store.schools.length"
        />
      </div>

      <div v-if="store.loading && !store.schools.length" class="p-6 space-y-3">
        <div v-for="i in 5" :key="i" class="h-12 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      <div v-else class="overflow-x-auto">
      <table class="w-full text-sm font-roboto min-w-[540px]">
        <thead>
          <tr class="text-left text-tegbale-text-gray border-b border-gray-100">
            <th class="px-6 py-4 font-normal">S/N</th>
            <th class="px-6 py-4 font-normal">Name</th>
            <th class="px-6 py-4 font-normal hidden md:table-cell">Email Address</th>
            <th class="px-6 py-4 font-normal hidden lg:table-cell">Phone</th>
            <th class="px-6 py-4 font-normal hidden xl:table-cell">Address</th>
            <th class="px-6 py-4 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="(school, i) in store.schools"
            :key="school.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-tegbale-text-gray">{{ (page - 1) * limit + i + 1 }}</td>
            <td class="px-6 py-4">
              <RouterLink
                :to="{ name: 'school-detail', params: { id: school.id } }"
                class="text-tegbale-blue hover:underline font-roboto text-sm"
              >{{ school.name }}</RouterLink>
            </td>
            <td class="px-6 py-4 text-tegbale-text-gray hidden md:table-cell">{{ school.email }}</td>
            <td class="px-6 py-4 text-tegbale-text-gray hidden lg:table-cell">{{ school.phone ?? '—' }}</td>
            <td class="px-6 py-4 text-tegbale-text-gray hidden xl:table-cell">{{ school.address ?? '—' }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <!-- View -->
                <button
                  class="text-tegbale-blue hover:text-blue-700"
                  title="View"
                  @click="router.push(`/admin/schools/${school.id}`)"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                <!-- Edit -->
                <button
                  class="text-tegbale-green hover:text-green-700"
                  title="Edit"
                  @click="openEdit(school)"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <!-- Delete -->
                <button
                  class="text-red-400 hover:text-red-600"
                  title="Delete"
                  @click="handleDelete(school.id)"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!store.schools.length && !store.loading">
            <td colspan="6" class="px-6 py-12 text-center text-tegbale-text-gray">
              No schools have been added yet
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- Pagination -->
      <div v-if="store.meta.totalPages > 1" class="flex items-center justify-between border-t border-gray-100 px-6 py-4">
        <p class="text-sm text-tegbale-text-gray font-roboto">
          {{ store.meta.total }} school{{ store.meta.total !== 1 ? 's' : '' }}
        </p>
        <div class="flex gap-2">
          <BaseButton variant="secondary" size="sm" :disabled="page <= 1" @click="changePage(page - 1)">Prev</BaseButton>
          <span class="flex items-center px-3 text-sm font-roboto text-tegbale-text-gray">{{ page }} / {{ store.meta.totalPages }}</span>
          <BaseButton variant="secondary" size="sm" :disabled="page >= store.meta.totalPages" @click="changePage(page + 1)">Next</BaseButton>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <BaseModal :show="showCreate" title="Add New School" :closable="false" @close="showCreate = false">
      <SchoolForm :loading="formLoading" @submit="handleCreate" @cancel="showCreate = false" />
    </BaseModal>

    <!-- Edit Modal -->
    <BaseModal :show="!!editTarget" title="Edit School" :closable="false" @close="editTarget = null">
      <SchoolForm v-if="editTarget" :initial="editTarget" :loading="formLoading" @submit="handleUpdate" @cancel="editTarget = null" @delete="handleDelete(editTarget!.id)" />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSchoolsStore } from '@/stores/schools.store'
import { useToastStore } from '@/stores/toast.store'
import type { School } from '@/types'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import SchoolForm from './SchoolForm.vue'
import ExportDropdown from '@/components/base/ExportDropdown.vue'

const store = useSchoolsStore()
const toast = useToastStore()
const router = useRouter()

const page = ref(1)
const limit = 20
const showCreate = ref(false)
const editTarget = ref<School | null>(null)
const formLoading = ref(false)

const fetchSchools = () => store.fetchAll({ page: page.value, limit })
const changePage = (p: number) => { page.value = p; fetchSchools() }
const openEdit = (school: School) => { editTarget.value = { ...school } }

const handleCreate = async (payload: { name: string; email: string; phone?: string; address?: string }) => {
  formLoading.value = true
  try {
    await store.create(payload)
    showCreate.value = false
    toast.success('School created successfully')
  } catch (err) {
    toast.error(typeof err === 'string' ? err : 'Failed to create school')
  } finally {
    formLoading.value = false
  }
}

const handleUpdate = async (payload: { name: string; email: string; phone?: string; address?: string }) => {
  if (!editTarget.value) return
  formLoading.value = true
  try {
    await store.update(editTarget.value.id, payload)
    editTarget.value = null
    toast.success('School updated successfully')
  } catch (err) {
    toast.error(typeof err === 'string' ? err : 'Failed to update school')
  } finally {
    formLoading.value = false
  }
}

const exportColumns = [
  { header: 'S/N', value: (_: School, i: number) => i },
  { header: 'Name', value: (s: School) => s.name },
  { header: 'Email', value: (s: School) => s.email ?? '' },
  { header: 'Phone', value: (s: School) => s.phone ?? '' },
  { header: 'Address', value: (s: School) => s.address ?? '' },
]

const handleDelete = async (id: string) => {
  if (!confirm('Delete this school? This cannot be undone.')) return
  editTarget.value = null
  try {
    await store.remove(id)
    toast.success('School deleted')
  } catch {
    toast.error('Failed to delete school')
  }
}

onMounted(fetchSchools)
</script>
