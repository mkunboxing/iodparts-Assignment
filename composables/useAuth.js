import { ref } from 'vue'

export const useAuth = () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(true)

  const login = async (credentials) => {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)

      // Store the access token
      if (import.meta.client) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
      }

      // Get user profile after successful login
      await getUserProfile(data.access_token)
      
      isAuthenticated.value = true
      return data
    } catch (error) {
      throw error
    }
  }

  const getUserProfile = async (token) => {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to get user profile')

      const userData = await response.json()
      user.value = {
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        role: userData.role
      }
      console.log(user.value)

      if (import.meta.client) {
        localStorage.setItem('userData', JSON.stringify(user.value))
      }

      return userData
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  }

  const checkAuth = async () => {
    try {
      if (!import.meta.client) return false

      const token = localStorage.getItem('token')
      if (!token) {
        isAuthenticated.value = false
        return false
      }

      // Verify token by getting user profile
      const userData = await getUserProfile(token)
      if (userData) {
        isAuthenticated.value = true
        return true
      }
      return false
    } catch (error) {
      console.error('Auth check failed:', error)
      isAuthenticated.value = false
      if (import.meta.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('userData')
      }
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    if (import.meta.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('userData')
    }
  }

  // Initialize user data from localStorage if available
  const initializeFromStorage = () => {
    if (import.meta.client) {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('userData')
      
      if (token && userData) {
        user.value = JSON.parse(userData)
        isAuthenticated.value = true
      }
    }
  }

  // Call initialization
  initializeFromStorage()

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth
  }
} 