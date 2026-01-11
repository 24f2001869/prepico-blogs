<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 md:py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Prepico Logo -->
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span class="text-white text-3xl font-bold">P</span>
            </div>
          </div>
          
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Prepico <span class="text-blue-600">Blog</span>
          </h1>
          <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Tips, guides, and insights to help you ace your career journey. 
            Powered by AI & Experts.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              v-if="!authStore.isAuthenticated"
              to="/login" 
              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md transition"
            >
              Admin Dashboard
            </router-link>
            <a 
              href="https://www.prepico.ai" 
              target="_blank"
              class="px-8 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition"
            >
              Visit Prepico.ai →
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Section -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Featured Insights</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Discover expert-curated content to boost your career prospects
          </p>
        </div>

        <!-- Featured Blog -->
        <div v-if="featuredBlog" class="max-w-4xl mx-auto mb-16">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden shadow-xl">
            <div class="md:flex">
              <div class="md:w-2/5">
                <div class="h-64 md:h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <span v-if="!featuredBlog.thumbnail" class="text-6xl">📝</span>
                  <img v-else :src="featuredBlog.thumbnail" :alt="featuredBlog.title" class="w-full h-full object-cover">
                </div>
              </div>
              <div class="md:w-3/5 p-8 md:p-10">
                <div class="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                  Featured
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ featuredBlog.title }}</h3>
                <p class="text-gray-600 mb-6">
                  {{ getExcerpt(featuredBlog) }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500">
                    {{ formatDate(featuredBlog.created_at) }}
                  </span>
                  <router-link 
                    :to="`/blog/${featuredBlog.id}`"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Read Full Article
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- All Blogs Grid -->
        <div class="mb-12">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-2xl font-bold text-gray-900">Latest Posts</h3>
            <div class="text-sm text-gray-500">
              {{ store.blogs.length }} {{ store.blogs.length === 1 ? 'article' : 'articles' }}
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="store.loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p class="mt-3 text-gray-600">Loading articles...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="store.error" class="text-center py-12">
            <div class="text-red-500 text-5xl mb-4">⚠️</div>
            <h4 class="text-xl font-semibold text-gray-900 mb-2">Unable to load content</h4>
            <p class="text-gray-600 mb-6">{{ store.error }}</p>
            <button @click="fetchBlogs" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Try Again
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="store.blogs.length === 0" class="text-center py-12">
            <div class="text-gray-400 text-6xl mb-4">📝</div>
            <h4 class="text-xl font-semibold text-gray-900 mb-2">No articles yet</h4>
            <p class="text-gray-600 mb-6">Be the first to share your career insights</p>
            <router-link 
              to="/login" 
              class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Write First Article
            </router-link>
          </div>

          <!-- Blogs Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="blog in store.blogs" 
              :key="blog.id"
              class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              @click="$router.push(`/blog/${blog.id}`)"
            >
              <!-- Thumbnail -->
              <div class="h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <div v-if="!blog.thumbnail" class="w-full h-full flex items-center justify-center">
                  <span class="text-4xl text-gray-400">📄</span>
                </div>
                <img v-else :src="blog.thumbnail" :alt="blog.title" class="w-full h-full object-cover">
              </div>

              <!-- Content -->
              <div class="p-6">
                <h4 class="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {{ blog.title }}
                </h4>
                
                <div class="flex items-center text-gray-500 text-sm mb-4">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                  </svg>
                  <span>{{ formatDate(blog.created_at) }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ estimateReadTime(blog) }} min read</span>
                </div>

                <p class="text-gray-600 text-sm mb-6 line-clamp-3">
                  {{ getExcerpt(blog) }}
                </p>

                <div class="flex justify-between items-center">
                  <router-link 
                    :to="`/blog/${blog.id}`"
                    class="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Read more →
                  </router-link>
                  
                  <!-- Admin Actions -->
                  <div v-if="authStore.isAuthenticated" class="flex space-x-2">
                    <button 
                      @click.stop="editBlog(blog.id)"
                      class="p-1 text-gray-500 hover:text-blue-600"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      @click.stop="deleteBlog(blog.id)"
                      class="p-1 text-gray-500 hover:text-red-600"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 class="text-2xl md:text-3xl font-bold mb-4">Ready to share your insights?</h3>
          <p class="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of career experts and contribute valuable content
          </p>
          <router-link 
            to="/login" 
            class="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 shadow-lg transition"
          >
            Start Writing
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blogStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const store = useBlogStore()
const authStore = useAuthStore()

// Fetch blogs on mount
const fetchBlogs = () => {
  store.fetchBlogs()
}

onMounted(() => {
  fetchBlogs()
})

// Get featured blog (most recent)
const featuredBlog = computed(() => {
  return store.blogs.length > 0 ? store.blogs[0] : null
})

// Get excerpt from blog content
const getExcerpt = (blog) => {
  if (!blog.content || !Array.isArray(blog.content)) {
    return 'No content available'
  }
  
  // Find first paragraph
  const firstPara = blog.content.find(block => 
    block.type === 'paragraph' && block.content
  )
  
  if (firstPara && firstPara.content) {
    return firstPara.content.length > 150 
      ? firstPara.content.substring(0, 150) + '...'
      : firstPara.content
  }
  
  return 'Read the full article for insights...'
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Estimate read time
const estimateReadTime = (blog) => {
  if (!blog.content || !Array.isArray(blog.content)) return 2
  
  let totalWords = 0
  blog.content.forEach(block => {
    if (block.type === 'paragraph' && block.content) {
      totalWords += block.content.split(' ').length
    } else if (block.type === 'heading' && block.content) {
      totalWords += block.content.split(' ').length
    } else if (block.type === 'subheading' && block.content) {
      totalWords += block.content.split(' ').length
    } else if ((block.type === 'bullet-list' || block.type === 'number-list') && block.items) {
      block.items.forEach(item => {
        totalWords += item.split(' ').length
      })
    }
  })
  
  const readTime = Math.ceil(totalWords / 200)
  return readTime < 1 ? 1 : readTime
}

// Edit blog (navigate to admin)
const editBlog = (id) => {
  // In a full app, you'd navigate to edit mode
  alert(`Edit feature for blog ${id} would be implemented here`)
}

// Delete blog
const deleteBlog = async (id) => {
  if (confirm('Are you sure you want to delete this blog?')) {
    const result = await store.deleteBlog(id)
    if (result.success) {
      alert('Blog deleted successfully')
    } else {
      alert('Failed to delete blog: ' + result.error)
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
