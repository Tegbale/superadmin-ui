<template>
  <div class="relative flex items-center w-full">
    <svg
      class="absolute left-3.5 h-4 w-4 text-tegbale-text-gray pointer-events-none shrink-0"
      fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/>
    </svg>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      type="text"
      autocomplete="off"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-9 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20"
    />
    <button
      v-if="modelValue && !loading"
      type="button"
      @click="$emit('update:modelValue', '')"
      class="absolute right-3 text-tegbale-text-gray hover:text-gray-600"
      aria-label="Clear search"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
    <svg
      v-if="loading"
      class="absolute right-3 h-4 w-4 animate-spin text-tegbale-blue"
      fill="none" viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  loading?: boolean
}>(), { modelValue: '', placeholder: 'Search...', loading: false })

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
