<template>
  <div class="blog-detail-view">
    <!-- Loading -->
    <div v-if="store.loading" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading blog content...</p>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="text-center py-20">
      <div class="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
      <p class="text-gray-600 mb-6">{{ store.error }}</p>
      <div class="space-x-4">
        <button 
          @click="fetchBlog"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
        <router-link 
          to="/"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back to Home
        </router-link>
      </div>
    </div>

    <!-- Blog Content -->
    <div v-else-if="store.currentBlog" class="max-w-4xl mx-auto">
      <!-- Navigation -->
      <div class="mb-8">
        <router-link 
          to="/"
          class="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Back to Blogs
        </router-link>
      </div>

      <!-- Blog Display -->
      <BlogView 
        :blog="store.currentBlog"
        :loading="store.loading"
        :error="store.error"
        @retry="fetchBlog"
      />

      <!-- Admin Actions -->
      <div v-if="isAdminView" class="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
        <div class="flex space-x-4">
          <button 
            @click="editBlog"
            class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            ✏️ Edit Blog
          </button>
          <button 
            @click="deleteBlog"
            class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            🗑️ Delete Blog
          </button>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-20">
      <div class="text-gray-400 text-6xl mb-4">🔍</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
      <p class="text-gray-600 mb-6">The blog you're looking for doesn't exist.</p>
      <router-link 
        to="/"
        class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Browse All Blogs
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blogStore'
import BlogView from '@/components/BlogView.vue'

const route = useRoute()
const router = useRouter()
const store = useBlogStore()

const blogId = route.params.id

// Fetch blog on mount
const fetchBlog = () => {
  store.getBlogById(blogId)
}

onMounted(() => {
  fetchBlog()
})

// Check if admin view (for future features)
const isAdminView = computed(() => {
  return route.path.includes('/admin/')
})

// Edit blog (future feature)
const editBlog = () => {
  router.push(`/admin/edit/${blogId}`)
}

// Delete blog
const deleteBlog = async () => {
  if (confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
    const result = await store.deleteBlog(blogId)
    
    if (result.success) {
      alert('Blog deleted successfully!')
      router.push('/')
    } else {
      alert('Failed to delete blog: ' + (result.error || 'Unknown error'))
    }
  }
}
</script>
