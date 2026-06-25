<template>
  <header class="fixed top-0 right-0 left-0 md:left-60 z-20 flex h-16 items-center gap-4 bg-white px-4 md:px-6">
    <!-- Mobile menu toggle -->
    <button
      class="rounded-full p-2 text-gray-500 hover:bg-gray-100 md:hidden"
      @click="$emit('toggle-sidebar')"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
      </svg>
    </button>

    <!-- Search -->
    <div class="relative hidden max-w-xs flex-1 sm:block">
      <svg class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-tegbale-text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
      </svg>
      <input
        v-model="search"
        type="text"
        placeholder="Search..."
        class="w-full rounded-full border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:outline-none focus:ring-1 focus:ring-gray-300"
      />
    </div>

    <div class="ml-auto flex items-center gap-4">
      <!-- Notification bell -->
      <button class="relative p-1 text-gray-500 hover:text-gray-700">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
        </svg>
        <span class="absolute right-0.5 top-0.5 flex h-2 w-2 items-center justify-center rounded-full bg-red-500"></span>
      </button>

      <!-- User info -->
      <div class="flex items-center gap-2">
        <div class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-200">
          <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="avatar" class="h-full w-full object-cover" />
          <span v-else class="text-sm font-semibold text-gray-600 font-roboto">{{ initials }}</span>
        </div>
        <span class="hidden text-sm font-medium text-tegbale-navy-blue font-roboto md:block">
          {{ authStore.fullName }} (Admin)
        </span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

defineEmits<{ 'toggle-sidebar': [] }>()

const authStore = useAuthStore()
const search = ref('')

const initials = computed(() => {
  const u = authStore.user
  if (!u) return 'SA'
  return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase()
})
</script>
