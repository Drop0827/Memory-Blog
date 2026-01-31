<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores'
import Search from '@/components/Search/index.vue'
import Rss from '@/components/Tools/components/Rss/index.vue'

// Icons (using basic SVG or imported icons if available, here using simple text or emojis/SVGs as placeholders
// or I should import react-icons equivalent? The original used react-icons.
// I'll use standard SVGs or text for now to avoid dependency hell, or standard imported SVGs if I had them.
// Actually FloatingBlock in React imported specific react-icons.
// I'll use raw SVG strings for buttons to look nice.)

// Simple SVG Icons
const Icons = {
  Sun: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
  Moon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>',
  Search:
    '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>',
  Rss: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>',
  Up: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>',
  Cog: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
  Command:
    '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a2 2 0 01-2-2v-2h2a2 2 0 012 2v2a2 2 0 01-2 2zM7 21v-2a2 2 0 012-2v-2H7a2 2 0 01-2 2v2a2 2 0 012 2zM21 7a2 2 0 01-2 2h-2V7a2 2 0 012-2h2v2zM7 9H5a2 2 0 01-2-2V5a2 2 0 012-2h2v2a2 2 0 01-2 2zM15 9h2a2 2 0 012 2v2h-2V9zM5 13H3a2 2 0 01-2-2v-2h2v2a2 2 0 01-2 2zM9 9h6v6H9V9z" /></svg>',
}

const configStore = useConfigStore()
const { isDark, web } = storeToRefs(configStore)

const isExpanded = ref(false)
const isDragging = ref(false)
const isSearchOpen = ref(false)
const isRssOpen = ref(false)

const position = reactive({
  bottom: 80,
  right: 30,
})

const dragger = ref<HTMLElement | null>(null)
let startX = 0
let startY = 0
let startBottom = 0
let startRight = 0

const onMouseDown = (e: MouseEvent | TouchEvent) => {
  isDragging.value = false // Initially false, checking movement

  // Prevent default touch actions like scrolling
  if (e.type === 'touchstart') {
    // e.preventDefault() // Maybe too aggressive
  }

  const clientX = e instanceof MouseEvent ? e.clientX : e.touches?.[0]?.clientX || 0
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches?.[0]?.clientY || 0

  startX = clientX
  startY = clientY
  startBottom = position.bottom
  startRight = position.right

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.addEventListener('touchmove', onMouseMove, { passive: false })
  document.addEventListener('touchend', onMouseUp)
}

const onMouseMove = (e: MouseEvent | TouchEvent) => {
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches?.[0]?.clientX || 0
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches?.[0]?.clientY || 0

  const deltaX = startX - clientX // Moving left increases right
  const deltaY = startY - clientY // Moving up increases bottom

  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    isDragging.value = true
    if (isExpanded.value) isExpanded.value = false
  }

  if (isDragging.value) {
    position.right = startRight + deltaX
    position.bottom = startBottom + deltaY

    // Simple constraints (optional)
    if (position.right < 0) position.right = 0
    if (position.bottom < 0) position.bottom = 0
    if (position.right > window.innerWidth - 60) position.right = window.innerWidth - 60
    if (position.bottom > window.innerHeight - 60) position.bottom = window.innerHeight - 60
  }
}

const onMouseUp = () => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('touchmove', onMouseMove)
  document.removeEventListener('touchend', onMouseUp)

  // Reset dragging flag after a short delay to prevent click triggering immediately if it was a drag
  setTimeout(() => {
    isDragging.value = false
  }, 100)
}

const toggleExpanded = () => {
  if (!isDragging.value) {
    isExpanded.value = !isExpanded.value
  }
}

const onToggleTheme = () => {
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

// Calculate action positions
const getItemStyle = (index: number, total: number) => {
  if (!isExpanded.value)
    return {
      transform: 'translate(0, 0) scale(0)',
      opacity: 0,
    }

  const angle = (index * 360) / total - 90
  const radius = 60
  const x = Math.cos((angle * Math.PI) / 180) * radius
  const y = Math.sin((angle * Math.PI) / 180) * radius

  return {
    transform: `translate(${x}px, ${y}px) scale(1)`,
    opacity: 1,
  }
}

const actionItems = computed(() => [
  {
    icon: isDark.value ? Icons.Sun : Icons.Moon,
    label: isDark.value ? 'Light' : 'Dark',
    onClick: onToggleTheme,
  },
  {
    icon: Icons.Search,
    label: 'Search',
    onClick: () => (isSearchOpen.value = true),
  },
  {
    icon: Icons.Rss,
    label: 'RSS',
    onClick: () => (isRssOpen.value = true),
  },
  {
    icon: Icons.Up,
    label: 'Top',
    onClick: onReturnTop,
  },
])
</script>

<template>
  <div class="fixed z-50 pointer-events-none inset-0 overflow-hidden">
    <!-- Floating Bubble -->
    <div
      ref="dragger"
      class="absolute pointer-events-auto cursor-grab active:cursor-grabbing flex items-center justify-center"
      :style="{ bottom: position.bottom + 'px', right: position.right + 'px' }"
      @mousedown="onMouseDown"
      @touchstart="onMouseDown"
    >
      <!-- Expanded Items -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          v-for="(item, index) in actionItems"
          :key="index"
          class="absolute transition-all duration-300 ease-out"
          :style="getItemStyle(index, actionItems.length)"
        >
          <button
            @click.stop="item.onClick"
            class="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110 transition-transform"
            :title="item.label"
          >
            <div class="w-5 h-5" v-html="item.icon"></div>
          </button>
        </div>
      </div>

      <!-- Main Button -->
      <button
        @click="toggleExpanded"
        class="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-xl flex items-center justify-center relative z-10 transition-transform hover:scale-105"
        :class="{ 'rotate-180': isExpanded }"
      >
        <div
          class="w-8 h-8 transition-transform duration-300"
          v-html="isExpanded ? Icons.Command : Icons.Cog"
        ></div>
      </button>
    </div>

    <Search :show="isSearchOpen" @close="isSearchOpen = false" />
    <Rss :show="isRssOpen" :data="web" @close="isRssOpen = false" />
  </div>
</template>
