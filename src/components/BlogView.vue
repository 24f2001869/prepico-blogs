<template>
  <div class="blog-view">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading blog...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <p class="text-red-600 font-medium">Error loading blog</p>
      <p class="text-red-500 mt-1">{{ error }}</p>
      <button @click="$emit('retry')" class="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
        Try Again
      </button>
    </div>

    <!-- Blog Content -->
    <div v-else-if="blog" class="max-w-4xl mx-auto">
      <!-- Thumbnail -->
      <div v-if="blog.thumbnail" class="mb-8 rounded-xl overflow-hidden">
        <img 
          :src="blog.thumbnail" 
          :alt="blog.title"
          class="w-full h-64 md:h-96 object-cover"
        />
      </div>

      <!-- Title -->
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {{ blog.title }}
      </h1>

      <!-- Metadata -->
      <div class="flex items-center text-gray-600 mb-8 pb-6 border-b">
        <span class="flex items-center">
          <span class="mr-2">📅</span>
          <span>{{ formatDate(blog.created_at) }}</span>
        </span>
        <span class="mx-4">•</span>
        <span class="flex items-center">
          <span class="mr-2">🧩</span>
          <span>{{ blog.content?.length || 0 }} content blocks</span>
        </span>
      </div>

      <!-- Blocks -->
      <div class="space-y-8">
        <div 
          v-for="(block, index) in blog.content" 
          :key="index"
          class="block-content"
        >
          <!-- Paragraph -->
          <p v-if="block.type === 'paragraph'" class="text-lg leading-relaxed text-gray-800">
            {{ block.content }}
          </p>

          <!-- Heading -->
          <h2 v-else-if="block.type === 'heading'" class="text-2xl font-bold text-gray-900 mt-8 mb-4">
            {{ block.content }}
          </h2>

          <!-- Image -->
          <div v-else-if="block.type === 'image'" class="my-6">
            <img 
              :src="block.content" 
              alt="Blog image"
              class="rounded-lg shadow-md max-w-full h-auto mx-auto"
            />
          </div>

          <!-- Video -->
          <div v-else-if="block.type === 'video'" class="my-6">
            <div class="aspect-video rounded-lg overflow-hidden">
              <iframe 
                v-if="extractYouTubeId(block.content)"
                :src="'https://www.youtube.com/embed/' + extractYouTubeId(block.content)"
                class="w-full h-full"
                frameborder="0"
                allowfullscreen
              ></iframe>
              <video v-else :src="block.content" controls class="w-full h-full"></video>
            </div>
          </div>

          <!-- Quote -->
          <div v-else-if="block.type === 'quote'" class="my-8 pl-6 border-l-4 border-blue-500">
            <p class="text-xl italic text-gray-700">
              "{{ block.content }}"
            </p>
          </div>

          <!-- Row Layout -->
          <div v-else-if="block.type === 'row'" class="my-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="(col, colIndex) in block.columns" 
                :key="colIndex"
                class="space-y-4"
              >
                <div 
                  v-for="(subBlock, subIndex) in col.blocks" 
                  :key="subIndex"
                  class="p-4 bg-gray-50 rounded-lg"
                >
                  <!-- Render sub-blocks recursively -->
                  <div v-if="subBlock.type === 'paragraph'" class="text-gray-700">
                    {{ subBlock.content }}
                  </div>
                  <div v-else-if="subBlock.type === 'heading'" class="font-bold text-gray-900">
                    {{ subBlock.content }}
                  </div>
                  <img 
                    v-else-if="subBlock.type === 'image'" 
                    :src="subBlock.content" 
                    alt=""
                    class="rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-12 pt-8 border-t">
        <button 
          @click="$router.back()"
          class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          ← Back to Blogs
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  blog: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['retry'])

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Extract YouTube ID
const extractYouTubeId = (url) => {
  if (!url) return ''
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : ''
}
</script>

<style scoped>
.blog-view {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.block-content > *:first-child {
  margin-top: 0;
}
</style>
