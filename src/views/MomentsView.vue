<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getRecordList } from '@/api'
import type { Record as LogRecord } from '@/types/app/record'
import Starry from '@/components/Starry/index.vue'
import AppNavbar from '@/components/Layout/AppNavbar.vue'
import AppFooter from '@/components/Footer/index.vue'

const loading = ref(true)
const moments = ref<LogRecord[]>([])

// Preview State
const previewVisible = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)

const openPreview = (images: string[], index: number) => {
  if (!images || images.length === 0) return
  previewImages.value = images
  previewIndex.value = index
  previewVisible.value = true
  document.body.style.overflow = 'hidden' // Prevent background scrolling
}

const closePreview = () => {
  previewVisible.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  if (previewIndex.value < previewImages.value.length - 1) {
    previewIndex.value++
  } else {
    previewIndex.value = 0 // Loop to start
  }
}

const prevImage = () => {
  if (previewIndex.value > 0) {
    previewIndex.value--
  } else {
    previewIndex.value = previewImages.value.length - 1 // Loop to end
  }
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!previewVisible.value) return

  if (e.key === 'Escape') closePreview()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

onMounted(() => {
  loadData()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const formatTime = (time: string | undefined) => {
  if (!time) return ''
  return new Date(Number(time)).toLocaleString()
}

const loadData = async () => {
  try {
    loading.value = true
    const res = await getRecordList()
    moments.value = (res.data || []).map((item: any) => {
      let imgs: string[] = []
      if (typeof item.images === 'string') {
        try {
          if (item.images.trim().startsWith('[')) {
            imgs = JSON.parse(item.images)
          } else if (item.images.trim()) {
            imgs = [item.images]
          }
        } catch (e) {
          console.error('Failed to parse images', item.images)
        }
      } else if (Array.isArray(item.images)) {
        imgs = item.images
      }
      return {
        ...item,
        images: imgs,
      }
    })
  } catch (err) {
    console.error('Failed to load moments', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="moments-view min-h-screen bg-gray-50 dark:bg-[#1a1b26] text-gray-900 dark:text-[#c0caf5] font-sans transition-colors duration-300"
  >
    <Starry />
    <AppNavbar :transparent="false" />

    <div class="container mx-auto px-4 lg:px-8 max-w-[800px] py-24 relative z-10">
      <div class="text-center mb-16">
        <h1
          class="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent"
        >
          生活闪念
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-lg">捕捉瞬间的灵感与美好</p>
      </div>

      <div v-if="loading" class="space-y-8">
        <div
          v-for="i in 3"
          :key="i"
          class="animate-pulse bg-white dark:bg-[#1e2530] p-6 rounded-2xl h-40"
        ></div>
      </div>

      <div
        v-else
        class="space-y-8 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gray-200 dark:before:bg-gray-800 before:z-0"
      >
        <div v-for="moment in moments" :key="moment.id" class="relative pl-16 group">
          <!-- Time Dot -->
          <div
            class="absolute left-6 top-6 w-3 h-3 bg-white dark:bg-[#1a1b26] border-[3px] border-blue-500 rounded-full z-10 group-hover:scale-125 transition-transform duration-300"
          ></div>

          <div
            class="bg-white dark:bg-[#1e2530] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div class="text-sm text-gray-400 mb-2">
              {{ formatTime(moment.createTime as string) }}
            </div>
            <div
              class="text-gray-800 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap mb-4"
            >
              {{ moment.content }}
            </div>

            <!-- Modified image rendering logic based on array length -->
            <div v-if="moment.images && moment.images.length > 0" class="mt-4">
              <!-- Single Image -->
              <div v-if="moment.images.length === 1">
                <img
                  :src="moment.images[0]"
                  class="rounded-lg object-cover max-h-60 w-auto cursor-zoom-in hover:opacity-90 transition-opacity"
                  @click="openPreview(moment.images as string[], 0)"
                />
              </div>

              <!-- Multiple Images Grid -->
              <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <img
                  v-for="(img, idx) in moment.images"
                  :key="idx"
                  :src="img"
                  class="rounded-lg object-cover aspect-square w-full h-full cursor-zoom-in hover:opacity-90 transition-opacity"
                  @click="openPreview(moment.images as string[], idx)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && moments.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">🍃</div>
        <p class="text-gray-500">一片荒芜，博主很懒...</p>
      </div>
    </div>

    <AppFooter />

    <!-- Image Preview Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="previewVisible"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        @click="closePreview"
      >
        <!-- Close Button -->
        <button
          class="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-[101]"
          @click="closePreview"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Navigation Buttons -->
        <button
          v-if="previewImages.length > 1"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-[101]"
          @click.stop="prevImage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          v-if="previewImages.length > 1"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-[101]"
          @click.stop="nextImage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <!-- Image Container -->
        <div class="relative max-w-[90vw] max-h-[90vh]" @click.stop>
          <img
            :src="previewImages[previewIndex]"
            class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl select-none"
            draggable="false"
          />
          <div
            v-if="previewImages.length > 1"
            class="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/80 font-medium"
          >
            {{ previewIndex + 1 }} / {{ previewImages.length }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
