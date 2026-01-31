<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getCommentPaging } from '@/api'
import RandomAvatar from '@/components/RandomAvatar/index.vue'
import NewCommentSvg from '@/assets/svg/other/comments.svg'
import type { Comment } from '@/types/app/comment'
import dayjs from 'dayjs'

const list = ref<Comment[]>([])

const loadComments = async () => {
  try {
    const res = await getCommentPaging({ page: 1, size: 5 }) // Defaulting size based on UI, maybe 5-10
    if (res.data && res.data.result) {
      list.value = res.data.result
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadComments()
})

const formatDate = (date: any) => {
  return dayjs(+date).format('YYYY-MM-DD HH:mm')
}
</script>

<template>
  <div
    class="flex flex-col tw_container bg-white dark:bg-black-b p-4 mb-5 tw_title rounded-xl shadow-sm"
  >
    <div class="tw_title w-full dark:text-white flex items-center">
      <img :src="NewCommentSvg" alt="最新评论" width="33" height="23" />
      <span class="ml-2 font-bold">最新评论</span>
    </div>

    <div class="mt-2.5">
      <RouterLink
        v-for="item in list"
        :key="item.id"
        :to="`/article/${item.articleId}`"
        target="_blank"
        class="group flex items-center py-2.5 border-b border-gray-100 dark:border-white/5 last:border-b-0"
      >
        <img
          v-if="item.avatar"
          :src="item.avatar"
          class="w-11 h-11 rounded-full mr-2.5 transition-transform hover:scale-110 object-cover"
          alt="avatar"
        />
        <RandomAvatar
          v-else
          className="w-11 h-11 rounded-full mr-2.5 transition-transform hover:scale-110"
        />

        <div class="flex flex-col justify-center flex-1 min-w-0">
          <div
            class="w-full text-sm text-gray-600 dark:text-[#8c9ab1] group-hover:text-blue-500 overflow-hidden line-clamp-2 transition-colors"
          >
            {{ item.content }}
          </div>
          <div class="pt-2.5 text-xs text-gray-400">
            {{ formatDate(item.createTime) }}
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
