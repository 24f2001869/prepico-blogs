<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            <!-- Prepico Logo Placeholder - Replace with actual logo -->
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <span class="text-xl font-bold text-gray-900">Prepico</span>
              <span class="text-gray-600 ml-1">Blog</span>
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-blue-600 font-medium transition"
            :class="{ 'text-blue-600': $route.path === '/' }"
          >
            Home
          </router-link>
          
          <template v-if="authStore.isAuthenticated">
            <router-link 
              to="/admin" 
              class="text-gray-700 hover:text-blue-600 font-medium transition"
              :class="{ 'text-blue-600': $route.path === '/admin' }"
            >
              Dashboard
            </router-link>
            <button 
              @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link 
              v-if="$route.path !== '/login'"
              to="/login" 
              class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Admin Login
            </router-link>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button @click="isMenuOpen = !isMenuOpen" class="p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMenuOpen" class="md:hidden border-t border-gray-200">
        <div class="pt-2 pb-3 space-y-1">
          <router-link 
            to="/" 
            class="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            @click="isMenuOpen = false"
          >
            Home
          </router-link>
          
          <template v-if="authStore.isAuthenticated">
            <router-link 
              to="/admin" 
              class="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              @click="isMenuOpen = false"
            >
              Dashboard
            </router-link>
            <button 
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link 
              v-if="$route.path !== '/login'"
              to="/login" 
              class="block px-4 py-2 text-base font-medium text-blue-600 hover:bg-blue-50"
              @click="isMenuOpen = false"
            >
              Admin Login
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const isMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  isMenuOpen.value = false
}
</script>
