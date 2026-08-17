<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 class="text-3xl font-normal text-tegbale-navy-blue font-roboto">Parents</h1>
      <BaseButton @click="showCreate = true" class="flex items-center gap-2 rounded-full px-5">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Add Parent
      </BaseButton>
    </div>

    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-50">
        <div class="flex-1 min-w-[160px] max-w-xs">
          <SearchInput v-model="search" placeholder="Search parents..." />
        </div>
        <div class="ml-auto shrink-0">
          <ExportDropdown
            :rows="store.parents"
            :columns="exportColumns"
            filename="parents"
            :disabled="!store.parents.length"
          />
        </div>
      </div>

      <div v-if="store.loading && !store.parents.length" class="p-6 space-y-3">
        <div v-for="i in 5" :key="i" class="h-12 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm font-roboto min-w-[560px]">
          <thead>
            <tr class="text-left text-tegbale-text-gray border-b border-gray-100">
              <th class="px-6 py-4 font-normal">S/N</th>
              <th class="px-6 py-4 font-normal">Full Name</th>
              <th class="px-6 py-4 font-normal hidden md:table-cell">Email Address</th>
              <th class="px-6 py-4 font-normal hidden lg:table-cell">Phone</th>
              <th class="px-6 py-4 font-normal hidden lg:table-cell">Wards</th>
              <th class="px-6 py-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="(parent, i) in store.parents" :key="parent.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-tegbale-text-gray">{{ (page - 1) * limit + i + 1 }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray">{{ parent.user.firstName }} {{ parent.user.lastName }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray hidden md:table-cell">{{ parent.user.email }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray hidden lg:table-cell">{{ parent.user.phone ?? '—' }}</td>
              <td class="px-6 py-4 text-tegbale-text-gray hidden lg:table-cell">{{ parent.wards?.length ?? 0 }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <button class="text-tegbale-blue hover:text-blue-700" title="View" @click="viewTarget = parent">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button class="text-tegbale-green hover:text-green-700" title="Edit" @click="openEdit(parent)">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    :class="parent.user.isActive ? 'text-red-400 hover:text-red-600' : 'text-tegbale-green hover:text-green-700'"
                    :title="parent.user.isActive ? 'Deactivate' : 'Activate'"
                    @click="handleToggle(parent.id)"
                  >
                    <svg v-if="parent.user.isActive" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!store.parents.length && !store.loading">
              <td colspan="6" class="px-6 py-12 text-center text-tegbale-text-gray">No parents found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="store.meta.totalPages > 1" class="flex items-center justify-between border-t border-gray-100 px-6 py-4">
        <p class="text-sm text-tegbale-text-gray font-roboto">{{ store.meta.total }} parent{{ store.meta.total !== 1 ? 's' : '' }}</p>
        <div class="flex gap-2">
          <BaseButton variant="secondary" size="sm" :disabled="page <= 1" @click="changePage(page - 1)">Prev</BaseButton>
          <span class="flex items-center px-3 text-sm font-roboto text-tegbale-text-gray">{{ page }} / {{ store.meta.totalPages }}</span>
          <BaseButton variant="secondary" size="sm" :disabled="page >= store.meta.totalPages" @click="changePage(page + 1)">Next</BaseButton>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <BaseModal :show="!!viewTarget" title="View Parent" @close="viewTarget = null">
      <div v-if="viewTarget" class="space-y-4 font-roboto text-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">Full Name</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.user.firstName }} {{ viewTarget.user.lastName }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">Email Address</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.user.email }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">Phone</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.user.phone ?? '—' }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1 text-xs">Wards</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.wards?.length ?? 0 }}</p>
          </div>
        </div>
        <div class="flex justify-end pt-2">
          <BaseButton variant="ghost" @click="viewTarget = null">Close</BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Create Modal -->
    <BaseModal :show="showCreate" title="Add Parent" @close="showCreate = false">
      <ParentForm :loading="formLoading" @submit="handleCreate" />
    </BaseModal>

    <!-- Edit Modal -->
    <BaseModal :show="!!editTarget" title="Edit Parent" @close="editTarget = null">
      <ParentForm v-if="editTarget" :initial="editTarget" :loading="formLoading" @submit="handleUpdate" />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useParentsStore } from '@/stores/parents.store'
import { useToastStore } from '@/stores/toast.store'
import type { Parent } from '@/types'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import ExportDropdown from '@/components/base/ExportDropdown.vue'
import ParentForm from './ParentForm.vue'
import SearchInput from '@/components/base/SearchInput.vue'

const store = useParentsStore()
const toast = useToastStore()

const page = ref(1)
const limit = 20
const showCreate = ref(false)
const viewTarget = ref<Parent | null>(null)
const editTarget = ref<Parent | null>(null)
const formLoading = ref(false)

const search = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

const exportColumns = [
  { header: 'S/N', value: (_: Parent, i: number) => i },
  { header: 'First Name', value: (p: Parent) => p.user.firstName },
  { header: 'Last Name', value: (p: Parent) => p.user.lastName },
  { header: 'Email', value: (p: Parent) => p.user.email },
  { header: 'Phone', value: (p: Parent) => p.user.phone ?? '' },
  { header: 'Wards', value: (p: Parent) => p.wards?.length ?? 0 },
]

const fetchParents = () => store.fetchAll({ page: page.value, limit, ...(search.value && { search: search.value }) })
const changePage = (p: number) => { page.value = p; fetchParents() }

watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { page.value = 1; fetchParents() }, 350)
})
const openEdit = (parent: Parent) => { editTarget.value = { ...parent } }

const handleCreate = async (payload: any) => {
  formLoading.value = true
  try {
    await store.create(payload)
    showCreate.value = false
    toast.success('Parent created')
  } catch (err) {
    toast.error(typeof err === 'string' ? err : 'Failed to create parent')
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
    toast.success('Parent updated')
  } catch {
    toast.error('Failed to update parent')
  } finally {
    formLoading.value = false
  }
}

const handleToggle = async (id: string) => {
  try {
    const result = await store.toggleStatus(id)
    toast.success(`Parent ${result.isActive ? 'activated' : 'deactivated'}`)
  } catch {
    toast.error('Failed to update status')
  }
}

onMounted(fetchParents)
</script>
