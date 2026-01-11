<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Prepico Blogs</h1>
    
    <!-- Show loading or blogs -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading blogs...</p>
    </div>
    
    <div v-else-if="blogs.length === 0" class="text-center py-8">
      <p class="text-gray-600 mb-4">No blogs yet. Create your first blog!</p>
      <router-link 
        to="/admin" 
        class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go to Admin
      </router-link>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="blog in blogs" 
        :key="blog.id"
        class="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer"
        @click="$router.push(`/blog/${blog.id}`)"
      >
        <h2 class="text-xl font-bold mb-2">{{ blog.title }}</h2>
        <p class="text-gray-600 text-sm mb-4">
          {{ new Date(blog.created_at).toLocaleDateString() }}
        </p>
        <div class="text-blue-600 hover:text-blue-800">
          Read more →
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../services/supabase'

const blogs = ref([])
const loading = ref(true)

const fetchBlogs = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    blogs.value = data || []
  } catch (err) {
    console.error('Error fetching blogs:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBlogs()
})
</script>
