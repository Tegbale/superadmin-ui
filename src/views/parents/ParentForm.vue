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
      v-model="form.email"
      label="Email Address"
      type="email"
      placeholder="parent@example.com"
      required
      :disabled="!!initial"
      :error="v$.email.$error ? (v$.email.$errors[0].$message as string) : ''"
      @blur="v$.email.$touch()"
    />
    <BaseInput
      v-if="!initial"
      v-model="form.password"
      label="Password"
      type="password"
      placeholder="Min. 8 characters"
      required
      :error="v$.password.$error ? (v$.password.$errors[0].$message as string) : ''"
      @blur="v$.password.$touch()"
    />
    <BaseInput v-model="form.phone" label="Phone (optional)" placeholder="+234 800 000 0000" />
    <div class="flex justify-end gap-3 pt-2">
      <BaseButton type="submit" :loading="loading">{{ initial ? 'Save Changes' : 'Add Parent' }}</BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import type { Parent } from '@/types'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{ initial?: Parent | null; loading?: boolean }>()
const emit = defineEmits<{ submit: [payload: any] }>()

const form = reactive({ firstName: '', lastName: '', email: '', password: '', phone: '' })

watch(
  () => props.initial,
  (v) => {
    if (v) {
      form.firstName = v.user.firstName
      form.lastName = v.user.lastName
      form.email = v.user.email
      form.phone = v.user.phone ?? ''
    }
  },
  { immediate: true },
)

const rules = {
  firstName: { required },
  lastName: { required },
  email: { required, email },
  password: props.initial ? {} : { required, minLength: minLength(8) },
}
const v$ = useVuelidate(rules, form)

const handleSubmit = async () => {
  const valid = await v$.value.$validate()
  if (!valid) return
  const payload: any = {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    phone: form.phone || undefined,
  }
  if (!props.initial) payload.password = form.password
  emit('submit', payload)
}
</script>
