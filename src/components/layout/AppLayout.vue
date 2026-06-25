<template>
  <div class="min-h-screen bg-[#f3f3f3]">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Overlay for mobile -->
    <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/30 md:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <div class="md:pl-60">
      <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="px-4 pt-24 pb-10 md:px-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const sidebarOpen = ref(false)
</script>
