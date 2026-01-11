<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold text-blue-600">
        Prepico Blogs
      </router-link>
      
      <div class="space-x-4">
        <router-link 
          to="/" 
          class="px-4 py-2 rounded hover:bg-gray-100"
          :class="{ 'text-blue-600 font-semibold': $route.path === '/' }"
        >
          All Blogs
        </router-link>
        
        <router-link 
          to="/admin" 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          :class="{ 'bg-blue-700': $route.path === '/admin' }"
        >
          Admin Panel
        </router-link>
      </div>
    </div>
  </nav>
</template>
