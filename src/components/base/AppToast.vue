<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <Transition
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-4 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        appear
      >
        <div
          class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-roboto shadow-lg min-w-[260px]"
          :class="classes[toast.type]"
        >
          <span class="flex-1">{{ toast.message }}</span>
          <button @click="toastStore.dismiss(toast.id)" class="opacity-60 hover:opacity-100">✕</button>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast.store'

const toastStore = useToastStore()

const classes: Record<string, string> = {
  success: 'bg-green-50 text-green-800 border border-green-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200',
}
</script>
