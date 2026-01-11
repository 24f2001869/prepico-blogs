<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Prepico Header -->
      <div class="text-center mb-10">
        <div class="flex justify-center mb-4">
          <!-- Add Prepico logo here -->
          <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <span class="text-white text-2xl font-bold">P</span>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
        <p class="text-gray-600">Sign in to manage Prepico Blog content</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input 
              v-model="email"
              type="email"
              placeholder="admin@prepico.ai"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'border-red-300': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input 
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'border-red-300': errors.password }"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <button 
            @click="handleLogin"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
          >
            <span v-if="loading">
              <svg class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-else>Sign in to Admin</span>
          </button>

          <div v-if="loginError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ loginError }}</p>
          </div>

          <!-- Demo Credentials -->
          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800 font-medium mb-1">Demo Credentials:</p>
            <p class="text-sm text-blue-700">Email: <span class="font-mono">admin@prepico.ai</span></p>
            <p class="text-sm text-blue-700">Password: <span class="font-mono">Prepico@2024</span></p>
          </div>
        </div>
      </div>

      <!-- Back to Blog Link -->
      <div class="text-center mt-8">
        <router-link 
          to="/" 
          class="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Prepico Blog
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const loginError = ref('')

const errors = ref({
  email: '',
  password: ''
})

const validateForm = () => {
  errors.value = { email: '', password: '' }
  let valid = true

  if (!email.value.trim()) {
    errors.value.email = 'Email is required'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email'
    valid = false
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
    valid = false
  }

  return valid
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true
  loginError.value = ''

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800))

  const result = authStore.login(email.value, password.value)

  if (result.success) {
    router.push('/admin')
  } else {
    loginError.value = result.message
  }

  loading.value = false
}
</script>
