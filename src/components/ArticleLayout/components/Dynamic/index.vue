<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getRecordList } from '@/api'
import { HTMLParser } from '@/utils/htmlParser'
import type { Record as RecordType } from '@/types/app/record'
import DynamicSvg from '@/components/ArticleLayout/svg/dynamic.svg'

const props = defineProps<{
  className?: string
}>()

const list = ref<RecordType[]>([])
const currentContentIndex = ref(0)
const fade = ref(true)
let intervalId: any = null

const fetchList = async () => {
  try {
    const res = await getRecordList({
      // Use paging or list. Original used Paging with page 1 size 8.
      // getRecordList takes FilterData. getRecordPaging takes params + filterData.
      // The API def in src/api/index.ts says: getRecordPaging(params, filterData).
      // Actually I'll use getRecordPaging to match original logic exactly.
    })
    // But wait, the original code used getRecordPagingAPI({ pagination: { page: 1, size: 8 } }).
    // My api index.ts has getRecordPaging({ page: 1, size: 8 }).
    // Wait, getRecordList takes filterData. getRecordPaging takes params.
    // Let's use getRecordPaging.
  } catch (e) {
    console.error(e)
  }
}

// Re-implement fetching logic with getRecordPaging
import { getRecordPaging } from '@/api'

const loadData = async () => {
  try {
    const res = await getRecordPaging({ page: 1, size: 8 })
    if (res.data && res.data.result) {
      list.value = res.data.result
    }
  } catch (error) {
    console.error('Failed to load dynamic records', error)
  }
}

const startRotation = () => {
  if (intervalId) clearInterval(intervalId)
  intervalId = setInterval(() => {
    fade.value = false // Start fade out
    setTimeout(() => {
      if (list.value.length > 0) {
        currentContentIndex.value = (currentContentIndex.value + 1) % list.value.length
      }
      fade.value = true // Fade in
    }, 500)
  }, 5000)
}

onMounted(async () => {
  await loadData()
})

watch(list, (newList) => {
  if (newList.length > 0) {
    startRotation()
  }
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

const extractText = (html: string) => HTMLParser.extractText(html)
</script>

<template>
  <div
    class="flex justify-between items-center w-full px-4 py-3 border dark:border-transparent rounded-lg bg-white dark:bg-black-b mb-2"
    :class="className"
  >
    <div class="flex items-center shrink-0">
      <img :src="DynamicSvg" alt="动态" width="25" height="25" class="mr-2 w-[25px] h-[25px]" />
      <span class="text-gray-700 dark:text-gray-200 font-medium">最新动态：</span>
    </div>

    <RouterLink
      to="/record"
      class="flex-1 line-clamp-1 hover:text-blue-500 cursor-pointer transition-opacity duration-500 text-gray-600 dark:text-gray-400 ml-2"
      :class="{ 'opacity-100': fade, 'opacity-0': !fade }"
    >
      {{ list.length > 0 ? extractText(list[currentContentIndex]?.content || '') : '暂无动态' }}
    </RouterLink>
  </div>
</template>
