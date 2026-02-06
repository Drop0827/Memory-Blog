<script setup lang="ts">
/**
 * SplitText 文字分割动画组件
 * 基于原作者的 React 版本移植到 Vue 3
 * 使用 GSAP 实现文字逐字/逐词出现动画
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  text: string
  className?: string
  delay?: number
  duration?: number
  splitType?: 'chars' | 'words'
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  delay: 50,
  duration: 0.6,
  splitType: 'chars',
})

const containerRef = ref<HTMLElement | null>(null)

// 分割文本
const splitText = (text: string, type: 'chars' | 'words'): string[] => {
  if (type === 'words') {
    return text.split(' ')
  }
  return text.split('')
}

const initAnimation = () => {
  if (!containerRef.value) return

  const elements = containerRef.value.querySelectorAll('.split-item')
  if (elements.length === 0) return

  // 设置初始状态
  gsap.set(elements, { opacity: 0, y: 40 })

  // 创建滚动触发动画
  gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration: props.duration,
    ease: 'power3.out',
    stagger: props.delay / 1000,
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 90%',
      toggleActions: 'play none none none',
      once: true,
    },
  })
}

onMounted(() => {
  initAnimation()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
})

watch(
  () => props.text,
  () => {
    initAnimation()
  },
)
</script>

<template>
  <p ref="containerRef" :class="['split-text inline-block overflow-hidden', className]">
    <span
      v-for="(item, index) in splitText(text, splitType)"
      :key="index"
      class="split-item inline-block"
      :class="{ 'mr-1': splitType === 'words' && index < splitText(text, splitType).length - 1 }"
      >{{ item === ' ' ? '\u00A0' : item }}</span
    >
  </p>
</template>
