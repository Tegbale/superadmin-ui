<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 class="text-3xl font-normal text-tegbale-navy-blue font-roboto">Staff Users</h1>
      <BaseButton @click="showCreate = true" class="flex items-center gap-2 rounded-full px-5">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Create User
      </BaseButton>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-50">
        <div class="flex-1 min-w-[160px] max-w-xs">
          <SearchInput v-model="search" placeholder="Search staff..." />
        </div>
        <div class="relative">
          <select v-model="roleFilter" class="appearance-none rounded-full border border-gray-200 bg-white pl-4 pr-9 py-2.5 text-sm font-roboto text-gray-700 focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20">
            <option value="">All roles</option>
            <option value="SCHOOL_ADMIN">School Admin</option>
            <option value="STAFF">Staff</option>
            <option value="TEACHER">Teacher</option>
          </select>
          <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tegbale-text-gray" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
        <div class="ml-auto shrink-0">
          <ExportDropdown
            :rows="store.staff"
            :columns="exportColumns"
            filename="staff-users"
            :disabled="!store.staff.length"
          />
        </div>
      </div>

      <div v-if="store.loading && !store.staff.length" class="p-6 space-y-3">
        <div v-for="i in 5" :key="i" class="h-12 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      <div v-else class="overflow-x-auto">
      <table class="w-full text-sm font-roboto min-w-[540px]">
        <thead>
          <tr class="text-left text-tegbale-text-gray border-b border-gray-100">
            <th class="px-6 py-4 font-normal">S/N</th>
            <th class="px-6 py-4 font-normal">Full Name</th>
            <th class="px-6 py-4 font-normal hidden md:table-cell">Email Address</th>
            <th class="px-6 py-4 font-normal">Role</th>
            <th class="px-6 py-4 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="(member, i) in store.staff"
            :key="member.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-tegbale-text-gray">{{ (page - 1) * limit.value + i + 1 }}</td>
            <td class="px-6 py-4 text-tegbale-text-gray">{{ member.firstName }} {{ member.lastName }}</td>
            <td class="px-6 py-4 text-tegbale-text-gray hidden md:table-cell">{{ member.email }}</td>
            <td class="px-6 py-4 text-tegbale-text-gray">{{ roleLabel(member.role) }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <!-- View -->
                <button class="text-tegbale-blue hover:text-blue-700" title="View" @click="openView(member)">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                <!-- Edit -->
                <button class="text-tegbale-green hover:text-green-700" title="Edit" @click="openEdit(member)">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <!-- Delete -->
                <button class="text-red-400 hover:text-red-600" title="Delete" @click="handleDelete(member)">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!store.staff.length && !store.loading">
            <td colspan="5" class="px-6 py-12 text-center text-tegbale-text-gray">No staff members found</td>
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
          <span v-if="store.meta.total">of {{ store.meta.total }} member{{ store.meta.total !== 1 ? 's' : '' }}</span>
        </div>
        <div v-if="store.meta.totalPages > 1" class="flex gap-2">
          <BaseButton variant="secondary" size="sm" :disabled="page <= 1" @click="changePage(page - 1)">Prev</BaseButton>
          <span class="flex items-center px-3 text-sm font-roboto text-tegbale-text-gray">{{ page }} / {{ store.meta.totalPages }}</span>
          <BaseButton variant="secondary" size="sm" :disabled="page >= store.meta.totalPages" @click="changePage(page + 1)">Next</BaseButton>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <BaseModal :show="!!viewTarget" title="View User" @close="viewTarget = null">
      <div v-if="viewTarget" class="space-y-4 font-roboto text-sm">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-tegbale-text-gray mb-1">Full Name</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.firstName }} {{ viewTarget.lastName }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1">Email Address</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.email }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-tegbale-text-gray mb-1">Phone</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ viewTarget.phone ?? '—' }}</p>
          </div>
          <div>
            <p class="text-tegbale-text-gray mb-1">Role</p>
            <p class="rounded-full border border-gray-200 px-4 py-2.5 text-gray-700">{{ roleLabel(viewTarget.role) }}</p>
          </div>
        </div>
        <div class="flex justify-end pt-2">
          <BaseButton variant="ghost" @click="viewTarget = null">Close</BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Create Modal -->
    <BaseModal :show="showCreate" title="Create New User" @close="showCreate = false">
      <StaffForm :loading="formLoading" @submit="handleCreate" @cancel="showCreate = false" />
    </BaseModal>

    <!-- Edit Modal -->
    <BaseModal :show="!!editTarget" title="Edit User" @close="editTarget = null">
      <StaffForm v-if="editTarget" :initial="editTarget" :loading="formLoading" @submit="handleUpdate" @cancel="editTarget = null" />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useStaffStore } from '@/stores/staff.store'
import { useToastStore } from '@/stores/toast.store'
import type { User, Role } from '@/types'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import StaffForm from './StaffForm.vue'
import ExportDropdown from '@/components/base/ExportDropdown.vue'
import SearchInput from '@/components/base/SearchInput.vue'

const store = useStaffStore()
const toast = useToastStore()

const page = ref(1)
const limit = ref<number>(10)
const showCreate = ref(false)
const viewTarget = ref<User | null>(null)
const editTarget = ref<User | null>(null)
const formLoading = ref(false)

const search = ref('')
const roleFilter = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

const roleLabel = (role: Role) => ({ SCHOOL_ADMIN: 'School Admin', STAFF: 'Staff', TEACHER: 'Teacher', SUPER_ADMIN: 'Super Admin', PARENT: 'Parent' }[role] ?? role)

const fetchStaff = () => store.fetchAll({
  page: page.value,
  limit: limit.value,
  ...(search.value && { search: search.value }),
  ...(roleFilter.value && { role: roleFilter.value }),
})
const changePage = (p: number) => { page.value = p; fetchStaff() }

watch([search, roleFilter], () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { page.value = 1; fetchStaff() }, 350)
})
watch(limit, () => { page.value = 1; fetchStaff() })
const openView = (member: User) => { viewTarget.value = { ...member } }
const openEdit = (member: User) => { editTarget.value = { ...member } }

const handleCreate = async (payload: any) => {
  formLoading.value = true
  try {
    await store.create(payload)
    showCreate.value = false
    toast.success('User created')
  } catch (err) {
    toast.error(typeof err === 'string' ? err : 'Failed to create user')
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
    toast.success('User updated')
  } catch {
    toast.error('Failed to update user')
  } finally {
    formLoading.value = false
  }
}

const exportColumns = [
  { header: 'S/N', value: (_: User, i: number) => i },
  { header: 'Full Name', value: (u: User) => `${u.firstName} ${u.lastName}` },
  { header: 'Email', value: (u: User) => u.email },
  { header: 'Phone', value: (u: User) => u.phone ?? '' },
  { header: 'Role', value: (u: User) => roleLabel(u.role) },
]

const handleDelete = async (member: User) => {
  if (!confirm(`Delete ${member.firstName} ${member.lastName}? This cannot be undone.`)) return
  try {
    await store.remove(member.id)
    toast.success('Staff member deleted')
  } catch {
    toast.error('Failed to delete staff member')
  }
}

onMounted(fetchStaff)
</script>
