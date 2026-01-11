<template>
  <div class="admin-view">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">Content Dashboard</h1>
            <p class="text-blue-100">Manage all blog content and media</p>
          </div>
          <div class="mt-4 md:mt-0">
            <button 
              @click="logout"
              class="px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-6">Navigation</h3>
            <nav class="space-y-2">
              <button 
                @click="activeTab = 'create'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg font-medium transition',
                  activeTab === 'create' 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                ]"
              >
                ✏️ Create New
              </button>
              <button 
                @click="activeTab = 'manage'; fetchBlogs()"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg font-medium transition',
                  activeTab === 'manage' 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                ]"
              >
                📋 Manage Blogs
              </button>
              <button 
                @click="activeTab = 'stats'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg font-medium transition',
                  activeTab === 'stats' 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                ]"
              >
                📊 Statistics
              </button>
            </nav>

            <!-- Quick Stats -->
            <div class="mt-8 pt-8 border-t border-gray-200">
              <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Quick Stats
              </h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Total Blogs</span>
                  <span class="font-bold">{{ store.blogs.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Blocks Created</span>
                  <span class="font-bold">{{ totalBlocks }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Last Updated</span>
                  <span class="font-bold text-sm">{{ latestBlogDate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Panel -->
        <div class="lg:col-span-3">
          <!-- Create Blog Tab -->
          <div v-if="activeTab === 'create'" class="space-y-8">
            <!-- Blog Form -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Create New Blog Post</h2>
              
              <div class="space-y-6">
                <!-- Title -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Blog Title *
                  </label>
                  <input 
                    v-model="newBlog.title"
                    type="text"
                    placeholder="e.g., Getting Started with Interview Preparation"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <!-- Thumbnail -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image URL *
                  </label>
                  <div class="flex gap-4">
                    <input 
                      v-model="newBlog.thumbnail"
                      type="url"
                      placeholder="https://example.com/thumbnail.jpg"
                      class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button 
                      @click="newBlog.thumbnail = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800'"
                      class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Use Sample
                    </button>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    Recommended: 1200×630 pixels
                  </p>
                  
                  <!-- Thumbnail Preview -->
                  <div v-if="newBlog.thumbnail" class="mt-4">
                    <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div class="w-32 h-32 border rounded-lg overflow-hidden">
                      <img 
                        :src="newBlog.thumbnail" 
                        alt="Thumbnail preview"
                        class="w-full h-full object-cover"
                        @error="newBlog.thumbnail = ''"
                      />
                    </div>
                  </div>
                </div>

                <!-- Content Editor -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Content *
                    </label>
                    <span class="text-sm text-gray-500">
                      {{ newBlog.content.length }} blocks
                    </span>
                  </div>
                  <AdminEditor v-model="newBlog.content" />
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end space-x-4 pt-6 border-t">
                  <button 
                    @click="resetForm"
                    class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Clear All
                  </button>
                  <button 
                    @click="createBlog"
                    :disabled="!isFormValid || store.loading"
                    :class="[
                      'px-8 py-3 rounded-lg font-medium',
                      !isFormValid || store.loading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                    ]"
                  >
                    {{ store.loading ? 'Publishing...' : 'Publish Blog' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Live Preview -->
            <div v-if="newBlog.content.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="border-b border-gray-200 p-6">
                <h3 class="text-xl font-bold text-gray-900">Live Preview</h3>
              </div>
              <div class="p-6">
                <div class="max-w-3xl mx-auto">
                  <!-- Preview Thumbnail -->
                  <div v-if="newBlog.thumbnail" class="mb-6 rounded-lg overflow-hidden">
                    <img :src="newBlog.thumbnail" :alt="newBlog.title" class="w-full h-64 object-cover">
                  </div>
                  
                  <!-- Preview Content -->
                  <div class="prose max-w-none">
                    <h1 class="text-3xl font-bold mb-6">{{ newBlog.title || 'Untitled Blog' }}</h1>
                    
                    <div class="space-y-6">
                      <div 
                        v-for="(block, index) in newBlog.content" 
                        :key="index"
                        class="p-4 border border-gray-200 rounded-lg"
                      >
                        <div class="text-xs text-gray-500 font-medium mb-2">
                          {{ formatBlockType(block.type) }}
                        </div>
                        
                        <!-- Preview different block types -->
                        <div v-if="block.type === 'paragraph'" class="text-gray-700">
                          {{ block.content || '(Empty paragraph)' }}
                        </div>
                        
                        <div v-else-if="block.type === 'heading'" class="text-2xl font-bold">
                          {{ block.content }}
                        </div>
                        
                        <div v-else-if="block.type === 'bullet-list' && block.items" class="pl-4">
                          <ul class="list-disc">
                            <li v-for="(item, i) in block.items" :key="i">{{ item }}</li>
                          </ul>
                        </div>
                        
                        <div v-else-if="block.type === 'image' && block.content" class="text-center">
                          <div class="text-sm text-gray-600 mb-2">[Image: {{ block.alt || 'No description' }}]</div>
                        </div>
                        
                        <div v-else-if="block.type === 'row-layout'" class="text-sm text-gray-600">
                          Row layout with {{ block.columns?.length || 0 }} columns
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Manage Blogs Tab -->
          <div v-else-if="activeTab === 'manage'" class="space-y-6">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div class="text-3xl font-bold text-blue-600 mb-2">{{ store.blogs.length }}</div>
                <div class="text-gray-600">Published Blogs</div>
              </div>
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div class="text-3xl font-bold text-green-600 mb-2">{{ totalBlocks }}</div>
                <div class="text-gray-600">Content Blocks</div>
              </div>
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div class="text-3xl font-bold text-purple-600 mb-2">{{ latestBlogDate }}</div>
                <div class="text-gray-600">Last Published</div>
              </div>
            </div>

            <!-- Blogs Table -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold text-gray-900">All Blog Posts</h3>
                  <button 
                    @click="activeTab = 'create'"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    + New Blog
                  </button>
                </div>
              </div>

              <!-- Loading -->
              <div v-if="store.loading" class="p-12 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p class="mt-3 text-gray-600">Loading blogs...</p>
              </div>

              <!-- Empty State -->
              <div v-else-if="store.blogs.length === 0" class="p-12 text-center">
                <div class="text-gray-400 text-5xl mb-4">📝</div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2">No blogs published yet</h4>
                <p class="text-gray-600 mb-6">Create your first blog post to get started</p>
                <button 
                  @click="activeTab = 'create'"
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Create First Blog
                </button>
              </div>

              <!-- Blogs Table -->
              <div v-else class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blocks</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="blog in store.blogs" :key="blog.id">
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                            <span v-if="!blog.thumbnail" class="text-gray-500">📄</span>
                            <img v-else :src="blog.thumbnail" :alt="blog.title" class="h-10 w-10 rounded-lg object-cover">
                          </div>
                          <div>
                            <div class="font-medium text-gray-900">{{ blog.title }}</div>
                            <div class="text-sm text-gray-500 truncate max-w-xs">
                              {{ blog.id.substring(0, 8) }}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-900">
                        {{ formatDate(blog.created_at) }}
                      </td>
                      <td class="px-6 py-4">
                        <span class="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {{ blog.content?.length || 0 }} blocks
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Published
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm font-medium">
                        <div class="flex space-x-3">
                          <router-link 
                            :to="`/blog/${blog.id}`"
                            class="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            👁️
                          </router-link>
                          <button 
                            @click="editBlog(blog.id)"
                            class="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button 
                            @click="deleteBlog(blog.id)"
                            class="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Statistics Tab -->
          <div v-else class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Blog Statistics</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Block Type Distribution -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Block Types Used</h3>
                  <div class="space-y-3">
                    <div v-for="(count, type) in blockTypeDistribution" :key="type" class="flex items-center">
                      <div class="w-32 text-sm text-gray-600">{{ formatBlockType(type) }}</div>
                      <div class="flex-1">
                        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            :style="{ width: getPercentage(count, totalBlocks) + '%' }"
                            class="h-full bg-blue-600 rounded-full"
                          ></div>
                        </div>
                      </div>
                      <div class="w-10 text-right text-sm font-medium">{{ count }}</div>
                    </div>
                  </div>
                </div>

                <!-- Recent Activity -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div class="space-y-4">
                    <div v-for="blog in recentBlogs" :key="blog.id" class="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span class="text-blue-600">📝</span>
                      </div>
                      <div class="flex-1">
                        <div class="font-medium text-gray-900 truncate">{{ blog.title }}</div>
                        <div class="text-xs text-gray-500">{{ formatDate(blog.created_at) }}</div>
                      </div>
                      <div class="text-sm text-gray-600">{{ blog.content?.length || 0 }} blocks</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="message" class="fixed bottom-4 right-4 z-50">
      <div :class="[
        'p-4 rounded-lg shadow-lg max-w-sm border-l-4',
        message.type === 'success' 
          ? 'bg-green-50 border-green-400 text-green-800' 
          : 'bg-red-50 border-red-400 text-red-800'
      ]">
        <div class="flex">
          <div class="flex-shrink-0">
            <span class="text-xl">{{ message.type === 'success' ? '✅' : '❌' }}</span>
          </div>
          <div class="ml-3">
            <p class="font-medium">{{ message.title }}</p>
            <p class="text-sm mt-1">{{ message.text }}</p>
          </div>
          <button @click="message = null" class="ml-auto pl-3">
            <span class="sr-only">Close</span>
            <span class="text-gray-400 hover:text-gray-600">✕</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blogStore'
import { useAuthStore } from '@/stores/authStore'
import AdminEditor from '@/components/AdminEditor.vue'

const router = useRouter()
const store = useBlogStore()
const authStore = useAuthStore()

const activeTab = ref('create')
const message = ref(null)

// New blog form
const newBlog = ref({
  title: '',
  thumbnail: '',
  content: []
})

// Form validation
const isFormValid = computed(() => {
  return newBlog.value.title.trim() !== '' && 
         newBlog.value.thumbnail.trim() !== '' && 
         newBlog.value.content.length > 0
})

// Fetch blogs
const fetchBlogs = () => {
  store.fetchBlogs()
}

onMounted(() => {
  authStore.checkAuth()
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
  fetchBlogs()
})

// Create new blog
const createBlog = async () => {
  if (!isFormValid.value) return

  const result = await store.createBlog({
    title: newBlog.value.title,
    thumbnail: newBlog.value.thumbnail,
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
  const blog = store.blogs.find(b => b.id === id)
  if (!blog) return

  if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
    const result = await store.deleteBlog(id)
    
    if (result.success) {
      showMessage('success', 'Blog Deleted', 'The blog has been deleted successfully.')
    } else {
      showMessage('error', 'Failed to Delete', result.error || 'Something went wrong.')
    }
  }
}

// Edit blog (placeholder)
const editBlog = (id) => {
  showMessage('info', 'Edit Feature', 'Edit functionality would be implemented in the full version.')
}

// Logout
const logout = () => {
  authStore.logout()
  router.push('/login')
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

// Format block type for display
const formatBlockType = (type) => {
  const types = {
    'paragraph': 'Paragraph',
    'heading': 'Heading',
    'subheading': 'Subheading',
    'bullet-list': 'Bullet List',
    'number-list': 'Number List',
    'image': 'Image',
    'video': 'Video',
    'audio': 'Audio',
    'file': 'File',
    'row-layout': 'Row Layout',
    'nested-layout': 'Nested Layout'
  }
  return types[type] || type
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
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

// Block type distribution
const blockTypeDistribution = computed(() => {
  const distribution = {}
  
  store.blogs.forEach(blog => {
    if (blog.content && Array.isArray(blog.content)) {
      blog.content.forEach(block => {
        distribution[block.type] = (distribution[block.type] || 0) + 1
      })
    }
  })
  
  return distribution
})

// Get percentage
const getPercentage = (count, total) => {
  if (total === 0) return 0
  return Math.round((count / total) * 100)
}

// Recent blogs
const recentBlogs = computed(() => {
  return [...store.blogs]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
})
</script>            
          
