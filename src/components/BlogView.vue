<template>
  <div class="blog-view">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading article...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20">
      <div class="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <div class="space-x-4">
        <button 
          @click="$emit('retry')"
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
    <div v-else-if="blog" class="max-w-4xl mx-auto px-4">
      <!-- Navigation -->
      <div class="mb-8">
        <router-link 
          to="/"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to All Articles
        </router-link>
      </div>

      <!-- Thumbnail -->
      <div v-if="blog.thumbnail" class="mb-8 rounded-2xl overflow-hidden shadow-xl">
        <img 
          :src="blog.thumbnail" 
          :alt="blog.title"
          class="w-full h-64 md:h-96 object-cover"
        />
      </div>

      <!-- Header -->
      <header class="mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {{ blog.title }}
        </h1>
        
        <!-- Metadata -->
        <div class="flex flex-wrap items-center text-gray-600 gap-4 mb-8 pb-8 border-b">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ formatDate(blog.created_at) }}</span>
          </div>
          
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ estimateReadTime(blog) }} min read</span>
          </div>
          
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            <span>{{ blog.content?.length || 0 }} content blocks</span>
          </div>
        </div>
      </header>

      <!-- Content Blocks -->
      <article class="prose prose-lg max-w-none mb-16">
        <div class="space-y-8">
          <div 
            v-for="(block, index) in blog.content" 
            :key="index"
            class="block-renderer"
          >
            <!-- Paragraph -->
            <p v-if="block.type === 'paragraph'" class="text-gray-800 leading-relaxed text-lg">
              {{ block.content }}
            </p>

            <!-- Heading -->
            <h2 v-else-if="block.type === 'heading'" class="text-3xl font-bold text-gray-900 mt-10 mb-6 border-l-4 border-blue-500 pl-4">
              {{ block.content }}
            </h2>

            <!-- Subheading -->
            <h3 v-else-if="block.type === 'subheading'" class="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              {{ block.content }}
            </h3>

            <!-- Bullet List -->
            <div v-else-if="block.type === 'bullet-list' && block.items" class="mt-6 mb-6">
              <ul class="space-y-3">
                <li v-for="(item, itemIndex) in block.items" :key="itemIndex" class="flex">
                  <span class="text-blue-500 mr-3">•</span>
                  <span class="text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>

            <!-- Number List -->
            <div v-else-if="block.type === 'number-list' && block.items" class="mt-6 mb-6">
              <ol class="space-y-3 list-decimal pl-5">
                <li v-for="(item, itemIndex) in block.items" :key="itemIndex" class="pl-2">
                  <span class="text-gray-700">{{ item }}</span>
                </li>
              </ol>
            </div>

            <!-- Image -->
            <div v-else-if="block.type === 'image' && block.content" class="my-8">
              <div class="rounded-xl overflow-hidden shadow-lg">
                <img 
                  :src="block.content" 
                  :alt="block.alt || 'Blog image'"
                  class="w-full h-auto"
                />
                <div v-if="block.caption" class="bg-gray-50 p-4 text-center">
                  <p class="text-gray-600 italic">{{ block.caption }}</p>
                </div>
              </div>
            </div>

            <!-- Video -->
            <div v-else-if="block.type === 'video' && block.content" class="my-8">
              <div class="rounded-xl overflow-hidden shadow-lg bg-black">
                <!-- YouTube Embed -->
                <div v-if="isYouTubeUrl(block.content)" class="aspect-video">
                  <iframe 
                    :src="'https://www.youtube.com/embed/' + getYouTubeId(block.content)"
                    class="w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
                
                <!-- Generic Video -->
                <div v-else class="aspect-video flex items-center justify-center">
                  <video 
                    :src="block.content" 
                    controls
                    class="max-w-full max-h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            <!-- Audio -->
            <div v-else-if="block.type === 'audio' && block.content" class="my-8">
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span class="text-blue-600 text-2xl">♪</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-gray-900">{{ block.title || 'Audio Content' }}</h4>
                    <p class="text-gray-600 text-sm">{{ block.artist || 'Listen now' }}</p>
                  </div>
                </div>
                <audio 
                  :src="block.content" 
                  controls
                  class="w-full"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>

            <!-- File Attachment -->
            <div v-else-if="block.type === 'file' && block.content" class="my-8">
              <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span class="text-blue-600 text-xl">📎</span>
                    </div>
                    <div>
                      <h4 class="font-bold text-gray-900">{{ block.title || 'Download File' }}</h4>
                      <p class="text-gray-600 text-sm">{{ block.size || 'Click to download' }}</p>
                    </div>
                  </div>
                  <a 
                    :href="block.content" 
                    target="_blank"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>

            <!-- Row Layout (Complex Structure) -->
            <div v-else-if="block.type === 'row-layout' && block.columns" class="my-10">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-{{ block.columns.length }} gap-6">
                <div 
                  v-for="(column, colIndex) in block.columns" 
                  :key="colIndex"
                  class="column-renderer space-y-6"
                >
                  <div 
                    v-for="(colBlock, colBlockIndex) in column.blocks" 
                    :key="colBlockIndex"
                    class="p-6 bg-gray-50 rounded-xl"
                  >
                    <!-- Recursively render nested blocks -->
                    <div v-if="colBlock.type === 'paragraph'" class="text-gray-700">
                      {{ colBlock.content }}
                    </div>
                    
                    <div v-else-if="colBlock.type === 'heading'" class="text-xl font-bold text-gray-900 mb-3">
                      {{ colBlock.content }}
                    </div>
                    
                    <div v-else-if="colBlock.type === 'image' && colBlock.content" class="rounded-lg overflow-hidden">
                      <img :src="colBlock.content" :alt="colBlock.alt || 'Column image'" class="w-full h-48 object-cover">
                    </div>
                    
                    <div v-else-if="colBlock.type === 'bullet-list' && colBlock.items" class="pl-4">
                      <ul class="list-disc text-gray-700">
                        <li v-for="(item, i) in colBlock.items" :key="i">{{ item }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nested Layout -->
            <div v-else-if="block.type === 'nested-layout' && block.blocks" class="my-8 pl-6 border-l-4 border-purple-300">
              <div class="space-y-4">
                <div 
                  v-for="(nestedBlock, nestedIndex) in block.blocks" 
                  :key="nestedIndex"
                  class="p-4 bg-purple-50 rounded-lg"
                >
                  <div v-if="nestedBlock.type === 'paragraph'" class="text-gray-700">
                    {{ nestedBlock.content }}
                  </div>
                  
                  <div v-else-if="nestedBlock.type === 'heading'" class="font-bold text-purple-900">
                    {{ nestedBlock.content }}
                  </div>
                  
                  <div v-else-if="nestedBlock.type === 'image' && nestedBlock.content" class="rounded overflow-hidden">
                    <img :src="nestedBlock.content" alt="Nested image" class="w-full h-32 object-cover">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Footer -->
      <footer class="mt-16 pt-8 border-t">
        <div class="flex justify-between items-center">
          <router-link 
            to="/"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ← Back to All Articles
          </router-link>
          
          <div class="text-sm text-gray-500">
            Published on {{ formatDateFull(blog.created_at) }}
          </div>
        </div>
      </footer>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-20">
      <div class="text-gray-400 text-6xl mb-4">🔍</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
      <p class="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
      <router-link 
        to="/"
        class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Browse All Articles
      </router-link>
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
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDateFull = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
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

// Check if URL is YouTube
const isYouTubeUrl = (url) => {
  return /youtube\.com|youtu\.be/i.test(url)
}

// Extract YouTube ID
const getYouTubeId = (url) => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : ''
}
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose p {
  margin-top: 1.5em;
  margin-bottom: 1.5em;
}

.prose h2 {
  margin-top: 2.5em;
  margin-bottom: 1em;
}

.prose h3 {
  margin-top: 2em;
  margin-bottom: 0.75em;
}
</style>
