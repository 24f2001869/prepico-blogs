<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading blogs...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">Error loading blogs: {{ error }}</p>
      <button @click="$emit('refresh')" class="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="blogs.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📝</div>
      <h3 class="text-xl font-semibold text-gray-700">No blogs yet</h3>
      <p class="text-gray-500 mt-2">Create your first blog from the admin panel!</p>
      <router-link to="/admin" class="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Go to Admin
      </router-link>
    </div>

    <!-- Blog Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="blog in blogs" 
        :key="blog.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        @click="$router.push(`/blog/${blog.id}`)"
      >
        <!-- Thumbnail -->
        <div v-if="blog.thumbnail" class="h-48 overflow-hidden">
          <img 
            :src="blog.thumbnail" 
            :alt="blog.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div v-else class="h-48 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
          <span class="text-4xl">📄</span>
        </div>

        <!-- Content -->
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {{ blog.title }}
          </h3>
          
          <div class="flex items-center text-gray-500 text-sm mb-4">
            <span>📅</span>
            <span class="ml-2">
              {{ formatDate(blog.created_at) }}
            </span>
            <span class="mx-2">•</span>
            <span>
              {{ countBlocks(blog.content) }} blocks
            </span>
          </div>

          <div class="flex justify-between items-center">
            <button 
              @click.stop="$router.push(`/blog/${blog.id}`)"
              class="px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            >
              Read More
            </button>
            
            <button 
              v-if="showDelete"
              @click.stop="$emit('delete', blog.id)"
              class="px-3 py-1 text-red-600 hover:text-red-800"
              title="Delete blog"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  blogs: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  showDelete: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh', 'delete'])

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Count blocks in content
const countBlocks = (content) => {
  if (!content || !Array.isArray(content)) return 0
  return content.length
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
