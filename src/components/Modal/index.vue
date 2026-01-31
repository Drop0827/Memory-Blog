<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  show: boolean
  title?: string
  width?: string
}>()

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

// Close on escape
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

// Prevent body scroll when modal is open
watch(
  () => props.show,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          @click="close"
        ></div>

        <!-- Content -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all"
          :class="width || 'max-w-lg'"
        >
          <!-- Header -->
          <div
            v-if="title"
            class="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center"
          >
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ title }}</h3>
            <button
              @click="close"
              class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              ✖
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: all 0.3s ease;
}

.modal-enter-from .transform,
.modal-leave-to .transform {
  opacity: 0;
  transform: scale(0.95);
}
</style>
