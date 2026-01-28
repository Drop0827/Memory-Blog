<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  strings: string[]
  typeSpeed?: number
  backSpeed?: number
  loop?: boolean
  className?: string
}>()

const textElement = ref<HTMLElement | null>(null)
let timeoutId: any = null
let stringIndex = 0
let charIndex = 0
let isDeleting = false

const type = () => {
  const currentString = props.strings[stringIndex % props.strings.length]
  const speed = isDeleting ? props.backSpeed || 30 : props.typeSpeed || 100

  if (!textElement.value) return

  if (isDeleting) {
    textElement.value.textContent = currentString.substring(0, charIndex - 1)
    charIndex--
  } else {
    textElement.value.textContent = currentString.substring(0, charIndex + 1)
    charIndex++
  }

  if (!isDeleting && charIndex === currentString.length) {
    isDeleting = true
    timeoutId = setTimeout(type, 2000) // Pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    stringIndex++
    if (!props.loop && stringIndex >= props.strings.length) return
    timeoutId = setTimeout(type, 500)
  } else {
    timeoutId = setTimeout(type, speed)
  }
}

onMounted(() => {
  if (props.strings && props.strings.length > 0) {
    type()
  }
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})

// Watch for changes in strings
watch(
  () => props.strings,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      if (timeoutId) clearTimeout(timeoutId)
      stringIndex = 0
      charIndex = 0
      isDeleting = false
      type()
    }
  },
)
</script>

<template>
  <span ref="textElement" :class="className" class="typed-text"></span>
  <span class="typed-cursor">|</span>
</template>

<style scoped>
.typed-cursor {
  animation: blink 0.7s infinite;
  opacity: 1;
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
