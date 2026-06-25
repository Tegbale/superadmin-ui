<template>
  <button
    v-bind="$attrs"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 rounded-xl font-roboto font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[sizeClass, variantClass]"
  >
    <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'md', loading: false, disabled: false },
)

const variantClass = computed(() => ({
  primary: 'bg-tegbale-blue text-white hover:bg-blue-600',
  secondary: 'bg-white text-tegbale-navy-blue border border-gray-200 hover:bg-gray-50',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'text-tegbale-text-gray hover:bg-gray-100',
}[props.variant]))

const sizeClass = computed(() => ({
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}[props.size]))
</script>
