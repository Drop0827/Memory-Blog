<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores'
import { getSwiperList, getArticleList } from '@/api'
import Dynamic from './components/Dynamic/index.vue'
import AppSwiper from '@/components/Swiper/index.vue'
import Classics from './Classics/index.vue'
import Waterfall from './Waterfall/index.vue'
import Card from './Card/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import type { Article } from '@/types/app/article'
import type { Swiper } from '@/types/app/swiper'

const props = defineProps<{
  page: number
}>()

const configStore = useConfigStore()
const { theme } = storeToRefs(configStore)

const swipers = ref<Swiper[]>([])
// Initialize with empty paginate structure
const articleData = ref<Paginate<Article[]>>({
  page: 1,
  size: 10,
  total: 0,
  pages: 0,
  result: [],
  next: false,
  prev: false,
})

const loading = ref(false)

const loadSwipers = async () => {
  try {
    const res = await getSwiperList()
    swipers.value = res.data || []
  } catch (e) {
    console.error('Failed to load swipers', e)
  }
}

const loadArticles = async () => {
  loading.value = true
  try {
    const isWaterfall = theme.value?.is_article_layout === 'waterfall'
    const size = isWaterfall ? 28 : 8
    const res = await getArticleList({
      page: props.page,
      size: size,
    })

    if (res.data) {
      articleData.value = res.data
      // Filter logic from original component
      if (articleData.value.result) {
        articleData.value.result = articleData.value.result.filter(
          (item) => item.config?.status !== 'no_home',
        )
      }
    }
  } catch (e) {
    console.error('Failed to load articles', e)
  } finally {
    loading.value = false
  }
}

// Watch for page changes or layout changes
watch([() => props.page, () => theme.value?.is_article_layout], () => {
  loadArticles()
})

onMounted(() => {
  loadSwipers()
  loadArticles()
})

const sidebar = computed(() => theme.value?.right_sidebar || [])
</script>

<template>
  <div
    class="w-full md:w-[90%] mx-auto transition-all duration-300"
    :class="sidebar.length ? 'lg:w-[68%] xl:w-[73%]' : 'w-full'"
  >
    <AppSwiper v-if="swipers.length" :data="swipers" />
    <Dynamic class="my-2" />

    <div v-if="loading" class="py-20 text-center text-gray-500 animate-pulse">Loading...</div>

    <div v-else>
      <Classics v-if="theme?.is_article_layout === 'classics'" :data="articleData" />
      <Card v-else-if="theme?.is_article_layout === 'card'" :data="articleData" />
      <Waterfall v-else-if="theme?.is_article_layout === 'waterfall'" :data="articleData" />
      <!-- Default fallback if undefined or other -->
      <Card v-else :data="articleData" />
    </div>

    <!-- total is total PAGES here, matching typical usage in this codebase -->
    <Pagination
      v-if="articleData.total"
      :total="articleData.pages"
      :page="page"
      class="flex justify-center mt-8 pb-8"
    />
  </div>
</template>
