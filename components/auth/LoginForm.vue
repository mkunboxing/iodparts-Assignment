<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        v-model="form.email"
        type="email"
        id="email"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        :class="{ 'border-red-500': errors.email }"
        required
      />
      <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input
        v-model="form.password"
        type="password"
        id="password"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        :class="{ 'border-red-500': errors.password }"
        required
      />
      <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
    </div>

    <button
      type="submit"
      :disabled="isLoading"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {{ isLoading ? 'Loading...' : 'Sign in' }}
    </button>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useValidators } from '~/utils/validators'
import { useAuth } from '~/composables/useAuth'

const { validateEmail, validatePassword } = useValidators()
const { login } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false)

const validateForm = () => {
  let isValid = true
  errors.email = validateEmail(form.email)
  errors.password = validatePassword(form.password)

  if (errors.email || errors.password) {
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    isLoading.value = true
    await login(form)
    // Redirect to dashboard or home page after successful login
    await navigateTo('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
