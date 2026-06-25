<template>
  <aside
    class="fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-white border-r border-gray-100 transition-transform duration-200"
    :class="open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 py-5">
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-tegbale-blue text-white font-bold font-poppins text-lg">
        T
      </div>
      <span class="text-xl font-bold font-poppins text-tegbale-blue">Tegbale</span>
      <button
        class="ml-auto rounded-full p-1 text-gray-400 hover:bg-gray-100 md:hidden"
        @click="$emit('close')"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto px-3 py-4">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.name">
          <RouterLink
            :to="item.to"
            class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-roboto font-normal text-tegbale-text-gray transition-colors hover:bg-tegbale-blue hover:text-white"
            active-class="bg-tegbale-blue text-white"
          >
            <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Logout -->
    <div class="p-3 mb-4">
      <button
        class="flex items-center gap-3 px-3 py-2.5 text-sm font-roboto text-red-400 hover:text-red-500"
        @click="handleLogout"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { defineComponent, h } from 'vue'

defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const auth = useAuthStore()
const router = useRouter()

const DashboardIcon = defineComponent({ render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [h('path', { d: 'M8.889 20H2.222C1 20 0 19 0 17.778V2.222C0 1 1 0 2.222 0H8.889V20zm2.222 0h6.667C19 20 20 19 20 17.778V10h-8.889V20zM20 7.778V2.222C20 1 19 0 17.778 0H11.111v7.778H20z' })]) })
const SchoolIcon = defineComponent({ render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 23 20' }, [h('path', { d: 'M21.111 8.889H18.889V2.222H20V0H2.222v2.222h1.111v6.667H1.111C.816 8.889.534 9.006.325 9.214.117 9.423 0 9.705 0 10v10h22.222V10c0-.295-.117-.577-.325-.786-.208-.208-.49-.325-.786-.325zM13.333 17.778V13.333H8.889v4.445H5.556V2.222h11.111v15.556h-3.334z' }), h('path', { d: 'M7.778 4.444h2.222v2.223H7.778V4.444zm4.444 0h2.222v2.223h-2.222V4.444zM7.778 8.889h2.222V11.11H7.778V8.889zm4.444 0h2.222V11.11h-2.222V8.889z' })]) })
const StaffIcon = defineComponent({ render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 30 20' }, [h('path', { d: 'M30 13.25C30 14 28.5 14.5 26.75 14.75 25.625 12.625 23.375 11 20.75 9.875c.25-.375.5-.625.75-1h1C26.375 8.75 30 11.125 30 13.25zM8.5 8.75H7.5C3.625 8.75 0 11.125 0 13.25 0 14 1.5 14.5 3.25 14.75 4.375 12.625 6.625 11 9.25 9.875L8.5 8.75zM15 10c2.75 0 5-2.25 5-5S17.75 0 15 0s-5 2.25-5 5 2.25 5 5 5zm0 1.25C9.875 11.25 5 14.5 5 17.5 5 20 15 20 15 20s10 0 10-2.5c0-3-4.875-6.25-10-6.25zm7.125-3.75H22.5c2.125 0 3.75-1.625 3.75-3.75S24.625 0 22.5 0c-.625 0-1.125.125-1.625.375C21.875 1.625 22.5 3.25 22.5 5c0 .875-.125 1.75-.375 2.5zM7.5 7.5h.375C7.625 6.75 7.5 5.875 7.5 5c0-1.75.625-3.375 1.625-4.625C8.625.125 8.125 0 7.5 0 5.375 0 3.75 1.625 3.75 3.75S5.375 7.5 7.5 7.5z' })]) })
const SettingsIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })]) })
const RequestsIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z' })]) })

const navItems = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: DashboardIcon },
  { name: 'Schools', to: '/admin/schools', icon: SchoolIcon },
  { name: 'School Requests', to: '/admin/school-requests', icon: RequestsIcon },
  { name: 'Staff', to: '/admin/staff', icon: StaffIcon },
  { name: 'Settings', to: '/admin/settings', icon: SettingsIcon },
]

const handleLogout = async () => {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>
