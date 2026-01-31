<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps<{
  total: number // Total pages
  page: number // Current page
  path?: string // Base path
  className?: string
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

  // If path is provided, we might be navigating to a different route logic,
  // but typically we just update the 'page' query param.
  // The original React code: router.push(path ? `${path}&page=${page}` : `?page=${page}`);

  const query = { ...route.query, page: pageNum }

  if (props.path) {
    // If props.path is provided, use it. Handle if it already has query params.
    router.push({ path: props.path, query: { page: pageNum } })
  } else {
    router.push({ query })
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex flex-wrap items-center gap-2" :class="className">
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-1.5 min-w-[32px] rounded-lg text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <
    </button>

    <template v-for="(p, index) in visiblePages" :key="index">
      <span v-if="p === '...'" class="px-2 text-gray-400 dark:text-gray-600">...</span>

      <button
        v-else
        @click="changePage(p)"
        class="px-3 py-1.5 min-w-[32px] rounded-lg text-sm font-medium border transition-all duration-300"
        :class="
          p === currentPage
            ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-blue-500'
        "
      >
        {{ p }}
      </button>
    </template>

    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-1.5 min-w-[32px] rounded-lg text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      >
    </button>
  </div>
</template>
