<template>
  <div class="home-view">
    <!-- Header -->
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Prepico Blogs</h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Discover insightful articles and tutorials. Created with Vue 3, Supabase, and block-based editing.
      </p>
    </div>

    <!-- Blog List -->
    <BlogList 
      :blogs="store.blogs"
      :loading="store.loading"
      :error="store.error"
      :show-delete="false"
      @refresh="fetchBlogs"
    />

    <!-- Stats -->
    <div v-if="!store.loading && store.blogs.length > 0" class="mt-12 pt-8 border-t">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-blue-50 p-6 rounded-lg">
          <div class="text-3xl font-bold text-blue-600">{{ store.blogs.length }}</div>
          <div class="text-gray-700">Total Blogs</div>
        </div>
        <div class="bg-green-50 p-6 rounded-lg">
          <div class="text-3xl font-bold text-green-600">
            {{ totalBlocks }}
          </div>
          <div class="text-gray-700">Content Blocks</div>
        </div>
        <div class="bg-purple-50 p-6 rounded-lg">
          <div class="text-3xl font-bold text-purple-600">
            {{ latestBlogDate }}
          </div>
          <div class="text-gray-700">Latest Update</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useBlogStore } from '@/stores/blogStore'
import BlogList from '@/components/BlogList.vue'

const store = useBlogStore()

// Fetch blogs on mount
const fetchBlogs = () => {
  store.fetchBlogs()
}

onMounted(() => {
  fetchBlogs()
})

// Compute total blocks
const totalBlocks = computed(() => {
  return store.blogs.reduce((total, blog) => {
    return total + (blog.content?.length || 0)
  }, 0)
})

// Get latest blog date
const latestBlogDate = computed(() => {
  if (store.blogs.length === 0) return 'N/A'
  
  const dates = store.blogs.map(blog => new Date(blog.created_at))
  const latest = new Date(Math.max(...dates))
  
  return latest.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
})
</script>
