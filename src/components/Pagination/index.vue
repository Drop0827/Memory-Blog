<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps<{
  total: number // Total pages
  page: number // Current page
  path?: string // Base path
  className?: string
  customHandler?: boolean // If true, don't use router, just emit change
}>()

const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

const router = useRouter()
const route = useRoute()

const currentPage = computed(() => Number(props.page))
const totalPages = computed(() => Number(props.total))

const visiblePages = computed(() => {
  const count = totalPages.value
  const current = currentPage.value
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  range.push(1)

  if (count <= 1) return [1]

  for (let i = current - delta; i <= current + delta; i++) {
    if (i < count && i > 1) {
      range.push(i)
    }
  }
  range.push(count)

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }
  return rangeWithDots
})

const changePage = (p: number | string) => {
  if (p === '...') return
  const pageNum = Number(p)
  if (pageNum === currentPage.value) return
  if (pageNum < 1 || pageNum > totalPages.value) return

  emit('change', pageNum)

  if (!props.customHandler) {
    const query = { ...route.query, page: pageNum }
    if (props.path) {
      router.push({ path: props.path, query: { page: pageNum } })
    } else {
      router.push({ query })
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex flex-wrap items-center justify-center gap-2 mt-8 mb-4"
    :class="className"
  >
    <!-- Prev -->
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        ></path>
      </svg>
    </button>

    <!-- Pages -->
    <template v-for="(p, index) in visiblePages" :key="index">
      <span v-if="p === '...'" class="text-gray-400 dark:text-gray-600 px-1">...</span>

      <button
        v-else
        @click="changePage(p)"
        class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300"
        :class="
          p === currentPage
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 transform scale-105'
            : 'bg-transparent text-gray-500 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-white/5'
        "
      >
        {{ p }}
      </button>
    </template>

    <!-- Next -->
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        ></path>
      </svg>
    </button>
  </div>
</template>
