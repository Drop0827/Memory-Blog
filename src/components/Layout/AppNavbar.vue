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
    class="fixed top-0 left-0 w-full z-50 transition-all duration-300"
    :class="
      isScrolled || !transparent
        ? 'bg-[#1a1b26]/90 h-16 shadow-lg border-b border-white/10'
        : 'bg-transparent h-20'
    "
  >
    <div
      class="container mx-auto px-4 lg:px-12 h-full flex items-center justify-between max-w-[1250px] relative"
    >
      <!-- Logo 区 -->
      <router-link to="/" class="flex items-center cursor-pointer group z-20 flex-shrink-0">
        <img
          src="https://bu.dusays.com/2026/02/06/6985b746c93fd.png"
          alt="Memory Blog Logo"
          class="h-12 object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </router-link>

      <!-- 导航菜单 (Centered) -->
      <nav
        class="hidden lg:flex items-center gap-6 text-[13px] font-medium text-gray-300 whitespace-nowrap absolute left-1/2 -translate-x-1/2"
      >
        <router-link
          to="/"
          class="px-3 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-1"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>🏠</span> 首页
        </router-link>
        <router-link
          to="/notes"
          class="px-3 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-1"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>💻</span> 开发笔记
        </router-link>
        <router-link
          to="/life"
          class="px-3 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-1"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>☕</span> 生活随笔
        </router-link>
        <router-link
          to="/university"
          class="px-3 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-1"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>🎓</span> 大学生活
        </router-link>
        <router-link
          to="/timeline"
          class="px-3 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-1"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>📅</span> 开发历程
        </router-link>
        <router-link
          to="/about"
          class="px-3 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-1"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>👨‍💻</span> 关于我
        </router-link>
        <router-link
          to="/memories"
          class="px-3 py-2 rounded-full hover:text-blue-500 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-1"
          active-class="text-blue-500 bg-blue-50 dark:bg-white/10 dark:text-white"
        >
          <span>📼</span> 心之所向
        </router-link>
      </nav>

      <!-- 右侧功能区 (Explore + Theme) -->
      <div class="flex items-center gap-6 z-20">
        <!-- 探索 (Dropdown) - Moved here -->
        <div class="relative group cursor-pointer hidden lg:block">
          <span
            class="flex items-center gap-1 text-[13px] font-medium text-gray-300 group-hover:text-blue-500 transition-colors px-3 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <span>🧩</span> 探索
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 transition-transform group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>

          <!-- Dropdown Menu -->
          <div
            class="absolute right-0 top-full pt-2 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-50 w-40"
          >
            <div
              class="bg-white dark:bg-[#1e2530] rounded-xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden py-1"
            >
              <router-link
                to="/moments"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-blue-500 transition-colors"
                >🏔️ 闪念</router-link
              >
              <!-- Footprints menu item removed -->
              <router-link
                to="/friends"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-blue-500 transition-colors"
                >🥙 朋友圈</router-link
              >
              <router-link
                to="/fishpond"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-blue-500 transition-colors"
                >🐟 鱼塘</router-link
              >
              <router-link
                to="/wall"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-blue-500 transition-colors"
                >💌 留言墙</router-link
              >
              <router-link
                to="/tags"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-blue-500 transition-colors"
                >🏷️ 标签墙</router-link
              >
              <router-link
                to="/devices"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-blue-500 transition-colors"
                >🔭 我的设备</router-link
              >
              <router-link
                to="/resume"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-blue-500 transition-colors"
                >💪 我的履历</router-link
              >
              <a
                href="https://github.com"
                target="_blank"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-blue-500 transition-colors"
                >🔥 GitHub</a
              >
            </div>
          </div>
        </div>

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
