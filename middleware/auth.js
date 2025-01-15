export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware if going to login page to avoid redirect loop
  if (to.path === '/login') return

  // Check for token only on client side
  if (import.meta.client) {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('No token found, redirecting to login')
      return navigateTo('/login')
    }

    // Verify token validity
    const { checkAuth, loading } = useAuth()
    const isAuthenticated = await checkAuth()
    
    if (!isAuthenticated && !loading) {
      console.log('Invalid token, redirecting to login')
      return navigateTo('/login')
    }
  }
}) 