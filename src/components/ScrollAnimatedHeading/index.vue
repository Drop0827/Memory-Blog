<script setup lang="ts">
/**
 * ScrollAnimatedHeading 滚动缩放标题组件
 * 基于原作者的 React 版本移植到 Vue 3
 * 实现标题随滚动缩放的动画效果
 */
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  minFontSize?: number
  maxFontSize?: number
  startOffset?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  minFontSize: 16,
  maxFontSize: 48,
  startOffset: 100,
  className: '',
})

const containerRef = ref<HTMLElement | null>(null)

const handleScroll = () => {
  if (!containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight

  // 计算元素在视口中的进度（0 = 刚进入底部, 1 = 已离开顶部）
  const progress = Math.min(
    Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0),
    1,
  )

  // 计算字体大小：从 maxFontSize 逐渐变为 minFontSize
  const fontSize = props.maxFontSize - (props.maxFontSize - props.minFontSize) * progress

  // 计算透明度：0-0.5 进度内从 0 变为 1
  const opacity = Math.min(progress * 2, 1)

  // 计算 Y 偏移：从 startOffset 变为 0
  const translateY = props.startOffset * (1 - progress)

  containerRef.value.style.fontSize = `${fontSize}px`
  containerRef.value.style.opacity = String(opacity)
  containerRef.value.style.transform = `translateY(${translateY}px)`
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll() // 初始化
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div
    ref="containerRef"
    :class="['scroll-animated-heading', className]"
    style="transform-origin: center bottom"
  >
    <slot />
  </div>
</template>
