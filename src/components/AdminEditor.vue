<template>
  <div class="editor-container">
    <!-- Toolbar -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <div class="flex flex-wrap gap-2">
        <!-- Text Blocks -->
        <div class="flex items-center space-x-1 mr-4">
          <span class="text-xs text-gray-500 font-medium">TEXT:</span>
          <button @click="addBlock('paragraph')" class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
            📝 Paragraph
          </button>
          <button @click="addBlock('heading')" class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
            🏷️ Heading
          </button>
          <button @click="addBlock('subheading')" class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
            📌 Subheading
          </button>
        </div>

        <!-- Lists -->
        <div class="flex items-center space-x-1 mr-4">
          <span class="text-xs text-gray-500 font-medium">LISTS:</span>
          <button @click="addBlock('bullet-list')" class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
            • Bullet List
          </button>
          <button @click="addBlock('number-list')" class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
            1. Number List
          </button>
        </div>

        <!-- Media -->
        <div class="flex items-center space-x-1 mr-4">
          <span class="text-xs text-gray-500 font-medium">MEDIA:</span>
          <button @click="addBlock('image')" class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
            🖼️ Image
          </button>
          <button @click="addBlock('video')" class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
            🎥 Video
          </button>
          <button @click="addBlock('audio')" class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
            🔊 Audio
          </button>
          <button @click="addBlock('file')" class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
            📎 File
          </button>
        </div>

        <!-- Layout -->
        <div class="flex items-center space-x-1">
          <span class="text-xs text-gray-500 font-medium">LAYOUT:</span>
          <button @click="addRowLayout" class="px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-700 rounded hover:bg-blue-100 text-sm">
            ↔️ Row Layout
          </button>
          <button @click="addNestedLayout" class="px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-700 rounded hover:bg-blue-100 text-sm">
            ⬇️ Nested Layout
          </button>
        </div>
      </div>

      <!-- Block Controls -->
      <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
        <button @click="moveUp" :disabled="selectedIndex <= 0" 
          class="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          ⬆️ Move Up
        </button>
        <button @click="moveDown" :disabled="selectedIndex >= blocks.length - 1"
          class="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          ⬇️ Move Down
        </button>
        <button @click="duplicateBlock" :disabled="selectedIndex === -1"
          class="px-3 py-1.5 bg-green-50 border border-green-300 text-green-700 rounded hover:bg-green-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          📋 Duplicate
        </button>
        <button @click="removeBlock" :disabled="selectedIndex === -1"
          class="px-3 py-1.5 bg-red-50 border border-red-300 text-red-700 rounded hover:bg-red-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          🗑️ Delete
        </button>
      </div>
    </div>

    <!-- Block List -->
    <div class="space-y-4">
      <div 
        v-for="(block, index) in blocks" 
        :key="block.id"
        @click="selectBlock(index)"
        :class="[
          'block-item p-4 border-2 rounded-lg cursor-pointer transition-all',
          selectedIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
        ]"
      >
        <!-- Block Header -->
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-700">
              {{ formatBlockType(block.type) }}
            </span>
            <span v-if="block.type.includes('layout')" class="text-xs text-gray-500">
              {{ block.columns?.length || 0 }} columns
            </span>
          </div>
          <span class="text-xs text-gray-400">#{{ index + 1 }}</span>
        </div>

        <!-- Block Content -->
        <div class="block-content">
          <!-- Paragraph -->
          <div v-if="block.type === 'paragraph'" class="flex items-start gap-3">
            <div class="mt-1 text-gray-400 text-lg">📝</div>
            <textarea 
              v-model="block.content"
              placeholder="Enter paragraph text..."
              class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              rows="3"
              @click.stop
            />
          </div>

          <!-- Heading -->
          <div v-else-if="block.type === 'heading'" class="flex items-start gap-3">
            <div class="mt-1 text-gray-400 text-lg">🏷️</div>
            <input 
              type="text"
              v-model="block.content"
              placeholder="Enter main heading..."
              class="w-full p-3 text-2xl font-bold border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              @click.stop
            />
          </div>

          <!-- Subheading -->
          <div v-else-if="block.type === 'subheading'" class="flex items-start gap-3">
            <div class="mt-1 text-gray-400 text-lg">📌</div>
            <input 
              type="text"
              v-model="block.content"
              placeholder="Enter subheading..."
              class="w-full p-2 text-xl font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500"
              @click.stop
            />
          </div>

          <!-- Bullet List -->
          <div v-else-if="block.type === 'bullet-list'" class="flex items-start gap-3">
            <div class="mt-1 text-gray-400 text-lg">•</div>
            <div class="w-full">
              <div v-for="(item, itemIndex) in block.items" :key="itemIndex" class="flex items-center gap-2 mb-2">
                <span class="text-gray-500">•</span>
                <input 
                  type="text"
                  v-model="block.items[itemIndex]"
                  :placeholder="`List item ${itemIndex + 1}`"
                  class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  @click.stop
                />
                <button 
                  @click.stop="removeListItem(block, itemIndex)"
                  class="p-1 text-red-500 hover:text-red-700"
                  v-if="block.items.length > 1"
                >
                  ✕
                </button>
              </div>
              <button 
                @click.stop="addListItem(block)"
                class="mt-2 px-3 py-1 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                + Add Item
              </button>
            </div>
          </div>

          <!-- Number List -->
          <div v-else-if="block.type === 'number-list'" class="flex items-start gap-3">
            <div class="mt-1 text-gray-400 text-lg">1.</div>
            <div class="w-full">
              <div v-for="(item, itemIndex) in block.items" :key="itemIndex" class="flex items-center gap-2 mb-2">
                <span class="text-gray-500 w-6">{{ itemIndex + 1 }}.</span>
                <input 
                  type="text"
                  v-model="block.items[itemIndex]"
                  :placeholder="`List item ${itemIndex + 1}`"
                  class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  @click.stop
                />
                <button 
                  @click.stop="removeListItem(block, itemIndex)"
                  class="p-1 text-red-500 hover:text-red-700"
                  v-if="block.items.length > 1"
                >
                  ✕
                </button>
              </div>
              <button 
                @click.stop="addListItem(block)"
                class="mt-2 px-3 py-1 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                + Add Item
              </button>
            </div>
          </div>

          <!-- Image -->
          <div v-else-if="block.type === 'image'" class="flex items-start gap-3">
            <div class="mt-1 text-gray-400 text-lg">🖼️</div>
            <div class="w-full">
              <input 
                type="url"
                v-model="block.content"
                placeholder="https://example.com/image.jpg"
                class="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                @click.stop
              />
              <div class="flex items-center gap-4">
                <input 
                  type="text"
                  v-model="block.alt"
                  placeholder="Image description (alt text)"
                  class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  @click.stop
                />
                <input 
                  type="text"
                  v-model="block.caption"
                  placeholder="Caption (optional)"
                  class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  @click.stop
                />
              </div>
              <div v-if="block.content && isValidImage(block.content)" class="mt-3">
                <img :src="block.content" :alt="block.alt || 'Image'" class="max-w-full h-auto max-h-64 rounded-lg border" />
                <p v-if="block.caption" class="text-sm text-gray-600 mt-2 text-center italic">{{ block.caption }}</p>
              </div>
            </div>
          </div>

          <!-- Video -->
          <div v-else-if="block.type === 'video'" class="flex items-start gap-3">
            <div class="mt-1 text-gray-400 text-lg">🎥</div>
            <div class="w-full">
              <input 
                type="url"
                v-model="block.content"
                placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
                class="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                @click.stop
              />
              <div v-if="block.content">
                <div v-if="isYouTubeUrl(block.content)" class="mt-2">
                  <div class="aspect-video bg-gray-100 rounded-lg border flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-4xl mb-2">▶️</div>
                      <p class="text-sm text-gray-600">YouTube: {{ getYouTubeId(block.content) }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="mt-2">
                  <div class="aspect-video bg-gray-100 rounded-lg border flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-4xl mb-2">🎬</div>
                      <p class="text-sm text-gray-600">Video URL added</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Audio -->
          <div v-else-if="block.type === 'audio'" class="flex items-start gap-3">
            <div class="mt-1 text-gray-400 text-lg">🔊</div>
            <div class="w-full">
              <input 
                type="url"
                v-model="block.content"
                placeholder="https://example.com/audio.mp3"
                class="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                @click.stop
              />
              <div class="flex items-center gap-4">
                <input 
                  type="text"
                  v-model="block.title"
                  placeholder="Audio title"
                  class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  @click.stop
                />
                <input 
                  type="text"
                  v-model="block.artist"
                  placeholder="Artist (optional)"
                  class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  @click.stop
                />
              </div>
              <div v-if="block.content" class="mt-3">
                <div class="bg-gray-50 p-4 rounded-lg border">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span class="text-blue-600 text-xl">♪</span>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium">{{ block.title || 'Audio File' }}</p>
                      <p class="text-sm text-gray-600">{{ block.artist || 'Unknown Artist' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- File -->
          <div v-else-if="block.type === 'file'" class="flex items-start gap-3">
            <div class="mt-1 text-gray-400 text-lg">📎</div>
            <div class="w-full">
              <input 
                type="url"
                v-model="block.content"
                placeholder="https://example.com/document.pdf"
                class="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                @click.stop
              />
              <div class="flex items-center gap-4">
                <input 
                  type="text"
                  v-model="block.title"
                  placeholder="File title"
                  class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  @click.stop
                />
                <input 
                  type="text"
                  v-model="block.size"
                  placeholder="File size (e.g., 2.4 MB)"
                  class="w-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  @click.stop
                />
              </div>
              <div v-if="block.content" class="mt-3">
                <div class="bg-gray-50 p-4 rounded-lg border flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span class="text-blue-600">📄</span>
                    </div>
                    <div>
                      <p class="font-medium">{{ block.title || 'Download File' }}</p>
                      <p class="text-sm text-gray-600">{{ block.size || 'Unknown size' }}</p>
                    </div>
                  </div>
                  <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Row Layout (2 columns) -->
          <div v-else-if="block.type === 'row-layout'" class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-blue-600">
                <span>↔️</span>
                <span class="font-medium">Two Column Layout</span>
              </div>
              <div class="flex gap-2">
                <button 
                  @click.stop="addColumn(block)"
                  class="px-3 py-1 text-sm bg-green-100 border border-green-300 text-green-700 rounded hover:bg-green-200"
                  :disabled="block.columns.length >= 4"
                >
                  + Column
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-{{ block.columns.length }} gap-4">
              <div 
                v-for="(column, colIndex) in block.columns" 
                :key="colIndex"
                class="column-container p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[150px]"
                @click.stop="selectColumn(block, colIndex)"
                :class="{ 'border-blue-400 bg-blue-50': selectedColumn?.blockId === block.id && selectedColumn?.colIndex === colIndex }"
              >
                <div class="flex justify-between items-center mb-3">
                  <span class="text-sm font-medium text-gray-700">Column {{ colIndex + 1 }}</span>
                  <button 
                    @click.stop="removeColumn(block, colIndex)"
                    class="text-red-500 hover:text-red-700 text-sm"
                    :disabled="block.columns.length <= 2"
                  >
                    Remove
                  </button>
                </div>
                
                <!-- Column blocks -->
                <div class="space-y-3">
                  <div 
                    v-for="(colBlock, colBlockIndex) in column.blocks" 
                    :key="colBlock.id"
                    class="p-3 bg-white border border-gray-200 rounded"
                    @click.stop="selectColumnBlock(block, colIndex, colBlockIndex)"
                  >
                    <div class="text-xs text-gray-500 mb-1">{{ formatBlockType(colBlock.type) }}</div>
                    <div class="truncate text-sm">
                      {{ getBlockPreview(colBlock) }}
                    </div>
                  </div>
                  
                  <button 
                    @click.stop="addBlockToColumn(block, colIndex)"
                    class="w-full p-2 border border-dashed border-gray-300 rounded text-gray-500 hover:text-gray-700 hover:border-gray-400 text-sm"
                  >
                    + Add to Column
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Nested Layout -->
          <div v-else-if="block.type === 'nested-layout'" class="space-y-4">
            <div class="flex items-center gap-2 text-purple-600">
              <span>⬇️</span>
              <span class="font-medium">Nested Layout</span>
            </div>
            
            <div class="border-l-4 border-purple-300 pl-4">
              <div 
                v-for="(nestedBlock, nestedIndex) in block.blocks" 
                :key="nestedBlock.id"
                class="mb-3 ml-4 p-3 border border-gray-200 rounded bg-gray-50"
              >
                <div class="text-xs text-gray-500 mb-1">{{ formatBlockType(nestedBlock.type) }}</div>
                <div class="text-sm">
                  {{ getBlockPreview(nestedBlock) }}
                </div>
              </div>
                        <button 
                @click.stop="addNestedBlock(block)"
                class="ml-4 px-3 py-1 text-sm bg-purple-100 border border-purple-300 text-purple-700 rounded hover:bg-purple-200"
              >
                + Add Nested Block
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="blocks.length === 0" class="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
      <div class="text-gray-400 text-5xl mb-4">📝</div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">Start Building Your Blog</h3>
      <p class="text-gray-500 mb-6">Add your first content block using the toolbar above</p>
      <button @click="addBlock('paragraph')" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        + Add Paragraph Block
      </button>
    </div>

    <!-- Column Block Modal (simplified) -->
    <div v-if="showColumnModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">Add Block to Column</h3>
        <div class="grid grid-cols-2 gap-2">
          <button @click="addColumnBlock('paragraph')" class="p-3 border rounded hover:bg-gray-50">
            Paragraph
          </button>
          <button @click="addColumnBlock('image')" class="p-3 border rounded hover:bg-gray-50">
            Image
          </button>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="showColumnModal = false" class="px-4 py-2 border rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const blocks = ref(props.modelValue || [])
const selectedIndex = ref(-1)
const selectedColumn = ref(null)
const showColumnModal = ref(false)
const modalTarget = ref({ blockId: null, colIndex: null })

// Generate unique ID for blocks
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Add different types of blocks
const addBlock = (type) => {
  const baseBlock = {
    id: generateId(),
    type,
    content: ''
  }

  switch (type) {
    case 'paragraph':
    case 'heading':
    case 'subheading':
      baseBlock.content = ''
      break
      
    case 'bullet-list':
    case 'number-list':
      baseBlock.items = ['First item']
      break
      
    case 'image':
      baseBlock.content = ''
      baseBlock.alt = ''
      baseBlock.caption = ''
      break
      
    case 'video':
      baseBlock.content = ''
      break
      
    case 'audio':
      baseBlock.content = ''
      baseBlock.title = ''
      baseBlock.artist = ''
      break
      
    case 'file':
      baseBlock.content = ''
      baseBlock.title = ''
      baseBlock.size = ''
      break
      
    case 'row-layout':
      baseBlock.columns = [
        { id: generateId(), blocks: [] },
        { id: generateId(), blocks: [] }
      ]
      break
      
    case 'nested-layout':
      baseBlock.blocks = []
      break
  }

  if (selectedIndex.value === -1) {
    blocks.value.push(baseBlock)
  } else {
    blocks.value.splice(selectedIndex.value + 1, 0, baseBlock)
  }
  
  selectedIndex.value = blocks.value.length - 1
  updateBlocks()
}

const addRowLayout = () => {
  addBlock('row-layout')
}

const addNestedLayout = () => {
  addBlock('nested-layout')
}

// List operations
const addListItem = (block) => {
  if (!block.items) block.items = []
  block.items.push('New item')
  updateBlocks()
}

const removeListItem = (block, index) => {
  if (block.items && block.items.length > 1) {
    block.items.splice(index, 1)
    updateBlocks()
  }
}

// Column operations
const addColumn = (block) => {
  if (block.columns && block.columns.length < 4) {
    block.columns.push({ id: generateId(), blocks: [] })
    updateBlocks()
  }
}

const removeColumn = (block, colIndex) => {
  if (block.columns && block.columns.length > 2) {
    block.columns.splice(colIndex, 1)
    updateBlocks()
  }
}

const addBlockToColumn = (block, colIndex) => {
  modalTarget.value = { blockId: block.id, colIndex }
  showColumnModal.value = true
}

const addColumnBlock = (type) => {
  const target = modalTarget.value
  const block = blocks.value.find(b => b.id === target.blockId)
  
  if (block && block.columns) {
    const newBlock = {
      id: generateId(),
      type,
      content: type === 'paragraph' ? 'Column content' : ''
    }
    
    block.columns[target.colIndex].blocks.push(newBlock)
    updateBlocks()
    showColumnModal.value = false
  }
}

const addNestedBlock = (block) => {
  if (!block.blocks) block.blocks = []
  
  block.blocks.push({
    id: generateId(),
    type: 'paragraph',
    content: 'Nested content'
  })
  updateBlocks()
}

// Selection
const selectBlock = (index) => {
  selectedIndex.value = index
  selectedColumn.value = null
}

const selectColumn = (block, colIndex) => {
  selectedColumn.value = { blockId: block.id, colIndex }
  selectedIndex.value = blocks.value.findIndex(b => b.id === block.id)
}

const selectColumnBlock = (block, colIndex, colBlockIndex) => {
  selectedColumn.value = { 
    blockId: block.id, 
    colIndex, 
    colBlockIndex 
  }
  selectedIndex.value = blocks.value.findIndex(b => b.id === block.id)
}

// Block operations
const moveUp = () => {
  if (selectedIndex.value > 0) {
    const block = blocks.value[selectedIndex.value]
    blocks.value.splice(selectedIndex.value, 1)
    blocks.value.splice(selectedIndex.value - 1, 0, block)
    selectedIndex.value--
    updateBlocks()
  }
}

const moveDown = () => {
  if (selectedIndex.value < blocks.value.length - 1) {
    const block = blocks.value[selectedIndex.value]
    blocks.value.splice(selectedIndex.value, 1)
    blocks.value.splice(selectedIndex.value + 1, 0, block)
    selectedIndex.value++
    updateBlocks()
  }
}

const duplicateBlock = () => {
  if (selectedIndex.value !== -1) {
    const original = blocks.value[selectedIndex.value]
    const duplicate = JSON.parse(JSON.stringify(original))
    duplicate.id = generateId()
    
    blocks.value.splice(selectedIndex.value + 1, 0, duplicate)
    selectedIndex.value++
    updateBlocks()
  }
}

const removeBlock = () => {
  if (selectedIndex.value !== -1) {
    blocks.value.splice(selectedIndex.value, 1)
    selectedIndex.value = -1
    selectedColumn.value = null
    updateBlocks()
  }
}

// Helpers
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

const getBlockPreview = (block) => {
  if (block.type === 'paragraph' || block.type === 'heading' || block.type === 'subheading') {
    return block.content || '(Empty)'
  } else if (block.type === 'bullet-list' || block.type === 'number-list') {
    return `${block.items?.length || 0} items`
  } else if (block.type === 'image' || block.type === 'video' || block.type === 'audio' || block.type === 'file') {
    return block.content ? 'URL added' : '(No URL)'
  } else if (block.type === 'row-layout') {
    return `${block.columns?.length || 0} columns`
  } else if (block.type === 'nested-layout') {
    return `${block.blocks?.length || 0} nested blocks`
  }
  return '(Preview)'
}

const isValidImage = (url) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
}

const isYouTubeUrl = (url) => {
  return /youtube\.com|youtu\.be/i.test(url)
}

const getYouTubeId = (url) => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : ''
}

// Update parent
const updateBlocks = () => {
  emit('update:modelValue', blocks.value)
}

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  blocks.value = newVal || []
}, { deep: true })
</script>

<style scoped>
.column-container:hover {
  @apply border-gray-400;
}

.block-content > * + * {
  margin-top: 0.75em;
}
</style>
