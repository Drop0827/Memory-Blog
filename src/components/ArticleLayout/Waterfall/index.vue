<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores'
import { getRandom } from '@/utils'
import type { Article } from '@/types/app/article'

defineProps<{
  data: Paginate<Article[]>
}>()

const configStore = useConfigStore()
const { theme } = storeToRefs(configStore)
const covers = computed(() => theme.value?.covers || [])
</script>

<template>
  <div class="mb-12">
    <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      <div
        v-for="item in data.result"
        :key="item.id"
        class="break-inside-avoid group overflow-hidden rounded-xl bg-white dark:bg-black-b border dark:border-black-b hover:shadow-[0_10px_20px_1px_rgb(83,157,253,.1)] cursor-pointer mb-4"
      >
        <RouterLink :to="`/article/${item.id}`">
          <div class="overflow-hidden h-32">
            <div
              class="relative h-full bg-cover bg-no-repeat bg-center scale-100 hover:scale-125 z-10 transition-transform"
              :style="{
                backgroundImage: `url(${item.cover || covers[getRandom(0, covers.length - 1)]})`,
              }"
            />
          </div>

          <div class="py-2 px-4">
            <h1 class="mb-2 text-black dark:text-white group-hover:text-primary line-clamp-2">
              {{ item.title }}
            </h1>

            <div class="text-sm text-gray-500 dark:text-[#8c9ab1] line-clamp-4">
              {{ item.description }}
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Override Tailwind columns gap behavior if needed to behave like masonry */
</style>
