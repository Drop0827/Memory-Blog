<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores'

const props = defineProps<{
  transparent?: boolean
}>()

const configStore = useConfigStore()
const { isDark } = storeToRefs(configStore)

// 头部滚动效果
const isScrolled = ref(false)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// 切换暗黑模式
const toggleTheme = () => {
  const nextStatus = !configStore.isDark
  configStore.setIsDark(nextStatus)
  if (nextStatus) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 监听滚动
import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    class="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/5"
    :class="
      isScrolled || !transparent
        ? 'bg-[#0d1320]/80 backdrop-blur-md h-16 shadow-lg'
        : 'bg-transparent h-20'
    "
  >
    <div class="container mx-auto px-6 h-full flex items-center justify-between max-w-[1350px]">
      <!-- Logo / 标题区 -->
      <router-link to="/" class="flex items-center gap-3 cursor-pointer group">
        <span class="text-3xl filter drop-shadow-lg group-hover:rotate-12 transition-transform"
          >⚡</span
        >
        <h1
          class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wide"
        >
          Memory
        </h1>
      </router-link>

      <!-- 导航菜单 -->
      <nav class="hidden lg:flex items-center gap-8 text-[15px] font-medium text-gray-300">
        <router-link
          to="/"
          class="px-4 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>🏠</span> 首页
        </router-link>
        <router-link
          to="/notes"
          class="px-4 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>💻</span> 开发笔记
        </router-link>
        <router-link
          to="/life"
          class="px-4 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>☕</span> 生活随笔
        </router-link>
        <router-link
          to="/university"
          class="px-4 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>🎓</span> 大学生活
        </router-link>
        <router-link
          to="/timeline"
          class="px-4 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>📅</span> 开发历程
        </router-link>
        <router-link
          to="/about"
          class="px-4 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>👨‍💻</span> 关于我
        </router-link>
      </nav>

      <!-- 右侧功能区 -->
      <div class="flex items-center gap-4">
        <button
          @click="toggleTheme"
          class="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-all duration-300 border border-transparent dark:border-white/5 group shadow-sm"
        >
          <span
            v-if="!isDark"
            class="text-yellow-400 group-hover:rotate-90 transition-transform text-lg"
            >☀️</span
          >
          <span v-else class="text-blue-300 group-hover:-rotate-12 transition-transform text-lg"
            >🌙</span
          >
        </button>
        <button class="lg:hidden text-2xl text-gray-300">☰</button>
      </div>
    </div>
  </header>
</template>
