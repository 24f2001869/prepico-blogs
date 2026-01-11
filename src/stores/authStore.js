import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)

  // Hardcoded admin credentials (as per assignment)
  const ADMIN_CREDENTIALS = {
    email: 'admin@prepico.ai',
    password: 'Prepico@2024'
  }

  const login = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && 
        password === ADMIN_CREDENTIALS.password) {
      isAuthenticated.value = true
      user.value = { email, role: 'admin' }
      
      // Store in session storage (not localStorage for blogs)
      sessionStorage.setItem('prepico_auth', 'true')
      return { success: true, message: 'Login successful' }
    }
    return { success: false, message: 'Invalid credentials' }
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    sessionStorage.removeItem('prepico_auth')
  }

  const checkAuth = () => {
    const storedAuth = sessionStorage.getItem('prepico_auth')
    if (storedAuth) {
      isAuthenticated.value = true
    }
    return isAuthenticated.value
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuth
  }
})
