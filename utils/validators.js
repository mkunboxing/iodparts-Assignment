export const useValidators = () => {
  const validateEmail = (email) => {
    if (!email) return 'Email is required'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Invalid email format'
    
    return ''
  }

  const validatePassword = (password) => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    
    return ''
  }

  return {
    validateEmail,
    validatePassword
  }
} 