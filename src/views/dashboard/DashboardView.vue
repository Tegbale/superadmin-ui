<template>
  <div>
    <h1 class="text-3xl font-normal text-tegbale-navy-blue font-roboto mb-8">Dashboard</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-5">
        <div :class="['flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl', stat.bg]">
          <component :is="stat.icon" class="h-8 w-8 text-white" />
        </div>
        <div class="flex flex-col items-end flex-1">
          <p class="text-sm text-tegbale-text-gray font-roboto">{{ stat.label }}</p>
          <p class="text-3xl font-semibold text-tegbale-navy-blue font-roboto mt-0.5">
            {{ loading ? '—' : stat.value }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useSchoolsStore } from '@/stores/schools.store'
import { useStudentsStore } from '@/stores/students.store'
import { useStaffStore } from '@/stores/staff.store'
import { useParentsStore } from '@/stores/parents.store'

const schoolsStore = useSchoolsStore()
const studentsStore = useStudentsStore()
const staffStore = useStaffStore()
const parentsStore = useParentsStore()

const loading = ref(true)

onMounted(async () => {
  await Promise.all([
    schoolsStore.fetchAll({ limit: 1 }),
    studentsStore.fetchAll({ limit: 1 }),
    staffStore.fetchAll({ limit: 1, role: 'TEACHER' }),
    parentsStore.fetchAll({ limit: 1 }),
  ])
  loading.value = false
})

const SchoolIcon = defineComponent({ render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 23 20' }, [h('path', { d: 'M21.111 8.889H18.889V2.222H20V0H2.222v2.222h1.111v6.667H1.111C.816 8.889.534 9.006.325 9.214.117 9.423 0 9.705 0 10v10h22.222V10c0-.295-.117-.577-.325-.786-.208-.208-.49-.325-.786-.325zM13.333 17.778V13.333H8.889v4.445H5.556V2.222h11.111v15.556h-3.334z' }), h('path', { d: 'M7.778 4.444h2.222v2.223H7.778V4.444zm4.444 0h2.222v2.223h-2.222V4.444zM7.778 8.889h2.222V11.11H7.778V8.889zm4.444 0h2.222V11.11h-2.222V8.889z' })]) })
const StudentIcon = defineComponent({ render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z' })]) })
const TeacherIcon = defineComponent({ render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 11H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7V7h10v2z' })]) })
const ParentIcon = defineComponent({ render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' })]) })

const stats = computed(() => [
  { label: 'Schools', value: schoolsStore.meta.total, bg: 'bg-tegbale-navy-blue', icon: SchoolIcon },
  { label: 'Students', value: studentsStore.meta.total, bg: 'bg-tegbale-purple', icon: StudentIcon },
  { label: 'Teachers', value: staffStore.meta.total, bg: 'bg-tegbale-green', icon: TeacherIcon },
  { label: 'Parents', value: parentsStore.meta.total, bg: 'bg-tegbale-blue', icon: ParentIcon },
])
</script>
