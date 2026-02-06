<script setup lang="ts">
/**
 * HorizontalGallery 水平滚动画廊组件
 * 基于原作者的 Work 组件移植到 Vue 3
 * 实现图片自动水平滚动效果
 */
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface ImageData {
  src: string
  alt: string
}

interface Props {
  images?: ImageData[]
  scrollSpeed?: number
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [
    { src: 'https://bu.dusays.com/2025/08/09/689624f3698af.jpg', alt: 'Image 14' },
    { src: 'https://bu.dusays.com/2025/08/09/6896247e7aaf6.jpg', alt: 'Image 13' },
    { src: 'https://bu.dusays.com/2025/08/09/689623fe118af.jpg', alt: 'Image 2' },
    { src: 'https://bu.dusays.com/2025/08/09/6896246086c01.jpg', alt: 'Image 6' },
  ],
  scrollSpeed: 2,
})

const isPaused = ref(false)
const stripRef = ref<HTMLElement | null>(null)
let position = 0
let singleLoopWidth = 0
let animationId: number | null = null

// 复制图片用于无缝滚动
const galleryImages = computed(() => [...props.images, ...props.images])

const animate = () => {
  if (!isPaused.value && stripRef.value) {
    position -= props.scrollSpeed

    if (singleLoopWidth > 0) {
      position = position % singleLoopWidth
      if (position > 0) {
        position -= singleLoopWidth
      }
    }

    stripRef.value.style.transform = `translateX(${position}px)`
  }
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (stripRef.value) {
    const firstImage = stripRef.value.querySelector('img')
    if (firstImage) {
      const imageWidth = firstImage.offsetWidth
      const gap = 24
      singleLoopWidth = props.images.length * (imageWidth + gap)
    }
  }
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <div
    class="relative overflow-hidden py-8"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <div ref="stripRef" class="flex gap-6 whitespace-nowrap" style="will-change: transform">
      <div
        v-for="(image, index) in galleryImages"
        :key="index"
        class="w-[650px] rounded-lg overflow-hidden shadow-xl flex-shrink-0"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  </div>
</template>
