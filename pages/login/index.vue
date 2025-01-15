<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 class="text-3xl font-bold text-center">Sign In</h1>
        <LoginForm />
      </div>
    </div>
</template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useAuth } from '~/composables/useAuth'

  const { checkAuth } = useAuth()
  const router = useRouter()

  onMounted(async () => {
    if (import.meta.client) {
      // Check if user is already authenticated
      const token = localStorage.getItem('token')
      if (token) {
        const isAuthenticated = await checkAuth()
        if (isAuthenticated) {
          router.push('/')
        }
      }
    }
  })

  // Import the LoginForm component
  import LoginForm from '~/components/auth/LoginForm.vue'
  
  // Add meta tags for the login page
  useHead({
    title: 'Sign In - MK-Shop',
    meta: [
      {
        name: 'description',
        content: 'Sign in to your account to access your dashboard and manage your settings.'
      },
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
  
  // Use auth layout
  definePageMeta({
    layout: 'auth'
  })
  </script>