<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
    <p class="text-sm font-semibold text-tegbale-navy-blue font-roboto">User Information</p>

    <div class="grid grid-cols-2 gap-4">
      <!-- Full Name split into first + last for backend compatibility -->
      <div class="flex flex-col gap-1">
        <label class="text-xs text-tegbale-text-gray font-roboto">Full Name</label>
        <div class="flex gap-2">
          <input
            v-model="form.firstName"
            type="text"
            placeholder="First"
            class="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20"
            :class="{ 'border-red-400': v$.firstName.$error }"
            @blur="v$.firstName.$touch()"
          />
          <input
            v-model="form.lastName"
            type="text"
            placeholder="Last"
            class="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20"
            :class="{ 'border-red-400': v$.lastName.$error }"
            @blur="v$.lastName.$touch()"
          />
        </div>
        <p v-if="v$.firstName.$error || v$.lastName.$error" class="text-xs text-red-500 pl-1">Full name is required</p>
      </div>

      <!-- Email -->
      <div class="flex flex-col gap-1">
        <label class="text-xs text-tegbale-text-gray font-roboto">Email Address</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="Enter Email Address"
          :disabled="!!initial"
          class="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20 disabled:bg-gray-50 disabled:opacity-60"
          :class="{ 'border-red-400': v$.email.$error }"
          @blur="v$.email.$touch()"
        />
        <p v-if="v$.email.$error" class="text-xs text-red-500 pl-1">{{ v$.email.$errors[0].$message }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Phone -->
      <div class="flex flex-col gap-1">
        <label class="text-xs text-tegbale-text-gray font-roboto">Phone Number</label>
        <input
          v-model="form.phone"
          type="tel"
          placeholder="Enter Phone Number"
          class="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20"
        />
      </div>

      <!-- Role -->
      <div class="flex flex-col gap-1">
        <label class="text-xs text-tegbale-text-gray font-roboto">Role</label>
        <div class="relative">
          <select
            v-model="form.role"
            :disabled="!!initial"
            class="w-full appearance-none rounded-full border border-gray-200 px-4 py-2.5 text-sm font-roboto text-gray-700 focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20 disabled:bg-gray-50 disabled:opacity-60"
          >
            <option value="" disabled>Select Role</option>
            <option value="SCHOOL_ADMIN">School Admin</option>
            <option value="STAFF">Staff</option>
            <option value="TEACHER">Teacher</option>
          </select>
          <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-tegbale-text-gray">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Password (create only) -->
    <div v-if="!initial" class="flex flex-col gap-1">
      <label class="text-xs text-tegbale-text-gray font-roboto">Password</label>
      <input
        v-model="form.password"
        type="password"
        placeholder="Min. 8 characters"
        class="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20"
        :class="{ 'border-red-400': v$.password.$error }"
        @blur="v$.password.$touch()"
      />
      <p v-if="v$.password.$error" class="text-xs text-red-500 pl-1">{{ v$.password.$errors[0].$message }}</p>
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <button
        type="button"
        class="rounded-full bg-gray-400 px-6 py-2.5 text-sm font-roboto font-medium text-white hover:bg-gray-500"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
      <BaseButton type="submit" :loading="loading" class="rounded-full px-6">
        {{ initial ? 'Save Changes' : 'Create New User' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import type { User } from '@/types'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{ initial?: User | null; loading?: boolean }>()
const emit = defineEmits<{ submit: [payload: any]; cancel: [] }>()

const form = reactive({ firstName: '', lastName: '', email: '', password: '', phone: '', role: '' })

watch(() => props.initial, (v) => {
  if (v) { form.firstName = v.firstName; form.lastName = v.lastName; form.email = v.email; form.phone = v.phone ?? ''; form.role = v.role }
}, { immediate: true })

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
  const payload: any = { firstName: form.firstName, lastName: form.lastName, email: form.email, role: form.role || 'STAFF', phone: form.phone || undefined }
  if (!props.initial) payload.password = form.password
  emit('submit', payload)
}
</script>
