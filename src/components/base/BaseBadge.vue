<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-roboto"
    :class="classes[variant]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' }>(),
  { variant: 'neutral' },
)

const classes: Record<string, string> = {
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-600',
}
</script>
