<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <div class="grid grid-cols-2 gap-4">
      <BaseInput
        v-model="form.firstName"
        label="First Name"
        placeholder="John"
        required
        :error="v$.firstName.$error ? (v$.firstName.$errors[0].$message as string) : ''"
        @blur="v$.firstName.$touch()"
      />
      <BaseInput
        v-model="form.lastName"
        label="Last Name"
        placeholder="Doe"
        required
        :error="v$.lastName.$error ? (v$.lastName.$errors[0].$message as string) : ''"
        @blur="v$.lastName.$touch()"
      />
    </div>
    <BaseInput
      v-model="form.dateOfBirth"
      label="Date of Birth (optional)"
      type="date"
    />
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-tegbale-navy-blue font-roboto">Gender (optional)</label>
      <select
        v-model="form.gender"
        class="rounded-xl border border-gray-200 px-3 py-2 text-sm font-roboto text-gray-800 focus:outline-none focus:ring-2 focus:ring-tegbale-blue"
      >
        <option value="">— Select —</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div class="flex justify-end gap-3 pt-2">
      <BaseButton type="submit" :loading="loading">{{ initial ? 'Save Changes' : 'Add Student' }}</BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import type { Student } from '@/types'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{ initial?: Student | null; loading?: boolean }>()
const emit = defineEmits<{ submit: [payload: any] }>()

const form = reactive({ firstName: '', lastName: '', dateOfBirth: '', gender: '' })

watch(
  () => props.initial,
  (v) => {
    if (v) {
      form.firstName = v.firstName
      form.lastName = v.lastName
      form.dateOfBirth = v.dateOfBirth ? v.dateOfBirth.split('T')[0] : ''
      form.gender = v.gender ?? ''
    }
  },
  { immediate: true },
)

const rules = { firstName: { required }, lastName: { required } }
const v$ = useVuelidate(rules, form)

const handleSubmit = async () => {
  const valid = await v$.value.$validate()
  if (!valid) return
  emit('submit', {
    firstName: form.firstName,
    lastName: form.lastName,
    dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined,
    gender: form.gender || undefined,
  })
}
</script>
