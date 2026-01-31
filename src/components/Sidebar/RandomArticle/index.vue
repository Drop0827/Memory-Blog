<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getRandomArticles } from '@/api'
import { useConfigStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { getRandom } from '@/utils'
import RandomArticleSvg from '@/assets/svg/other/article.svg'
import type { Article } from '@/types/app/article'
import './index.scss' // Keep SCSS import for specific styles

const list = ref<Article[]>([])
const configStore = useConfigStore()
const { theme } = storeToRefs(configStore)
const covers = computed(() => theme.value?.covers || [])

const loadRandom = async () => {
  try {
    const res = await getRandomArticles(5) // Default to 5
    list.value = res.data || []
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadRandom()
})
</script>

<template>
  <div class="RandomArticleComponent mb-5">
    <div
      class="flex flex-col p-4 bg-white dark:bg-black-b tw_container tw_title rounded-xl shadow-sm"
    >
      <h3 class="w-full tw_title dark:text-white flex items-center mb-3">
        <img :src="RandomArticleSvg" alt="随机推荐" width="24" height="24" />
        <span class="ml-2 font-bold">随机推荐</span>
      </h3>

      <div class="w-full mt-2 min-h-[120px] space-y-4">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="item relative h-32 bg-no-repeat bg-center rounded-md transition-all overflow-hidden group cursor-pointer"
          :style="{
            backgroundImage: `url(${item.cover || covers[getRandom(0, covers.length - 1)]})`,
          }"
        >
          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity"
          ></div>

          <RouterLink :to="`/article/${item.id}`" target="_blank" class="absolute inset-0 z-10">
            <h4
              class="absolute bottom-2.5 w-[95%] px-2.5 text-white text-[15px] font-normal line-clamp-1"
            >
              {{ item.title }}
            </h4>
          </RouterLink>

          <span
            class="ranking absolute top-2.5 left-[-16px] w-[30px] h-[25px] pl-[7px] text-white rounded-tr-full rounded-br-full font-black box-border z-20 shadow-md"
          >
            {{ index + 1 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Moving SCSS logic locally if we want, but keeping import is fine.
// The imported SCSS relies on class names .RandomArticleComponent .item etc.
// They match the template.
</style>
