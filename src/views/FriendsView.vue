<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLinkList } from '@/api'
import type { Link } from '@/types/app/web'
import Starry from '@/components/Starry/index.vue'
import AppNavbar from '@/components/Layout/AppNavbar.vue'
import AppFooter from '@/components/Footer/index.vue'

const loading = ref(true)
const links = ref<Link[]>([])

const loadData = async () => {
  try {
    loading.value = true
    const res = await getLinkList({ status: 1 }) // Only show approved links
    links.value = res.data || []
  } catch (err) {
    console.error('Failed to load links', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const getRandomColor = () => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
</script>

<template>
  <div
    class="friends-view min-h-screen bg-gray-50 dark:bg-[#1a1b26] text-gray-900 dark:text-[#c0caf5] font-sans transition-colors duration-300"
  >
    <Starry />
    <AppNavbar :transparent="false" />

    <div class="container mx-auto px-4 lg:px-8 max-w-[1000px] py-24 relative z-10">
      <div class="text-center mb-12">
        <h1
          class="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
        >
          朋友圈
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-lg">相识即是缘，这里记录了我的小伙伴们</p>
      </div>

      <div v-if="loading" class="text-center py-20 opacity-60">
        <div class="animate-pulse">正在寻找小伙伴...</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          v-for="link in links"
          :key="link.id"
          :href="link.url"
          target="_blank"
          class="group block bg-white dark:bg-[#1e2530] rounded-xl p-4 border border-gray-100 dark:border-white/5 hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex items-center gap-4">
            <div class="relative w-14 h-14 shrink-0">
              <img
                :src="link.image || '/avatar.png'"
                class="w-full h-full rounded-full object-cover border-2 border-gray-100 dark:border-gray-700 group-hover:rotate-[360deg] transition-transform duration-700"
                @error="(e: any) => (e.target.src = '/avatar.png')"
              />
              <div
                class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#1e2530]"
                :class="getRandomColor()"
              ></div>
            </div>
            <div class="overflow-hidden">
              <h3
                class="font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors truncate"
              >
                {{ link.title }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                {{ link.description || '暂无介绍' }}
              </p>
            </div>
          </div>
        </a>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && links.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">🌵</div>
        <p class="text-gray-500">博主还没有添加小伙伴呢</p>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
