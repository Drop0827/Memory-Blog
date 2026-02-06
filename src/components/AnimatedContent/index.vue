<script setup lang="ts">
/**
 * AnimatedContent 滚动触发动画组件
 * 使用 Intersection Observer 实现元素滚动进入动画
 */
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  distance?: number
  direction?: 'vertical' | 'horizontal'
  reverse?: boolean
  duration?: number
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  distance: 50,
  direction: 'vertical',
  reverse: false,
  duration: 0.8,
  delay: 0,
})

const containerRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

// 计算初始偏移
const getTransform = () => {
  if (isVisible.value) return 'translate(0, 0)'

  const offset = props.reverse ? -props.distance : props.distance
  if (props.direction === 'horizontal') {
    return `translate(${offset}px, 0)`
  }
  return `translate(0, ${offset}px)`
}

onMounted(() => {
  if (!containerRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 延迟后显示
          setTimeout(() => {
            isVisible.value = true
          }, props.delay * 1000)

          // 只触发一次
          if (observer && containerRef.value) {
            observer.unobserve(containerRef.value)
          }
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    },
  )

  observer.observe(containerRef.value)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="animated-content"
    :style="{
      opacity: isVisible ? 1 : 0,
      transform: getTransform(),
      transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
      transitionDelay: `${delay}s`,
    }"
  >
    <slot />
  </div>
</template>
