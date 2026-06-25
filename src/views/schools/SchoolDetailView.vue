<template>
  <div>
    <!-- Breadcrumb header -->
    <div class="flex items-center justify-between gap-3 mb-6 min-w-0">
      <div class="flex items-center gap-2 font-roboto min-w-0 flex-1">
        <RouterLink :to="{ name: 'schools' }" class="text-3xl font-normal text-tegbale-text-gray hover:text-tegbale-navy-blue transition-colors flex-shrink-0">
          Schools
        </RouterLink>
        <svg class="h-5 w-5 text-tegbale-text-gray flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
        <span
          class="text-3xl font-normal text-tegbale-navy-blue truncate min-w-0"
          :title="schoolsStore.current?.name"
        >
          {{ schoolsStore.current?.name ?? '...' }}
        </span>
      </div>
      <BaseButton @click="showAddSchool = true" class="flex items-center gap-2 rounded-full px-5 flex-shrink-0">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Add School
      </BaseButton>
    </div>

    <!-- Skeleton while loading school -->
    <div v-if="schoolsStore.loading && !schoolsStore.current" class="space-y-4">
      <div class="h-12 rounded-xl bg-white animate-pulse w-48" />
      <div class="h-64 rounded-2xl bg-white animate-pulse" />
    </div>

    <template v-else>
      <!-- Pill tabs -->
      <div class="inline-flex gap-1 mb-5 bg-white rounded-full p-1 shadow-sm flex-shrink-0">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="rounded-full px-5 py-2 text-sm font-roboto font-medium transition-colors whitespace-nowrap"
          :class="activeTab === tab.key
            ? 'bg-tegbale-blue text-white'
            : 'text-tegbale-text-gray hover:text-tegbale-navy-blue'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Table card -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="flex items-center justify-end px-4 py-3 border-b border-gray-50">
          <ExportDropdown
            :rows="activeRows"
            :columns="activeExportColumns"
            :filename="`${schoolsStore.current?.name ?? 'school'}-${activeTab}`"
            :disabled="!activeRows.length"
          />
        </div>

        <div v-if="tabLoading" class="p-6 space-y-3">
          <div v-for="i in 5" :key="i" class="h-12 rounded-xl bg-gray-100 animate-pulse" />
        </div>

        <!-- Students table -->
        <div v-else-if="activeTab === 'students'" class="overflow-x-auto">
          <table class="w-full text-sm font-roboto min-w-[480px]">
            <thead>
              <tr class="text-left text-tegbale-text-gray border-b border-gray-100">
                <th class="px-6 py-4 font-normal">S/N</th>
                <th class="px-6 py-4 font-normal">Name</th>
                <th class="px-6 py-4 font-normal hidden md:table-cell">Classroom</th>
                <th class="px-6 py-4 font-normal hidden md:table-cell">Guardians</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(student, i) in students" :key="student.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-tegbale-text-gray">{{ i + 1 }}</td>
                <td class="px-6 py-4 text-tegbale-text-gray">{{ student.firstName }} {{ student.lastName }}</td>
                <td class="px-6 py-4 text-tegbale-text-gray hidden md:table-cell">{{ student.classroom?.name ?? '—' }}</td>
                <td class="px-6 py-4 text-tegbale-text-gray hidden md:table-cell">{{ student._count?.parents ?? 0 }}</td>
              </tr>
              <tr v-if="!students.length">
                <td colspan="4" class="px-6 py-12 text-center text-tegbale-text-gray">No students found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Teachers table -->
        <div v-else-if="activeTab === 'teachers'" class="overflow-x-auto">
          <table class="w-full text-sm font-roboto min-w-[480px]">
            <thead>
              <tr class="text-left text-tegbale-text-gray border-b border-gray-100">
                <th class="px-6 py-4 font-normal">S/N</th>
                <th class="px-6 py-4 font-normal">Name</th>
                <th class="px-6 py-4 font-normal hidden md:table-cell">Email Address</th>
                <th class="px-6 py-4 font-normal hidden md:table-cell">Phone</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(teacher, i) in teachers" :key="teacher.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-tegbale-text-gray">{{ i + 1 }}</td>
                <td class="px-6 py-4 text-tegbale-text-gray">{{ teacher.firstName }} {{ teacher.lastName }}</td>
                <td class="px-6 py-4 text-tegbale-text-gray hidden md:table-cell">{{ teacher.email }}</td>
                <td class="px-6 py-4 text-tegbale-text-gray hidden md:table-cell">{{ teacher.phone ?? '—' }}</td>
              </tr>
              <tr v-if="!teachers.length">
                <td colspan="4" class="px-6 py-12 text-center text-tegbale-text-gray">No teachers found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Guardians table -->
        <div v-else-if="activeTab === 'guardians'" class="overflow-x-auto">
          <table class="w-full text-sm font-roboto min-w-[480px]">
            <thead>
              <tr class="text-left text-tegbale-text-gray border-b border-gray-100">
                <th class="px-6 py-4 font-normal">S/N</th>
                <th class="px-6 py-4 font-normal">Name</th>
                <th class="px-6 py-4 font-normal hidden md:table-cell">Email Address</th>
                <th class="px-6 py-4 font-normal hidden md:table-cell">Phone</th>
                <th class="px-6 py-4 font-normal hidden lg:table-cell">Wards</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(guardian, i) in guardians" :key="guardian.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-tegbale-text-gray">{{ i + 1 }}</td>
                <td class="px-6 py-4 text-tegbale-text-gray">{{ guardian.user.firstName }} {{ guardian.user.lastName }}</td>
                <td class="px-6 py-4 text-tegbale-text-gray hidden md:table-cell">{{ guardian.user.email }}</td>
                <td class="px-6 py-4 text-tegbale-text-gray hidden md:table-cell">{{ guardian.user.phone ?? '—' }}</td>
                <td class="px-6 py-4 text-tegbale-text-gray hidden lg:table-cell">{{ guardian.wards?.length ?? 0 }}</td>
              </tr>
              <tr v-if="!guardians.length">
                <td colspan="5" class="px-6 py-12 text-center text-tegbale-text-gray">No guardians found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Add School Modal (reuses existing form) -->
    <BaseModal :show="showAddSchool" title="Add New School" :closable="false" @close="showAddSchool = false">
      <SchoolForm :loading="formLoading" @submit="handleAddSchool" @cancel="showAddSchool = false" />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useSchoolsStore } from '@/stores/schools.store'
