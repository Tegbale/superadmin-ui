<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <BaseInput
      v-model="form.name"
      label="Classroom Name"
      placeholder="e.g. Grade 5A"
      required
      :error="v$.name.$error ? (v$.name.$errors[0].$message as string) : ''"
      @blur="v$.name.$touch()"
    />
    <BaseInput
      v-model="form.level"
      label="Level / Grade (optional)"
      placeholder="e.g. Primary 5"
    />
    <div class="flex justify-end gap-3 pt-2">
      <BaseButton type="submit" :loading="loading">{{ initial ? 'Save Changes' : 'Add Classroom' }}</BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import type { Classroom } from '@/types'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{ initial?: Classroom | null; loading?: boolean }>()
const emit = defineEmits<{ submit: [payload: any] }>()

const form = reactive({ name: '', level: '' })

watch(
  () => props.initial,
  (v) => {
    if (v) {
      form.name = v.name
      form.level = v.level ?? ''
    }
  },
  { immediate: true },
)

const rules = { name: { required } }
const v$ = useVuelidate(rules, form)

const handleSubmit = async () => {
  const valid = await v$.value.$validate()
  if (!valid) return
  emit('submit', { name: form.name, level: form.level || undefined })
}
</script>
