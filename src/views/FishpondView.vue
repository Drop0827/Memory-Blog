<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRssList } from '@/api'
import type { Rss } from '@/types/app/rss'
import Starry from '@/components/Starry/index.vue'
import AppNavbar from '@/components/Layout/AppNavbar.vue'

const loading = ref(true)
const rssList = ref<Rss[]>([])

const loadData = async () => {
  try {
    loading.value = true
    const res = await getRssList()
    rssList.value = (res.data as any) || []
  } catch (err) {
    console.error('Failed to load rss list', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const getRandomColor = () => {
  const colors = [
    'bg-orange-100 text-orange-600',
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-purple-100 text-purple-600',
    'bg-pink-100 text-pink-600',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
</script>

<template>
  <div
    class="fishpond-view min-h-screen bg-gray-50 dark:bg-[#1a1b26] text-gray-900 dark:text-[#c0caf5] font-sans transition-colors duration-300"
  >
    <Starry />
    <AppNavbar :transparent="false" />

    <div class="container mx-auto px-4 lg:px-8 max-w-[1000px] py-24 relative z-10">
      <div class="text-center mb-12">
        <h1
          class="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent"
        >
          我的鱼塘
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-lg">聚合订阅，探索未知的知识海洋</p>
      </div>

      <div v-if="loading" class="text-center py-20 opacity-60">
        <div class="animate-pulse">正在撒网捕鱼...</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          v-for="(item, index) in rssList"
          :key="item.url || index"
          :href="item.url"
          target="_blank"
          class="group bg-white dark:bg-[#1e2530] rounded-2xl p-5 border border-gray-100 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 p-1">
              <img
                :src="item.image || '/logo.png'"
                class="w-full h-full object-contain"
                @error="(e: any) => (e.target.src = '/logo.png')"
              />
            </div>
            <span class="text-xs px-2 py-1 rounded-md font-medium" :class="getRandomColor()">
              {{ item.type || 'RSS' }}
            </span>
          </div>

          <h3
            class="font-bold text-lg mb-2 group-hover:text-blue-500 transition-colors line-clamp-1"
          >
            {{ item.title }}
          </h3>

          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
            {{ item.description || '暂无描述' }}
          </p>

          <div class="flex items-center gap-2 text-xs text-gray-400">
            <span>👤 {{ item.author || '未知作者' }}</span>
            <span v-if="item.createTime"
              >• {{ new Date(Number(item.createTime)).toLocaleDateString() }}</span
            >
          </div>
        </a>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && rssList.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">🎣</div>
        <p class="text-gray-500">鱼塘里空空如也，快去添加订阅吧！</p>
      </div>
    </div>
  </div>
</template>
