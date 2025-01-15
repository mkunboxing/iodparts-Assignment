<template>
  <div class="min-h-[calc(100vh-64px)] px-4 py-8 sm:px-6 sm:py-12">
    <div class="max-w-[340px] sm:max-w-[400px] mx-auto bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 sm:p-8 border border-white/20">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">Login</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            :class="[
              'w-full px-3 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-0 transition-colors duration-200',
              errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            ]"
            @blur="validateField('email')"
            required
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            :class="[
              'w-full px-3 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-0 transition-colors duration-200',
              errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            ]"
            @blur="validateField('password')"
            required
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div class="space-y-3">
          <button
            type="submit"
            :disabled="loading || hasErrors"
            class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors duration-200"
            :class="[
              loading || hasErrors 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            ]"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>

          <!-- Fill Test Credentials Button -->
          <button
            type="button"
            @click="fillTestCredentials"
            class="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Fill Test Credentials
          </button>
        </div>

        <!-- Test credentials info -->
        <div class="text-sm text-gray-500 text-center border-t pt-4">
          <p class="font-medium">Test Credentials</p>
          <p>Email: john@mail.com</p>
          <p>Password: changeme</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useValidators } from '~/utils/validators'

const { login } = useAuth()
const { validateEmail, validatePassword } = useValidators()

const loading = ref(false)
const error = ref('')
const errors = reactive({
  email: '',
  password: ''
})

const form = reactive({
  email: '',
  password: ''
})

const hasErrors = computed(() => {
  return Object.values(errors).some(error => error !== '') || 
         !form.email || 
         !form.password
})

const validateField = (field) => {
  if (field === 'email') {
    errors.email = validateEmail(form.email)
  }
  if (field === 'password') {
    errors.password = validatePassword(form.password)
  }
}

const validateForm = () => {
  errors.email = validateEmail(form.email)
  errors.password = validatePassword(form.password)
  return !errors.email && !errors.password
}

const fillTestCredentials = () => {
  form.email = 'john@mail.com'
  form.password = 'changeme'
  // Clear any existing errors
  errors.email = ''
  errors.password = ''
  error.value = ''
}

const handleSubmit = async () => {
  try {
    if (!validateForm()) return

    loading.value = true
    error.value = ''
    await login(form)
    await navigateTo('/')
  } catch (e) {
    error.value = 'Invalid email or password'
    console.error('Login error:', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.backdrop-blur-md {
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}
</style>
