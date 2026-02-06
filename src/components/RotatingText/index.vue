<script setup lang="ts">
/**
 * RotatingText 文字轮播组件
 * 基于原作者的 React 版本移植到 Vue 3
 * 实现文字自动轮播切换动画效果
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  texts: string[]
  rotationInterval?: number
  mainClassName?: string
}

const props = withDefaults(defineProps<Props>(), {
  rotationInterval: 2000,
  mainClassName: '',
})

const currentIndex = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

// 当前显示的文字
const currentText = computed(() => props.texts[currentIndex.value] || '')

// 切换到下一个
const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.texts.length
}

onMounted(() => {
  intervalId = setInterval(next, props.rotationInterval)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <span :class="['rotating-text inline-flex overflow-hidden', mainClassName]">
    <TransitionGroup name="rotate" tag="span" class="relative">
      <span
        v-for="(text, index) in texts"
        v-show="index === currentIndex"
        :key="text"
        class="inline-block"
      >
        {{ text }}
      </span>
    </TransitionGroup>
  </span>
</template>

<style scoped>
.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.rotate-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.rotate-leave-to {
  opacity: 0;
  transform: translateY(-120%);
  position: absolute;
}

.rotate-leave-active {
  position: absolute;
}
</style>
