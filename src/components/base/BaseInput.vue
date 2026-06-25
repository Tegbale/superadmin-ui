<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="text-sm font-medium text-tegbale-navy-blue font-roboto">
      {{ label }}<span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <input
      :id="id"
      v-bind="$attrs"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="rounded-xl border border-gray-200 px-3 py-2 text-sm font-roboto text-gray-800 placeholder:text-tegbale-text-gray ring-0 transition focus:border-tegbale-blue focus:outline-none focus:ring-2 focus:ring-tegbale-blue/20 disabled:bg-gray-50 disabled:opacity-60"
      :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-200': error }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    id?: string
    type?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    error?: string
  }>(),
  { type: 'text' },
)
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
