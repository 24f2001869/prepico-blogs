<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>
    
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">Create New Blog</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Title</label>
          <input 
            v-model="title"
            type="text"
            class="w-full p-2 border rounded"
            placeholder="Blog title"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Content</label>
          <textarea 
            v-model="content"
            class="w-full p-2 border rounded h-40"
            placeholder="Blog content..."
          ></textarea>
        </div>
        
        <button 
          @click="createBlog"
          :disabled="!title || !content || loading"
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {{ loading ? 'Creating...' : 'Publish Blog' }}
        </button>
      </div>
      
      <!-- Success message -->
      <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-800 rounded">
        Blog created successfully!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../services/supabase'

const title = ref('')
const content = ref('')
const loading = ref(false)
const success = ref(false)

const createBlog = async () => {
  if (!title.value || !content.value) return
  
  loading.value = true
  success.value = false
  
  try {
    const { data, error } = await supabase
      .from('blogs')
      .insert([{
        title: title.value,
        content: [{ type: 'paragraph', content: content.value }],
        created_at: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    
    // Reset form
    title.value = ''
    content.value = ''
    success.value = true
    
    setTimeout(() => {
      success.value = false
    }, 3000)
    
  } catch (err) {
    console.error('Error creating blog:', err)
    alert('Failed to create blog')
  } finally {
    loading.value = false
  }
}
</script>