import { useStudentsStore } from '@/stores/students.store'
import { useStaffStore } from '@/stores/staff.store'
import { useParentsStore } from '@/stores/parents.store'
import { useToastStore } from '@/stores/toast.store'
import type { Student, User, Parent } from '@/types'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import ExportDropdown from '@/components/base/ExportDropdown.vue'
import SchoolForm from './SchoolForm.vue'

const route = useRoute()
const schoolsStore = useSchoolsStore()
const studentsStore = useStudentsStore()
const staffStore = useStaffStore()
const parentsStore = useParentsStore()
const toast = useToastStore()

const activeTab = ref<'students' | 'teachers' | 'guardians'>('students')
const tabLoading = ref(false)
const showAddSchool = ref(false)
const formLoading = ref(false)

const students = ref<Student[]>([])
const teachers = ref<User[]>([])
const guardians = ref<Parent[]>([])

const tabs = [
  { key: 'students', label: 'Students' },
  { key: 'teachers', label: 'Teachers' },
  { key: 'guardians', label: 'Guardians' },
] as const

const schoolId = computed(() => route.params.id as string)

const activeRows = computed(() => {
  if (activeTab.value === 'students') return students.value
  if (activeTab.value === 'teachers') return teachers.value
  return guardians.value
})

const activeExportColumns = computed(() => {
  if (activeTab.value === 'students') return [
    { header: 'S/N', value: (_: Student, i: number) => i },
    { header: 'First Name', value: (s: Student) => s.firstName },
    { header: 'Last Name', value: (s: Student) => s.lastName },
    { header: 'Classroom', value: (s: Student) => s.classroom?.name ?? '' },
    { header: 'Guardians', value: (s: Student) => (s as any)._count?.parents ?? 0 },
  ]
  if (activeTab.value === 'teachers') return [
    { header: 'S/N', value: (_: User, i: number) => i },
    { header: 'First Name', value: (u: User) => u.firstName },
    { header: 'Last Name', value: (u: User) => u.lastName },
    { header: 'Email', value: (u: User) => u.email },
    { header: 'Phone', value: (u: User) => u.phone ?? '' },
  ]
  return [
    { header: 'S/N', value: (_: Parent, i: number) => i },
    { header: 'First Name', value: (p: Parent) => p.user.firstName },
    { header: 'Last Name', value: (p: Parent) => p.user.lastName },
    { header: 'Email', value: (p: Parent) => p.user.email },
    { header: 'Phone', value: (p: Parent) => p.user.phone ?? '' },
    { header: 'Wards', value: (p: Parent) => p.wards?.length ?? 0 },
  ]
})

async function loadTab(tab: typeof activeTab.value) {
  tabLoading.value = true
  try {
    if (tab === 'students') {
      await studentsStore.fetchAll({ schoolId: schoolId.value, limit: 100 })
      students.value = studentsStore.students
    } else if (tab === 'teachers') {
      await staffStore.fetchAll({ schoolId: schoolId.value, role: 'TEACHER', limit: 100 })
      teachers.value = staffStore.staff
    } else {
      await parentsStore.fetchAll({ schoolId: schoolId.value, limit: 100 })
      guardians.value = parentsStore.parents
    }
  } catch {
    // silent — empty state shown
  } finally {
    tabLoading.value = false
  }
}

watch(activeTab, (tab) => loadTab(tab))

const handleAddSchool = async (payload: any) => {
  formLoading.value = true
  try {
    await schoolsStore.create(payload)
    showAddSchool.value = false
    toast.success('School created successfully')
  } catch (err) {
    toast.error(typeof err === 'string' ? err : 'Failed to create school')
  } finally {
    formLoading.value = false
  }
}

onMounted(async () => {
  await schoolsStore.fetchOne(schoolId.value)
  loadTab('students')
})
</script>
