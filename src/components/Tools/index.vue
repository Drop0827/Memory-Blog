<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores'
import Search from '@/components/Search/index.vue'
import Rss from './components/Rss/index.vue'

import SunSvg from './image/sun.svg'
import MoonSvg from './image/moon.svg'
import SearchSvg from './image/search.svg'
import ReturnTopSvg from './image/returnTop.svg'
import RssSvg from './image/rss.svg'

const configStore = useConfigStore()
const { isDark, web } = storeToRefs(configStore)

const isSearchOpen = ref(false)
const isRssOpen = ref(false)

const toggleTheme = () => {
  configStore.setIsDark(!isDark.value)
  if (configStore.isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const onReturnTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const itemSty =
  'p-2 w-full h-auto object-contain hover:bg-[#edf5ff] dark:hover:bg-[#4e5969] cursor-pointer transition-colors duration-300'
</script>

<template>
  <div>
    <div
      class="z-[999] overflow-hidden fixed top-[70%] right-[3%] flex flex-col w-12 bg-white dark:bg-black-b border border-gray-100 dark:border-[#4e5969] rounded-md divide-y divide-gray-100 dark:divide-[#4e5969] shadow-lg"
    >
      <img v-if="isDark" :src="SunSvg" alt="太阳" :class="itemSty" @click="toggleTheme" />
      <img v-else :src="MoonSvg" alt="月亮" :class="itemSty" @click="toggleTheme" />

      <img :src="SearchSvg" alt="搜索" :class="itemSty" @click="isSearchOpen = true" />

      <img :src="RssSvg" alt="订阅" :class="itemSty" @click="isRssOpen = true" />

      <img :src="ReturnTopSvg" alt="返回顶部" :class="itemSty" @click="onReturnTop" />
    </div>

    <!-- Modals -->
    <Search :show="isSearchOpen" @close="isSearchOpen = false" />
    <Rss :show="isRssOpen" :data="web" @close="isRssOpen = false" />
  </div>
</template>
