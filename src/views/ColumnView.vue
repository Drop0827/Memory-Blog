<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleList, getCategoryList, getTagList, getAuthorInfo } from '@/api'
import type { Article } from '@/types/app/article'
import type { Cate } from '@/types/app/cate'
import type { Tag } from '@/types/app/tag'
import type { User } from '@/types/app/user'

import Starry from '@/components/Starry/index.vue'
import AppNavbar from '@/components/Layout/AppNavbar.vue'
import AppSidebar from '@/components/Layout/AppSidebar.vue'

// Props, allowing this view to be reused with different configurations
const props = defineProps<{
  title: string
  subtitle?: string
  categoryId?: string // 如果有真实ID
  categoryType?: string
  coverImage?: string
}>()

const route = useRoute()

// Data State
const loading = ref(true)
const articles = ref<Article[]>([])
const categories = ref<Cate[]>([])
const tags = ref<Tag[]>([])
const author = ref<User | null>(null)
const total = ref(0)
const page = ref(1)
const size = ref(10)

const loadData = async () => {
  try {
    loading.value = true

    // 模拟筛选：真实情况应该传 categoryId 给后端
    // 这里暂时请求所有文章
    const [articlesRes, categoriesRes, tagsRes, authorRes] = await Promise.all([
      getArticleList({ page: page.value, size: size.value, isDraft: 0, isDel: 0 }),
      getCategoryList('recursion'),
      getTagList(),
      getAuthorInfo(),
    ])

    const articleData = articlesRes.data
    articles.value = articleData.result || []
    total.value = articleData.total || 0

    categories.value = categoriesRes.data || []
    tags.value = tagsRes.data || []
    author.value = authorRes.data || null
  } catch (err) {
    console.error('Failed to load data', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

watch(
  () => route.path,
  () => {
    loadData()
  },
)
</script>

<template>
  <div
    class="column-view min-h-screen bg-gray-50 dark:bg-[#0d1320] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300"
  >
    <Starry />
    <AppNavbar :transparent="true" />

    <!-- Huge Banner Header -->
    <div class="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <img
        :src="
          coverImage ||
          'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2574&auto=format&fit=crop'
        "
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center"
      >
        <h1 class="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg tracking-wider">
          {{ title }}
        </h1>
        <p class="text-lg md:text-xl opacity-90 drop-shadow-md">
          该分类：{{ title }} ~ 共计 {{ total }} 篇文章
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 lg:px-12 xl:px-32 max-w-7xl py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Main List -->
        <main class="lg:col-span-9 space-y-6">
          <div v-if="loading" class="text-center py-20 opacity-60">加载中...</div>
          <div v-else class="space-y-6">
            <!-- Article Card (Same as Home) -->
            <article
              v-for="(article, index) in articles"
              :key="article.id"
              class="group relative bg-white/80 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row h-auto md:h-64"
            >
              <!-- Cover -->
              <div class="w-full md:w-2/5 h-48 md:h-full overflow-hidden relative">
                <img
                  :src="
                    article.cover ||
                    'https://images.unsplash.com/photo-1499750310159-5b5f2269a2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                  "
                  class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span
                    class="px-3 py-1 text-xs font-bold bg-blue-600/90 text-white rounded-lg backdrop-blur-sm shadow-lg"
                  >
                    {{ title }}
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3"
                  >
                    <span>📅 {{ new Date(Number(article.createTime)).toLocaleDateString() }}</span>
                    <span>👀 {{ article.view }}</span>
                  </div>
                  <h3
                    class="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors line-clamp-2"
                  >
                    {{ article.title }}
                  </h3>
                  <p
                    class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-4"
                  >
                    {{ article.description }}
                  </p>
                </div>

                <div class="flex items-center justify-end mt-auto">
                  <button
                    class="px-5 py-2 text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                  >
                    阅读全文
                  </button>
                </div>
              </div>
            </article>
          </div>
        </main>

        <!-- Sidebar -->
        <aside class="lg:col-span-3">
          <AppSidebar :author="author" :categories="categories" :tags="tags" />
        </aside>
      </div>
    </div>
  </div>
</template>
