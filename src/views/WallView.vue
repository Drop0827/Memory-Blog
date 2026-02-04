<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getWallList } from '@/api'
import type { Wall } from '@/types/app/wall'
import Starry from '@/components/Starry/index.vue'
import AppNavbar from '@/components/Layout/AppNavbar.vue'
import AppFooter from '@/components/Footer/index.vue'

const loading = ref(true)
const messages = ref<Wall[]>([])

// Simple date formatter if utils not found
const formatTime = (time: string) => {
  if (!time) return ''
  return (
    new Date(Number(time)).toLocaleDateString() + ' ' + new Date(Number(time)).toLocaleTimeString()
  )
}

const loadData = async () => {
  try {
    loading.value = true
    const res = await getWallList({ status: 1 }) // Approved messages only
    messages.value = res.data || []
  } catch (err) {
    console.error('Failed to load wall messages', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const getRandomGradient = () => {
  const gradients = [
    'from-pink-500/10 to-rose-500/10 border-pink-500/20',
    'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    'from-green-500/10 to-emerald-500/10 border-green-500/20',
    'from-purple-500/10 to-violet-500/10 border-purple-500/20',
    'from-orange-500/10 to-amber-500/10 border-orange-500/20',
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}
</script>

<template>
  <div
    class="wall-view min-h-screen bg-gray-50 dark:bg-[#1a1b26] text-gray-900 dark:text-[#c0caf5] font-sans transition-colors duration-300"
  >
    <Starry />
    <AppNavbar :transparent="false" />

    <div class="container mx-auto px-4 lg:px-8 max-w-[1000px] py-24 relative z-10">
      <div class="text-center mb-12">
        <h1
          class="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          留言墙
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-lg">留下你的足迹，分享你的故事</p>
      </div>

      <div v-if="loading" class="text-center py-20 opacity-60">
        <div class="animate-pulse">加载留言中...</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="bg-white/50 dark:bg-[#1e2530]/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col"
          :class="`bg-gradient-to-br ${getRandomGradient()}`"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg"
            >
              💬
            </div>
            <div>
              <div class="font-bold text-gray-800 dark:text-gray-200">
                {{ msg.name || '匿名访客' }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatTime(msg.createTime) }}
              </div>
            </div>
          </div>
          <div class="text-gray-700 dark:text-gray-300 flex-1 leading-relaxed break-words">
            {{ msg.content }}
          </div>

          <div
            v-if="msg.cate"
            class="mt-4 pt-4 border-t border-black/5 dark:border-white/5 flex justify-end"
          >
            <span class="text-xs px-2 py-1 bg-black/5 dark:bg-white/5 rounded text-gray-500">
              {{ msg.cate.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && messages.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">📝</div>
        <p class="text-gray-500">还没有留言哦，快来抢沙发吧！</p>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
