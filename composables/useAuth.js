import { ref } from 'vue'

export const useAuth = () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const login = async (credentials) => {
    try {
      // Here you would typically make an API call to your backend
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })

      // Handle the response
      user.value = response.user
      isAuthenticated.value = true

      // You might want to store the token in localStorage or cookie
      localStorage.setItem('token', response.token)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('token')
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
} 