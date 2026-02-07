<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  getArticleList,
  getCategoryList,
  getTagList,
  getAuthorInfo,
  getCategoryArticleCount,
  getTagArticleCount,
} from '@/api'
import type { Article } from '@/types/app/article'
import type { Cate } from '@/types/app/cate'
import type { Tag } from '@/types/app/tag'
import type { User } from '@/types/app/user'

import Starry from '@/components/Starry/index.vue'
import AppNavbar from '@/components/Layout/AppNavbar.vue'
import AppSidebar from '@/components/Layout/AppSidebar.vue'
import Pagination from '@/components/Pagination/index.vue'

// Configure for this specific view (University)
const PAGE_TITLE = '大学生活'
const PAGE_COVER = 'https://bu.dusays.com/2026/02/04/698346b17d6e5.jpg'

const router = useRouter()
const loading = ref(true)
const articles = ref<Article[]>([])
const categories = ref<Cate[]>([])
const tags = ref<Tag[]>([])
const author = ref<User | null>(null)
const categoryArticleCounts = ref<Record<string, number>>({})
const tagArticleCounts = ref<Record<string, number>>({})

const page = ref(1)
const size = ref(6)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / size.value))

const selectedCateId = ref<number | null>(null)

const viewArticle = (id?: number) => {
  if (!id) return
  router.push({ name: 'article', params: { id } })
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  loadData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const loadData = async () => {
  try {
    loading.value = true

    // 1. Fetch metadata
    const [categoriesRes, tagsRes, authorRes, cateCountRes, tagCountRes] = await Promise.all([
      getCategoryList('recursion'),
      getTagList(),
      getAuthorInfo(),
      getCategoryArticleCount(),
      getTagArticleCount(),
    ])

    const categoryList = categoriesRes.data || []
    categories.value = categoryList
    tags.value = tagsRes.data || []
    author.value = authorRes.data || null

    if (cateCountRes.data && Array.isArray(cateCountRes.data)) {
      cateCountRes.data.forEach((item: any) => {
        if (item.name) categoryArticleCounts.value[item.name] = item.count || 0
      })
    }

    if (tagCountRes.data && Array.isArray(tagCountRes.data)) {
      tagCountRes.data.forEach((item: any) => {
        if (item.name) tagArticleCounts.value[item.name] = item.count || 0
      })
    }

    // 2. Identify Target Category ID
    const targetCate = categoryList.find((c) => c.name === PAGE_TITLE)
    const targetCateId = targetCate ? targetCate.id : null

    if (targetCateId) {
      selectedCateId.value = targetCateId

      const articlesRes = await getArticleList({
        page: page.value,
        size: size.value,
        isDraft: 0,
        isDel: 0,
        cateId: targetCateId,
      })

      const articleData = articlesRes.data
      articles.value = articleData.result || []
      total.value = articleData.total || 0
    } else {
      loading.value = false
      articles.value = []
    }
  } catch (err) {
    console.error('Failed to load data', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div
    class="university-view min-h-screen bg-gray-50 dark:bg-[#1a1b26] text-gray-900 dark:text-[#c0caf5] font-sans transition-colors duration-300"
  >
    <Starry />
    <AppNavbar :transparent="true" />

    <!-- Header Banner -->
    <div class="relative w-full h-[400px] overflow-hidden">
      <img :src="PAGE_COVER" class="w-full h-full object-cover" />
      <div
        class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center"
      >
        <h1 class="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg tracking-wider">
          {{ PAGE_TITLE }}
        </h1>
        <p class="text-lg md:text-xl opacity-90 drop-shadow-md">
          该分类：{{ PAGE_TITLE }} ~ 共计 {{ total }} 篇文章
        </p>
      </div>
      <div
        class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 dark:from-[#1a1b26] to-transparent z-10 pointer-events-none"
      ></div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 lg:px-8 max-w-[1250px] py-12 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Main List -->
        <main class="lg:col-span-9 space-y-6">
          <div v-if="loading" class="text-center py-20 opacity-60">加载中...</div>
          <div v-else-if="articles.length === 0" class="text-center py-20 opacity-60">暂无文章</div>
          <div v-else class="space-y-6">
            <article
              v-for="article in articles"
              :key="article.id"
              class="group relative bg-white/80 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row h-auto md:h-64"
            >
              <!-- Cover -->
              <div
                class="w-full md:w-2/5 h-48 md:h-full overflow-hidden relative cursor-pointer"
                @click="viewArticle(article.id)"
              >
                <img
                  :src="
                    article.cover ||
                    'https://images.unsplash.com/photo-1499750310159-5b5f2269a2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                  "
                  class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span
                    class="px-3 py-1 text-xs font-bold bg-purple-500/90 text-white rounded-lg backdrop-blur-sm shadow-lg"
                  >
                    {{ article.cateList?.[0]?.name || '大学生活' }}
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
                    class="text-lg font-bold mb-3 group-hover:text-purple-500 transition-colors line-clamp-2 cursor-pointer"
                    @click="viewArticle(article.id)"
                  >
                    {{ article.title }}
                  </h3>
                  <p
                    class="text-gray-600 dark:text-gray-400 text-[13px] leading-relaxed line-clamp-2 md:line-clamp-3 mb-4"
                  >
                    {{ article.description }}
                  </p>
                </div>
                <div class="flex items-center justify-end mt-auto">
                  <button
                    @click.stop="viewArticle(article.id)"
                    class="px-5 py-2 text-xs font-bold bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-all"
                  >
                    阅读全文
                  </button>
                </div>
              </div>
            </article>
          </div>

          <Pagination
            v-if="totalPages > 1"
            :page="page"
            :total="totalPages"
            :customHandler="true"
            @change="handlePageChange"
            className="mt-10"
          />
        </main>

        <!-- Sidebar -->
        <aside class="lg:col-span-3">
          <AppSidebar
            :author="author"
            :categories="categories"
            :tags="tags"
            :category-article-counts="categoryArticleCounts"
            :tag-article-counts="tagArticleCounts"
          />
        </aside>
      </div>
    </div>
  </div>
</template>
