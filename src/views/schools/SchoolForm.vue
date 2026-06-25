<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
    <p class="text-sm font-semibold text-tegbale-navy-blue font-roboto">School Information</p>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-xs text-tegbale-text-gray font-roboto">Name</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Laurel Nursery and Primary School"
          class="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20"
          :class="{ 'border-red-400': v$.name.$error }"
          @blur="v$.name.$touch()"
        />
        <p v-if="v$.name.$error" class="text-xs text-red-500 pl-1">School name is required</p>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs text-tegbale-text-gray font-roboto">Location</label>
        <input
          v-model="form.address"
          type="text"
          placeholder="Lagos State"
          class="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20"
        />
      </div>
    </div>

    <p class="text-sm font-semibold text-tegbale-navy-blue font-roboto">Contact Information</p>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-xs text-tegbale-text-gray font-roboto">Email Address</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="school@example.com"
          class="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20"
          :class="{ 'border-red-400': v$.email.$error }"
          @blur="v$.email.$touch()"
        />
        <p v-if="v$.email.$error" class="text-xs text-red-500 pl-1">{{ v$.email.$errors[0].$message }}</p>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs text-tegbale-text-gray font-roboto">Phone Number</label>
        <input
          v-model="form.phone"
          type="tel"
          placeholder="+234 800 000 0000"
          class="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-1 focus:ring-tegbale-blue/20"
        />
      </div>
    </div>

    <div class="flex items-center justify-between pt-2">
      <button
        v-if="initial"
        type="button"
        class="rounded-full bg-red-500 px-6 py-2.5 text-sm font-roboto font-medium text-white hover:bg-red-600"
        @click="$emit('delete')"
      >
        Delete School
      </button>
      <div class="flex gap-3 ml-auto">
        <button
          type="button"
          class="rounded-full bg-gray-400 px-6 py-2.5 text-sm font-roboto font-medium text-white hover:bg-gray-500"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
        <BaseButton type="submit" :loading="loading" class="rounded-full px-6">
          {{ initial ? 'Save Changes' : 'Create School' }}
        </BaseButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import type { School } from '@/types'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{ initial?: School | null; loading?: boolean }>()
const emit = defineEmits<{
  submit: [payload: { name: string; email: string; phone?: string; address?: string }]
  cancel: []
  delete: []
}>()

const form = reactive({ name: '', email: '', phone: '', address: '' })

watch(() => props.initial, (v) => {
  if (v) { form.name = v.name; form.email = v.email; form.phone = v.phone ?? ''; form.address = v.address ?? '' }
}, { immediate: true })

const rules = { name: { required }, email: { required, email } }
const v$ = useVuelidate(rules, form)

const handleSubmit = async () => {
  const valid = await v$.value.$validate()
  if (!valid) return
  emit('submit', { name: form.name, email: form.email, phone: form.phone || undefined, address: form.address || undefined })
}
</script>
