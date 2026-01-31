<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  content: string
}>()

const isVisible = ref(false)
</script>

<template>
  <div class="relative inline-block" @mouseenter="isVisible = true" @mouseleave="isVisible = false">
    <slot />

    <transition name="fade">
      <div
        v-if="isVisible"
        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap z-50 pointer-events-none"
      >
        {{ content }}
        <div
          class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"
        ></div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
