<template>
  <nav class="bg-green-100 shadow">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Left side -->
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-xl font-bold text-gray-800">MK-Shop</NuxtLink>
          
          <!-- GitHub Link -->
          <a 
            href="https://github.com/mkunboxing"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            <span class="hidden sm:inline">GitHub</span>
          </a>

          <!-- Resume Link -->
          <a 
            href="/mukul-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <svg 
              class="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span class="hidden sm:inline">Resume</span>
          </a>
        </div>
        
        <!-- Right side -->
        <div v-if="!isAuthenticated" class="text-gray-600">
          Login to continue
        </div>

        <div v-else class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div 
              class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm"
            >
              {{ getInitial(user?.name) }}
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-700">{{ user?.name }}</span>
              <span class="text-xs text-gray-500">{{ user?.role }}</span>
            </div>
          </div>
          <button 
            @click="handleLogout"
            class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, isAuthenticated, logout } = useAuth()
const router = useRouter()

const getInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?'
}

const handleLogout = async () => {
  logout()
  await router.push('/login')
}
</script> 