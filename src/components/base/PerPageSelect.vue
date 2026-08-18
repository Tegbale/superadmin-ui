<template>
  <div class="pps">
    <select v-model="model" class="pps__select">
      <option :value="10">10</option>
      <option :value="20">20</option>
      <option :value="50">50</option>
    </select>
    <svg class="pps__chevron" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{ modelValue?: number }>(), { modelValue: 10 })
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', Number(v)),
})
</script>

<style lang="scss" scoped>
.pps {
  position: relative;
  display: inline-flex;
  align-items: center;

  &__select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 9999px;
    border: 1px solid #e5e7eb;
    background-color: #fff;
    padding: 0.375rem 1.75rem 0.375rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #374151;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
    }
  }

  &__chevron {
    pointer-events: none;
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0.875rem;
    height: 0.875rem;
    color: #9ca3af;
  }
}
</style>
