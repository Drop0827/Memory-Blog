<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getArticleList } from '@/api'
import { useConfigStore } from '@/stores'
import { storeToRefs } from 'pinia'
import FireSvg from '@/assets/svg/other/fire.svg'
import type { Article } from '@/types/app/article'

const list = ref<Article[]>([])
const configStore = useConfigStore()
const { theme } = storeToRefs(configStore)

onMounted(async () => {
  try {
    // According to original code: retrieve all articles then filter by theme ids.
    // This is inefficient if article count is large, but sticking to logic.
    // Optimization: could just fetch specific IDs if API supports it.
    // For now, let's fetch a list (maybe first page or large size)
    const res = await getArticleList({ page: 1, size: 100 })
    const allArticles = res.data?.result || []

    const recIds = theme.value?.reco_article?.map((id) => Number(id)) || []
    list.value = allArticles.filter((item) => recIds.includes(Number(item.id)))
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div v-if="list.length" class="hot-article-component mb-5">
    <div class="flex flex-col tw_container bg-white dark:bg-black-b p-4 rounded-xl shadow-sm">
      <div class="tw_title w-full dark:text-white flex items-center mb-3">
        <img :src="FireSvg" alt="作者推荐" width="30" height="20" />
        <span class="ml-2 font-bold">作者推荐</span>
      </div>

      <!-- Article List -->
      <div class="w-full space-y-2">
        <div v-for="item in list" :key="item.id">
          <RouterLink
            :to="`/article/${item.id}`"
            target="_blank"
            class="group w-full flex items-center py-2 text-gray-600 dark:text-[#8c9ab1] text-sm transition-all hover:text-blue-500 hover:pl-2"
          >
            <!-- Arrow Icon -->
            <svg
              class="text-lg mr-1 w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
            <span class="w-full line-clamp-1">{{ item.title }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
