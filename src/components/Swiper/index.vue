<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Swiper } from '@/types/app/swiper'

// 定义 Props
const props = defineProps<{
  data: Swiper[]
  className?: string
}>()

const current = ref(0)
const isHovered = ref(false)
let intervalId: any = null

const startAutoPlay = () => {
  stopAutoPlay()
  intervalId = setInterval(() => {
    next()
  }, 4000)
}

const stopAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const prev = () => {
  if (props.data.length === 0) return
  current.value = current.value === 0 ? props.data.length - 1 : current.value - 1
}

const next = () => {
  if (props.data.length === 0) return
  current.value = current.value >= props.data.length - 1 ? 0 : current.value + 1
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})

// 鼠标悬停控制
const onMouseEnter = () => {
  isHovered.value = true
  stopAutoPlay()
}

const onMouseLeave = () => {
  isHovered.value = false
  startAutoPlay()
}
</script>

<template>
  <div
    class="group relative w-full h-[200px] sm:h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl"
    :class="className"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <!-- 背景遮罩，确保文字清晰 -->
    <div
      class="absolute inset-0 z-10 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent pointer-events-none"
    ></div>

    <!-- 左箭头 -->
    <div
      @click="prev"
      class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 hover:scale-110"
    >
      ❮
    </div>

    <!-- 轮播内容 -->
    <div
      v-for="(item, index) in data"
      :key="index"
      class="absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out"
      :class="{ 'opacity-100': index === current, 'opacity-0': index !== current }"
    >
      <img
        :src="item.image"
        :alt="item.title"
        class="w-full h-full object-cover transform transition-transform duration-[10000ms]"
        :style="{ transform: index === current ? 'scale(1.1)' : 'scale(1)' }"
      />

      <!-- 文字内容 -->
      <div
        class="absolute bottom-10 left-8 z-20 max-w-2xl transform transition-all duration-500"
        :class="{
          'translate-y-0 opacity-100': index === current,
          'translate-y-10 opacity-0': index !== current,
        }"
      >
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg text-shadow">
          {{ item.title }}
        </h2>
        <p class="text-gray-200 text-lg mb-4 line-clamp-2 md:line-clamp-none drop-shadow-md">
          {{ item.description }}
        </p>

        <a
          :href="item.url"
          target="_blank"
          class="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all shadow-lg hover:shadow-blue-500/50"
        >
          立刻围观 ➜
        </a>
      </div>
    </div>

    <!-- 右箭头 -->
    <div
      @click="next"
      class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 hover:scale-110"
    >
      ❯
    </div>

    <!-- 指示器 -->
    <div class="absolute bottom-4 right-8 z-20 flex gap-2">
      <div
        v-for="(_, index) in data"
        :key="index"
        @click="current = index"
        class="h-1 rounded-full cursor-pointer transition-all duration-300 shadow-sm"
        :class="index === current ? 'bg-blue-500 w-8' : 'bg-white/50 w-4 hover:bg-white/80'"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
