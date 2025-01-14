<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-500">
      <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 class="text-3xl font-bold text-center">Sign In</h1>
        <LoginForm />
      </div>
    </div>
  </template>
  
  <script setup>
  // Import the LoginForm component
  import LoginForm from '~/components/auth/LoginForm.vue'
  
  // Add meta tags for the login page
  useHead({
    title: 'Sign In - Your App Name',
    meta: [
      {
        name: 'description',
        content: 'Sign in to your account to access your dashboard and manage your settings.'
      },
      { name: 'robots', content: 'noindex, nofollow' }, // Prevent indexing of login page
      { property: 'og:title', content: 'Sign In - Your App Name' },
      { property: 'og:description', content: 'Sign in to your account to access your dashboard and manage your settings.' },
      { name: 'twitter:title', content: 'Sign In - Your App Name' },
      { name: 'twitter:description', content: 'Sign in to your account to access your dashboard and manage your settings.' }
    ]
  })
  
  // Use auth layout
  definePageMeta({
    layout: 'auth'
  })
  </script>