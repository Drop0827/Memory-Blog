<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores'
import { storeToRefs } from 'pinia'

import Author from './Author/index.vue'
import HotArticle from './HotArticle/index.vue'
import RandomArticle from './RandomArticle/index.vue'
import Comment from './Comment/index.vue'
import RunTime from './RunTime/index.vue'
import Study from './Study/index.vue'

const configStore = useConfigStore()
const { theme } = storeToRefs(configStore)

const sidebar = computed(() => theme.value?.right_sidebar || [])
</script>

<template>
  <div
    class="hidden lg:block rounded-md transition-width sticky top-[80px]"
    :class="sidebar.length ? 'lg:w-[29%] xl:w-[24%]' : 'w-0'"
    v-if="sidebar.length"
  >
    <!-- 作者介绍 -->
    <Author v-if="sidebar.includes('author')" />
    <!-- 站点已运行 -->
    <RunTime v-if="sidebar.includes('runTime')" />
    <!-- 随机推荐 -->
    <RandomArticle v-if="sidebar.includes('randomArticle')" />
    <!-- 热门文章 -->
    <HotArticle v-if="sidebar.includes('hotArticle')" />
    <!-- 最新评论 -->
    <Comment v-if="sidebar.includes('newComments')" />
    <!-- 装饰组件 -->
    <Study v-if="sidebar.includes('study')" />
  </div>
</template>
