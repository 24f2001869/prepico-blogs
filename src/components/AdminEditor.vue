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
          
