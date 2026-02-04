<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRecordList } from '@/api'
import type { Record as LogRecord } from '@/types/app/record'
import Starry from '@/components/Starry/index.vue'
import AppNavbar from '@/components/Layout/AppNavbar.vue'
import AppFooter from '@/components/Footer/index.vue'

const loading = ref(true)
const moments = ref<LogRecord[]>([])

const formatTime = (time: string | undefined) => {
  if (!time) return ''
  return new Date(Number(time)).toLocaleString()
}

const loadData = async () => {
  try {
    loading.value = true
    const res = await getRecordList()
    moments.value = res.data || []
  } catch (err) {
    console.error('Failed to load moments', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
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

            <div v-if="moment.images" class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <template v-if="Array.isArray(moment.images)">
                <img
                  v-for="(img, idx) in moment.images"
                  :key="idx"
                  :src="img"
                  class="rounded-lg object-cover aspect-square w-full h-full cursor-zoom-in hover:opacity-90 transition-opacity"
                />
              </template>
              <template v-else-if="moment.images">
                <img :src="moment.images" class="rounded-lg object-cover max-h-60 w-auto" />
              </template>
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
  </div>
</template>
