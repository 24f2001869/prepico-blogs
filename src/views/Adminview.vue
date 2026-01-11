<template>
  <div class="admin-view">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="text-gray-600">Create and manage blog posts with block-based editor</p>
    </div>

    <!-- Tabs -->
    <div class="flex border-b mb-6">
      <button 
        @click="activeTab = 'create'"
        :class="[
          'px-6 py-3 font-medium border-b-2 transition-colors',
          activeTab === 'create' 
            ? 'border-blue-600 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        ✏️ Create New
      </button>
      <button 
        @click="activeTab = 'manage'; fetchBlogs()"
        :class="[
          'px-6 py-3 font-medium border-b-2 transition-colors',
          activeTab === 'manage' 
            ? 'border-blue-600 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        📋 Manage Blogs
      </button>
    </div>

    <!-- Create Blog Tab -->
    <div v-if="activeTab === 'create'" class="space-y-6">
      <!-- Blog Form -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="space-y-6">
          <!-- Title Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Blog Title *
            </label>
            <input 
              type="text"
              v-model="newBlog.title"
              placeholder="Enter blog title..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <!-- Thumbnail Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail URL (Optional)
            </label>
            <input 
              type="url"
              v-model="newBlog.thumbnail"
              placeholder="https://example.com/image.jpg"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div v-if="newBlog.thumbnail" class="mt-3">
              <p class="text-sm text-gray-600 mb-2">Preview:</p>
              <img 
                :src="newBlog.thumbnail" 
                alt="Thumbnail preview"
                class="w-32 h-32 object-cover rounded border"
                @error="newBlog.thumbnail = ''"
              />
            </div>
          </div>

          <!-- Editor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <AdminEditor v-model="newBlog.content" />
            <p class="text-sm text-gray-500 mt-2">
              Click on blocks to select, drag buttons to reorder
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <button 
              @click="resetForm"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
            <button 
              @click="createBlog"
              :disabled="!isFormValid || store.loading"
              :class="[
                'px-6 py-2 rounded-lg font-medium',
                !isFormValid || store.loading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              ]"
            >
              {{ store.loading ? 'Creating...' : 'Publish Blog' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div v-if="newBlog.content && newBlog.content.length > 0" class="bg-gray-50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div class="bg-white p-6 rounded-lg border">
          <h2 class="text-2xl font-bold mb-4">{{ newBlog.title || 'Untitled Blog' }}</h2>
          <div class="space-y-4">
            <div 
              v-for="(block, index) in newBlog.content" 
              :key="index"
              class="p-3 bg-gray-50 rounded"
            >
              <div class="text-xs text-gray-500 mb-1 uppercase">{{ block.type }}</div>
              <div class="truncate">
                {{ block.content || '(Empty content)' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Manage Blogs Tab -->
    <div v-else class="space-y-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-lg shadow border">
          <div class="text-2xl font-bold text-blue-600">{{ store.blogs.length }}</div>
          <div class="text-gray-600">Total Blogs</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow border">
          <div class="text-2xl font-bold text-green-600">{{ totalBlocks }}</div>
          <div class="text-gray-600">Total Blocks</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow border">
          <div class="text-2xl font-bold text-purple-600">{{ latestBlogDate }}</div>
          <div class="text-gray-600">Latest Blog</div>
        </div>
      </div>

      <!-- Blog List with Delete -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <BlogList 
          :blogs="store.blogs"
          :loading="store.loading"
          :error="store.error"
          :show-delete="true"
          @refresh="fetchBlogs"
          @delete="deleteBlog"
        />
      </div>
    </div>

    <!-- Messages -->
    <div v-if="message" class="fixed bottom-4 right-4">
      <div :class="[
        'p-4 rounded-lg shadow-lg max-w-sm',
        message.type === 'success' ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800'
      ]">
        <div class="flex justify-between items-start">
          <div class="flex items-center">
            <span class="mr-2">
              {{ message.type === 'success' ? '✅' : '❌' }}
            </span>
            <div>
              <p class="font-medium">{{ message.title }}</p>
              <p class="text-sm">{{ message.text }}</p>
            </div>
          </div>
          <button @click="message = null" class="ml-4 text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blogStore'
import AdminEditor from '@/components/AdminEditor.vue'
import BlogList from '@/components/BlogList.vue'

const store = useBlogStore()
const activeTab = ref('create')

// New blog form
const newBlog = ref({
  title: '',
  thumbnail: '',
  content: []
})

const message = ref(null)

// Form validation
const isFormValid = computed(() => {
  return newBlog.value.title.trim() !== '' && 
         newBlog.value.content.length > 0
})

// Fetch blogs
const fetchBlogs = () => {
  store.fetchBlogs()
}

onMounted(() => {
  fetchBlogs()
})

// Create new blog
const createBlog = async () => {
  if (!isFormValid.value) return

  const result = await store.createBlog({
    title: newBlog.value.title,
    thumbnail: newBlog.value.thumbnail || null,
    content: newBlog.value.content
  })

  if (result.success) {
    showMessage('success', 'Blog Published!', 'Your blog has been created successfully.')
    resetForm()
    activeTab.value = 'manage'
  } else {
    showMessage('error', 'Failed to Publish', result.error || 'Something went wrong.')
  }
}

// Delete blog
const deleteBlog = async (id) => {
  if (confirm('Are you sure you want to delete this blog?')) {
    const result = await store.deleteBlog(id)
    
    if (result.success) {
      showMessage('success', 'Blog Deleted', 'The blog has been deleted successfully.')
    } else {
      showMessage('error', 'Failed to Delete', result.error || 'Something went wrong.')
    }
  }
}

// Reset form
const resetForm = () => {
  newBlog.value = {
    title: '',
    thumbnail: '',
    content: []
  }
}

// Show message
const showMessage = (type, title, text) => {
  message.value = { type, title, text }
  setTimeout(() => {
    message.value = null
  }, 5000)
}

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
