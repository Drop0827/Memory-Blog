<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPageConfigByName } from '@/api'
import StudySvg from '@/assets/svg/other/study.svg'
import type { Config } from '@/types/app/config'

const techStack = ref<string[]>([])

onMounted(async () => {
  try {
    const res = await getPageConfigByName('my')
    const myData = res.data?.value
    if (myData && Array.isArray(myData.technology_stack)) {
      techStack.value = myData.technology_stack
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div
    class="flex flex-col tw_container bg-white dark:bg-black-b p-4 mb-5 tw_title rounded-xl shadow-sm"
  >
    <div class="tw_title w-full dark:text-white flex items-center mb-4">
      <img :src="StudySvg" alt="学无止境" width="33" height="23" class="mr-2" />
      <span class="font-bold">学无止境</span>
    </div>

    <!-- Fallback for IconCloud since the original component is missing -->
    <div class="flex flex-wrap gap-2 justify-center">
      <span
        v-for="tech in techStack"
        :key="tech"
        class="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-xs text-gray-700 dark:text-gray-300 border border-transparent hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        {{ tech }}
      </span>
      <span v-if="!techStack.length" class="text-sm text-gray-400">Loading skills...</span>
    </div>
  </div>
</template>
