<template>
  <div class="editor-container">
    <!-- Toolbar -->
    <div class="flex flex-wrap gap-2 mb-4 p-3 bg-gray-100 rounded-lg">
      <button @click="addBlock('paragraph')" class="px-3 py-1 bg-white border rounded hover:bg-gray-50">
        📝 Paragraph
      </button>
      <button @click="addBlock('heading')" class="px-3 py-1 bg-white border rounded hover:bg-gray-50">
        🏷️ Heading
      </button>
      <button @click="addBlock('image')" class="px-3 py-1 bg-white border rounded hover:bg-gray-50">
        🖼️ Image
      </button>
      <button @click="addBlock('video')" class="px-3 py-1 bg-white border rounded hover:bg-gray-50">
        🎥 Video
      </button>
      <button @click="addBlock('quote')" class="px-3 py-1 bg-white border rounded hover:bg-gray-50">
        💬 Quote
      </button>
      <button @click="addRowLayout" class="px-3 py-1 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200">
        ↔️ Row Layout
      </button>
      <button @click="moveUp" class="px-3 py-1 bg-gray-200 border rounded hover:bg-gray-300" :disabled="selectedIndex <= 0">
        ⬆️ Up
      </button>
      <button @click="moveDown" class="px-3 py-1 bg-gray-200 border rounded hover:bg-gray-300" :disabled="selectedIndex >= blocks.length - 1">
        ⬇️ Down
      </button>
      <button @click="removeBlock" class="px-3 py-1 bg-red-100 border border-red-300 rounded hover:bg-red-200" :disabled="selectedIndex === -1">
        🗑️ Delete
      </button>
    </div>

    <!-- Block List -->
    <div class="space-y-4">
      <div 
        v-for="(block, index) in blocks" 
        :key="index"
        @click="selectBlock(index)"
        :class="[
          'block-item p-4 border-2 rounded-lg cursor-pointer transition-all',
          selectedIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
        ]"
      >
        <!-- Paragraph Block -->
        <div v-if="block.type === 'paragraph'" class="flex items-start gap-3">
          <div class="mt-1 text-gray-400">📝</div>
          <textarea 
            v-model="block.content"
            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Enter paragraph text..."
            rows="3"
            @click.stop
          />
        </div>

        <!-- Heading Block -->
        <div v-else-if="block.type === 'heading'" class="flex items-start gap-3">
          <div class="mt-1 text-gray-400">🏷️</div>
          <input 
            type="text"
            v-model="block.content"
            class="w-full p-2 text-2xl font-bold border-b-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter heading..."
            @click.stop
          />
        </div>

        <!-- Image Block -->
        <div v-else-if="block.type === 'image'" class="flex items-start gap-3">
          <div class="mt-1 text-gray-400">🖼️</div>
          <div class="w-full">
            <input 
              type="url"
              v-model="block.content"
              class="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter image URL..."
              @click.stop
            />
            <div v-if="block.content" class="mt-2">
              <img :src="block.content" alt="Preview" class="max-w-full h-auto rounded border" />
            </div>
          </div>
        </div>

        <!-- Video Block -->
        <div v-else-if="block.type === 'video'" class="flex items-start gap-3">
          <div class="mt-1 text-gray-400">🎥</div>
          <div class="w-full">
            <input 
              type="url"
              v-model="block.content"
              class="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter video URL (YouTube, Vimeo, etc.)..."
              @click.stop
            />
            <div v-if="block.content && block.content.includes('youtube')" class="mt-2">
              <iframe 
                :src="'https://www.youtube.com/embed/' + extractYouTubeId(block.content)"
                class="w-full aspect-video rounded border"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>

        <!-- Quote Block -->
        <div v-else-if="block.type === 'quote'" class="flex items-start gap-3">
          <div class="mt-1 text-gray-400">💬</div>
          <div class="w-full">
            <textarea 
              v-model="block.content"
              class="w-full p-4 italic text-lg border-l-4 border-blue-500 bg-gray-50 rounded-r focus:outline-none"
              placeholder="Enter quote..."
              rows="2"
              @click.stop
            />
          </div>
        </div>

        <!-- Row Layout Block -->
        <div v-else-if="block.type === 'row'" class="space-y-3">
          <div class="flex items-center gap-2 text-gray-600">
            <span>↔️</span>
            <span class="font-medium">Row Layout (2 columns)</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="(col, colIndex) in block.columns" 
              :key="colIndex"
              class="p-3 border-2 border-dashed border-gray-300 rounded min-h-[100px]"
            >
              <div class="text-sm text-gray-500 mb-2">Column {{ colIndex + 1 }}</div>
              <div v-if="col.blocks && col.blocks.length > 0">
                <div 
                  v-for="(subBlock, subIndex) in col.blocks" 
                  :key="subIndex"
                  class="mb-2 p-2 bg-gray-50 rounded border"
                >
                  <div class="text-xs text-gray-400">{{ subBlock.type }}</div>
                  <div class="truncate">{{ subBlock.content || 'Empty' }}</div>
                </div>
              </div>
              <div v-else class="text-gray-400 italic">Click to add content...</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add First Block Button -->
    <div v-if="blocks.length === 0" class="text-center py-8">
      <button @click="addBlock('paragraph')" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        + Add Your First Content Block
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const blocks = ref(props.modelValue || [])
const selectedIndex = ref(-1)

// Watch for changes and emit to parent
const updateBlocks = () => {
  emit('update:modelValue', blocks.value)
}

// Add different types of blocks
const addBlock = (type) => {
  const newBlock = {
    type,
    content: '',
    id: Date.now() + Math.random()
  }

  // Special handling for row layout
  if (type === 'row') {
    newBlock.columns = [
      { blocks: [] },
      { blocks: [] }
    ]
  }

  if (selectedIndex.value === -1) {
    blocks.value.push(newBlock)
  } else {
    blocks.value.splice(selectedIndex.value + 1, 0, newBlock)
  }
  
  selectedIndex.value = blocks.value.length - 1
  updateBlocks()
}

const addRowLayout = () => {
  addBlock('row')
}

// Select block
const selectBlock = (index) => {
  selectedIndex.value = index
}

// Move block up
const moveUp = () => {
  if (selectedIndex.value > 0) {
    const block = blocks.value[selectedIndex.value]
    blocks.value.splice(selectedIndex.value, 1)
    blocks.value.splice(selectedIndex.value - 1, 0, block)
    selectedIndex.value--
    updateBlocks()
  }
}

// Move block down
const moveDown = () => {
  if (selectedIndex.value < blocks.value.length - 1) {
    const block = blocks.value[selectedIndex.value]
    blocks.value.splice(selectedIndex.value, 1)
    blocks.value.splice(selectedIndex.value + 1, 0, block)
    selectedIndex.value++
    updateBlocks()
  }
}

// Remove block
const removeBlock = () => {
  if (selectedIndex.value !== -1) {
    blocks.value.splice(selectedIndex.value, 1)
    selectedIndex.value = -1
    updateBlocks()
  }
}

// Extract YouTube ID from URL
const extractYouTubeId = (url) => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : ''
}

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  blocks.value = newVal || []
}, { deep: true })
</script>

<style scoped>
.block-item:hover {
  @apply border-gray-300;
}
</style>
