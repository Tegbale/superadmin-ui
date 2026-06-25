<template>
  <div class="flex min-h-screen items-center justify-center bg-[#f3f3f3] px-4">
    <div class="w-full max-w-md rounded-2xl bg-white px-10 py-10 shadow-sm">
      <!-- Logo -->
      <div class="mb-8 flex flex-col items-center gap-3">
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-tegbale-blue text-white text-2xl font-bold font-poppins">
          T
        </div>
        <h1 class="text-2xl font-bold text-tegbale-blue font-poppins">Welcome Back</h1>
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <!-- Email input -->
        <div class="relative">
          <span class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-tegbale-blue">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
            </svg>
          </span>
          <input
            v-model="form.email"
            type="email"
            placeholder="Email Address"
            class="w-full rounded-full border border-gray-200 py-3 pl-12 pr-4 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-2 focus:ring-tegbale-blue/20"
            :class="{ 'border-red-400': v$.email.$error }"
            @blur="v$.email.$touch()"
          />
          <p v-if="v$.email.$error" class="mt-1 pl-4 text-xs text-red-500">{{ v$.email.$errors[0].$message }}</p>
        </div>

        <!-- Password input -->
        <div class="relative">
          <span class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-tegbale-blue">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
          </span>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="w-full rounded-full border border-gray-200 py-3 pl-12 pr-12 text-sm font-roboto text-gray-700 placeholder:text-tegbale-text-gray focus:border-tegbale-blue focus:outline-none focus:ring-2 focus:ring-tegbale-blue/20"
            :class="{ 'border-red-400': v$.password.$error }"
            @blur="v$.password.$touch()"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-4 flex items-center text-tegbale-text-gray hover:text-tegbale-blue"
            @click="showPassword = !showPassword"
          >
            <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
          </button>
          <p v-if="v$.password.$error" class="mt-1 pl-4 text-xs text-red-500">{{ v$.password.$errors[0].$message }}</p>
        </div>

        <!-- Forgot password -->
        <div class="flex justify-end -mt-1">
          <button type="button" class="text-sm text-tegbale-blue font-roboto hover:underline">
            Forgot Password?
          </button>
        </div>

        <p v-if="error" class="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 font-roboto">{{ error }}</p>

        <BaseButton type="submit" size="lg" :loading="loading" class="w-full rounded-full mt-1">
          Sign In
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { useAuthStore } from '@/stores/auth.store'
import BaseButton from '@/components/base/BaseButton.vue'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(6) },
}
const v$ = useVuelidate(rules, form)

const handleLogin = async () => {
  const valid = await v$.value.$validate()
  if (!valid) return

  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.email, form.password)
    router.push({ name: 'dashboard' })
  } catch (err) {
    error.value = typeof err === 'string' ? err : 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>
