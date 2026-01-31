<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getArticleList } from '@/api'
import Modal from '@/components/Modal/index.vue'
import Empty from '@/components/Empty/index.vue'
import type { Article } from '@/types/app/article'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

const searchKey = ref('')
const data = ref<Paginate<Article[]> | undefined>(undefined)
let timeoutId: any = null

const performSearch = async (key: string) => {
  if (!key.trim()) {
    data.value = undefined
    return
  }

  try {
    const res = await getArticleList({
      key,
      page: 1,
      size: 20, // Reasonable limit
    })
    data.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const onInput = () => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    performSearch(searchKey.value)
  }, 300)
}

const close = () => {
  emit('close')
}

watch(
  () => props.show,
  (val) => {
    if (!val) {
      searchKey.value = ''
      data.value = undefined
    }
  },
)
</script>

<template>
  <Modal :show="show" title="搜索文章" @close="close">
    <div class="mb-2">
      <input
        type="text"
        placeholder="请输入文章关键词"
        v-model="searchKey"
        @input="onInput"
        class="w-full px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
        autofocus
      />
    </div>

    <div class="mt-4 max-h-[60vh] overflow-y-auto">
      <div v-if="data?.result?.length">
        <RouterLink
          v-for="item in data.result"
          :key="item.id"
          :to="`/article/${item.id}`"
          class="block w-full py-3 px-4 mb-2 text-gray-700 dark:text-[#8c9ab1] hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-white/5 hover:pl-6 rounded-lg transition-all duration-300"
          @click="close"
        >
          {{ item.title }}
        </RouterLink>
      </div>

      <Empty v-else-if="data && !data?.result?.length" info="暂无文章" />

      <div v-else class="text-center text-gray-400 py-8">输入关键词开始搜索...</div>
    </div>
  </Modal>
</template>
