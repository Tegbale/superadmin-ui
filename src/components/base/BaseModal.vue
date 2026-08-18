<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
        <div
          class="w-full bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]"
          :class="widthClass"
          @click.stop
        >
          <div class="flex-shrink-0 flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h3 class="text-lg font-semibold text-tegbale-navy-blue font-roboto">{{ title }}</h3>
            <button
              v-if="closable"
              @click="$emit('close')"
              class="rounded-full p-1 text-tegbale-text-gray hover:bg-gray-100"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="px-6 py-5 overflow-y-auto"><slot /></div>
          <div v-if="$slots.footer" class="flex-shrink-0 border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ show: boolean; title: string; size?: 'sm' | 'md' | 'lg'; closable?: boolean }>(),
  { size: 'md', closable: true },
)
defineEmits<{ close: [] }>()

const widthClass = computed(() => ({ sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[props.size]))
</script>
