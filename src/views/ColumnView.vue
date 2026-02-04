<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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

// Props, allowing this view to be reused with different configurations
const props = defineProps<{
  title: string
  subtitle?: string
  categoryId?: string // 如果有真实ID
  categoryType?: string
  coverImage?: string
}>()

const route = useRoute()
const router = useRouter()

// 文章详情页跳转
const viewArticle = (id?: number) => {
  if (!id) return
  router.push({ name: 'article', params: { id } })
}

// Data State
const loading = ref(true)
const articles = ref<Article[]>([])
const categories = ref<Cate[]>([])
const tags = ref<Tag[]>([])
const author = ref<User | null>(null)
const total = ref(0)
const page = ref(1)
const size = ref(6) // 用户要求每页 6 篇
const totalPages = computed(() => Math.ceil(total.value / size.value))

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    loadData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
    loadData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  loadData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 统计数据
const categoryArticleCounts = ref<Record<string, number>>({})
const tagArticleCounts = ref<Record<string, number>>({})

const loadData = async () => {
  try {
    loading.value = true

    // 1. 先获取分类列表、标签列表、作者信息、统计信息
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

    // 处理分类统计
    if (cateCountRes.data) {
      const counts: Record<string, number> = {}
      if (Array.isArray(cateCountRes.data)) {
        cateCountRes.data.forEach((item: { id?: number; name: string; count: number }) => {
          if (item.name) {
            counts[item.name] = item.count || 0
          }
        })
      }
      categoryArticleCounts.value = counts
    }

    // 处理标签统计
    if (tagCountRes.data) {
      const counts: Record<string, number> = {}
      if (Array.isArray(tagCountRes.data)) {
        tagCountRes.data.forEach((item: { id?: number; name: string; count: number }) => {
          if (item.name) {
            counts[item.name] = item.count || 0
          }
        })
      }
      tagArticleCounts.value = counts
    }

    // 2. 根据 props.title 查找对应的分类 ID
    const targetCate = categoryList.find((c) => c.name === props.title)
    const targetCateId = targetCate
      ? targetCate.id
      : props.categoryId
        ? Number(props.categoryId)
        : undefined

    if (targetCateId) {
      // 3. 带着分类 ID 获取文章列表
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
      // 如果没找到对应分类，不显示任何文章
      articles.value = []
      total.value = 0
      console.warn(`未找到分类 "${props.title}"，请确认后台是否存在该分类。`)
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

watch(
  () => route.path,
  () => {
    // 重置分页并重新加载
    page.value = 1
    loadData()
  },
)
</script>

<template>
  <div
    class="column-view min-h-screen bg-gray-50 dark:bg-[#1a1b26] text-gray-900 dark:text-[#c0caf5] font-sans transition-colors duration-300"
  >
    <Starry />
    <AppNavbar :transparent="true" />

    <!-- Huge Banner Header -->
    <div class="relative w-full h-[400px] overflow-hidden">
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

      <!-- 底部雾化过渡 -->
      <div
        class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 dark:from-[#1a1b26] to-transparent z-10 pointer-events-none"
      ></div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 lg:px-8 max-w-[1250px] py-12">
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
                    class="px-3 py-1 text-xs font-bold bg-blue-600/90 text-white rounded-lg backdrop-blur-sm shadow-lg"
                  >
                    {{ article.cateList?.[0]?.name || '默认分类' }}
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
                    class="text-lg font-bold mb-3 group-hover:text-blue-500 transition-colors line-clamp-2 cursor-pointer"
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
                    class="px-5 py-2 text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                  >
                    阅读全文
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- 分页 -->
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
