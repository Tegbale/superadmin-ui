<template>
  <div class="flex min-h-screen items-center justify-center bg-[#f3f3f3] px-4">
    <div class="w-full max-w-md rounded-2xl bg-white px-10 py-10 shadow-sm">
      <div class="mb-8 flex flex-col items-center gap-3">
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-tegbale-blue text-white text-2xl font-bold font-poppins">T</div>
        <h1 class="text-2xl font-bold text-tegbale-blue font-poppins">
          {{ sent ? 'Check your email' : 'Forgot Password' }}
        </h1>
      </div>

      <!-- Success state -->
      <div v-if="sent" class="flex flex-col items-center gap-4 text-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <p class="text-sm text-tegbale-text-gray font-roboto leading-relaxed">
          If <strong class="text-tegbale-navy-blue">{{ email }}</strong> is registered, a reset link has been sent. Check your inbox (and spam folder).
        </p>
        <RouterLink :to="{ name: 'login' }" class="mt-2 text-sm text-tegbale-blue font-roboto hover:underline">
          Back to login
        </RouterLink>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <p class="text-sm text-tegbale-text-gray font-roboto text-center -mt-2">
          Enter your email and we'll send you a reset link.
        </p>

        <div class="relative">
          <span class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-tegbale-blue">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
            </svg>
          </span>
          <input
            v-model="email"
            type="email"
            placeholder="Email Address"
            class="w-full rounded-full border border-gray-200 py-3 pl-12 pr-4 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-2 focus:ring-tegbale-blue/20"
            :class="{ 'border-red-400': emailError }"
            @blur="emailError = !email"
          />
          <p v-if="emailError" class="mt-1 pl-4 text-xs text-red-500">Please enter a valid email</p>
        </div>

        <p v-if="error" class="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 font-roboto">{{ error }}</p>

        <BaseButton type="submit" size="lg" :loading="loading" class="w-full rounded-full mt-1">
          Send Reset Link
        </BaseButton>

        <RouterLink :to="{ name: 'login' }" class="text-center text-sm text-tegbale-blue font-roboto hover:underline">
          Back to login
        </RouterLink>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { forgotPassword } from '@/api/auth'
import BaseButton from '@/components/base/BaseButton.vue'

const email = ref('')
const emailError = ref(false)
const loading = ref(false)
const error = ref('')
const sent = ref(false)

const handleSubmit = async () => {
  emailError.value = !email.value
  if (emailError.value) return

  loading.value = true
  error.value = ''
  try {
    await forgotPassword(email.value)
    sent.value = true
  } catch {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
