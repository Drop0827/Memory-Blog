<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores'
import {
  getArticleList,
  getCategoryList,
  getTagList,
  getSwiperList,
  getAuthorInfo,
  getRecordList,
  getCategoryArticleCount,
  getTagArticleCount,
  getRandomArticles,
} from '@/api'
import type { Article } from '@/types/app/article'
import type { Cate } from '@/types/app/cate'
import type { Tag } from '@/types/app/tag'
import type { Swiper } from '@/types/app/swiper'
import type { User } from '@/types/app/user'
import type { Record as RecordType } from '@/types/app/record'

import Starry from '@/components/Starry/index.vue'
import Typed from '@/components/Typed/index.vue'
import AppSwiper from '@/components/Swiper/index.vue'
import Waves from '@/components/Waves/index.vue'
import AppNavbar from '@/components/Layout/AppNavbar.vue'
import AppSidebar from '@/components/Layout/AppSidebar.vue'
import Pagination from '@/components/Pagination/index.vue'
import AstronautImg from '@/assets/image/astronaut.png'

// 图床链接
const BgImg = ref('https://bu.dusays.com/2026/02/04/698346b1404a4.jpg') // 2.jpg

// 数据状态
const loading = ref(true)

const articles = ref<Article[]>([])
const categories = ref<Cate[]>([])
const tags = ref<Tag[]>([])
const swipers = ref<Swiper[]>([])
const author = ref<User | null>(null)
const latestRecord = ref<RecordType | null>(null) // 最新闪念

// 分页
const page = ref(1)
const size = ref(6)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / size.value))

// 筛选状态
const selectedCateId = ref<number | null>(null)
const selectedTagId = ref<number | null>(null)
const filterTitle = ref<string>('') // 显示当前筛选的名称

// 分类和标签的文章数量统计（用名称作为键，因为 API 返回的可能没有 id）
const categoryArticleCounts = ref<Record<string, number>>({})
const tagArticleCounts = ref<Record<string, number>>({})

// 打字机文本
const typedStrings = ref([
  'System.out.println("Keep Hungry, Keep Foolish.");',
  'printf("Code creates the world.");',
  'console.log("To be a better man.");',
])

const configStore = useConfigStore()
const { theme } = storeToRefs(configStore)

// 监听主题配置变化
watch(
  theme,
  (newTheme) => {
    if (newTheme) {
      if (newTheme.swiper_text && newTheme.swiper_text.length > 0) {
        typedStrings.value = newTheme.swiper_text
      }
      if (newTheme.swiper_image) {
        BgImg.value = newTheme.swiper_image
      }
    }
  },
  { deep: true, immediate: true },
)

// 加载数据
const router = useRouter()

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

    // 1. 先获取基础配置数据（分类、标签、作者等）
    const [categoriesRes, tagsRes, swipersRes, authorRes, recordsRes, cateCountRes, tagCountRes] =
      await Promise.all([
        getCategoryList('recursion'),
        getTagList(),
        getSwiperList(),
        getAuthorInfo(),
        getRecordList({}),
        getCategoryArticleCount(),
        getTagArticleCount(),
      ])

    categories.value = categoriesRes.data || []
    tags.value = tagsRes.data || []
    swipers.value = (swipersRes.data || []) as any // 如果 swipersRes 是空的，后续会被覆盖
    author.value = authorRes.data || null

    author.value = authorRes.data || null

    // 2. 确定文章查询参数
    let querySize = size.value
    let targetCateId = selectedCateId.value
    let randomArticlesFn = null

    // 如果是首页（无筛选）
    if (!targetCateId && !selectedTagId.value) {
      // 首页展示全量文章，但也混入随机推荐
      // 首页展示 6 篇：假设 4 篇列表文章 + 2 篇随机
      querySize = Math.max(1, size.value - 2)
      // 准备获取随机文章
      randomArticlesFn = getRandomArticles(2)
    }

    // 3. 获取文章列表和随机文章
    const [articlesRes, randomRes] = await Promise.all([
      getArticleList({
        page: page.value,
        size: querySize,
        isDraft: 0,
        isDel: 0,
        cateId: targetCateId || undefined, // 只有当用户点击了侧边栏筛选时才传 ID
        tagId: selectedTagId.value || undefined,
      }),
      randomArticlesFn ? randomArticlesFn : Promise.resolve({ data: [] }),
    ])

    let articleData = articlesRes.data
    let currentArticles = articleData.result || []

    // 4. 如果有随机文章，混合进去
    if (randomRes && randomRes.data && randomRes.data.length > 0) {
      const randoms = randomRes.data
      const firstRandom = randoms[0]
      const secondRandom = randoms[1]

      // 简单插入：插在第2个和第4个位置
      if (currentArticles.length > 0 && firstRandom) {
        currentArticles.splice(1, 0, firstRandom)
      }

      if (secondRandom) {
        if (currentArticles.length > 3) {
          currentArticles.splice(3, 0, secondRandom)
        } else {
          currentArticles.push(secondRandom)
        }
      }
    }

    articles.value = currentArticles
    total.value = articleData.total || 0 // 注意：总数这里可能不准确了，因为混合了随机文章，但在首页展示中通常可以接受

    // 处理分类文章数量统计（用名称作为键）
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

    // 处理标签文章数量统计（用名称作为键）
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

    // 获取最新的一条闪念
    const records = recordsRes.data || []
    if (records.length > 0) {
      // 按创建时间降序排序，获取最新的一条
      const sortedRecords = records.sort(
        (a: RecordType, b: RecordType) =>
          new Date(b.createTime || 0).getTime() - new Date(a.createTime || 0).getTime(),
      )
      latestRecord.value = sortedRecords[0] || null
    }
  } catch (err) {
    console.error('Data load failed:', err)
  } finally {
    loading.value = false
  }
}

const changePage = (p: number) => {
  if (p < 1 || p > totalPages.value) return
  page.value = p
  loadData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 按分类筛选文章
const filterByCategory = (cateId: number, cateName: string) => {
  selectedCateId.value = cateId
  selectedTagId.value = null
  filterTitle.value = cateName
  page.value = 1
  loadData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 按标签筛选文章
const filterByTag = (tagId: number, tagName: string) => {
  selectedTagId.value = tagId
  selectedCateId.value = null
  filterTitle.value = tagName
  page.value = 1
  loadData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 清除筛选
const clearFilter = () => {
  selectedCateId.value = null
  selectedTagId.value = null
  filterTitle.value = ''
  page.value = 1
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div
    class="home-view min-h-screen bg-gray-50 dark:bg-[#1a1b26] text-gray-900 dark:text-[#c0caf5] font-sans transition-colors duration-300 selection:bg-blue-500 selection:text-white"
  >
    <!-- 1. 全局星空背景 -->
    <Starry />

    <!-- 2. 顶部导航栏 (使用通用组件, 开启透明) -->
    <AppNavbar :transparent="true" />

    <!-- 3. 首页静态 Hero 区域 (大背景图 + 打字机) -->
    <!-- 3. 首页静态 Hero 区域 (大背景图 + 打字机) -->
    <div class="relative w-full h-[400px] overflow-hidden group">
      <!-- 静态背景图 -->
      <img
        :src="BgImg"
        class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[3s] group-hover:scale-105"
        alt="Hero Background"
      />

      <!-- 遮罩与内容 -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 flex flex-col items-center justify-center text-white"
      >
        <h1
          class="text-4xl md:text-6xl font-bold mb-8 tracking-wider drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] animate-fade-in-up"
        >
          Memory Blog
        </h1>

        <!-- 打字机效果 -->
        <div
          class="flex items-center justify-center gap-3 text-lg md:text-2xl font-mono text-white animate-fade-in-up delay-100"
        >
          <Typed
            :strings="typedStrings"
            :typeSpeed="80"
            :backSpeed="50"
            :loop="true"
            className="font-bold drop-shadow-md"
          />
        </div>
      </div>

      <!-- 底部动态波浪 -->
      <div class="absolute bottom-0 left-0 w-full z-20 overflow-hidden leading-[0]">
        <Waves />
      </div>

      <!-- 向下滚动提示 -->
      <div
        class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50 z-30 hidden md:block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>

    <!-- 4. 内容区 -->
    <div class="container mx-auto px-4 lg:px-8 max-w-[1250px] py-12 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- 左侧 (占 9 列) -->
        <main class="lg:col-span-9 space-y-8">
          <!-- 轮播图 (作为内容的一部分展示) -->
          <div
            v-if="swipers.length"
            class="animate-fade-in-up shadow-2xl rounded-2xl overflow-hidden border border-white/20"
          >
            <AppSwiper :data="swipers" />
          </div>

          <!-- 最新动态横幅 -->
          <router-link v-if="latestRecord" to="/moments" class="block mt-6 group">
            <div
              class="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-700/30 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-600/50"
            >
              <!-- 星标图标 -->
              <span class="text-xl flex-shrink-0">⭐</span>
              <!-- 标签 -->
              <span
                class="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded flex-shrink-0"
              >
                最新动态
              </span>
              <!-- 内容 -->
              <span
                class="text-sm text-gray-700 dark:text-gray-300 truncate flex-1 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors"
              >
                {{ latestRecord.content }}
              </span>
              <!-- 箭头 -->
              <svg
                class="w-4 h-4 text-amber-500 flex-shrink-0 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          </router-link>

          <!-- 筛选提示 -->
          <div
            v-if="filterTitle && !loading"
            class="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl px-5 py-3 mt-6"
          >
            <div class="flex items-center gap-2">
              <span class="text-blue-600 dark:text-blue-400">🔍</span>
              <span class="text-sm text-blue-700 dark:text-blue-300">
                当前筛选：<strong>{{ filterTitle }}</strong>
              </span>
              <span class="text-xs text-blue-500 dark:text-blue-400"> 共 {{ total }} 篇文章 </span>
            </div>
            <button
              @click="clearFilter"
              class="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-800/50 hover:bg-blue-200 dark:hover:bg-blue-700/50 text-blue-600 dark:text-blue-300 rounded-lg transition-colors"
            >
              清除筛选
            </button>
          </div>

          <div v-if="loading" class="text-center py-20 text-gray-500 animate-pulse">
            正在加载精彩内容...
          </div>

          <!-- 文章卡片列表 -->
          <div v-else class="space-y-6">
            <article
              v-for="(article, index) in articles"
              :key="article.id"
              class="group relative bg-white/80 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row h-auto md:h-64"
            >
              <!-- 封面图 -->
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
                    v-for="cate in article.cateList"
                    :key="cate.id"
                    class="px-3 py-1 text-xs font-bold bg-blue-600/90 text-white rounded-lg backdrop-blur-sm shadow-lg"
                  >
                    {{ cate.name }}
                  </span>
                </div>
              </div>

              <!-- 内容 -->
              <div class="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3"
                  >
                    <span class="flex items-center gap-1"
                      >📅 {{ new Date(Number(article.createTime)).toLocaleDateString() }}</span
                    >
                    <span class="flex items-center gap-1">👀 {{ article.view }}</span>
                    <span class="flex items-center gap-1">💬 {{ article.comment }}</span>
                  </div>
                  <h3
                    class="text-lg font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-500 transition-colors line-clamp-2 cursor-pointer"
                    @click="viewArticle(article.id)"
                  >
                    {{ article.title }}
                  </h3>
                  <p
                    class="text-gray-600 dark:text-gray-400 text-[13px] leading-relaxed line-clamp-3 mb-4"
                  >
                    {{ article.description || '暂无描述...' }}
                  </p>
                </div>

                <div class="flex items-center justify-between mt-auto">
                  <div class="flex gap-2">
                    <span
                      v-for="tag in article.tagList"
                      :key="tag.id"
                      class="text-xs text-blue-500/80 dark:text-blue-300/80"
                      >#{{ tag.name }}</span
                    >
                  </div>
                  <button
                    @click.stop="viewArticle(article.id)"
                    class="px-4 py-1.5 text-xs font-bold bg-blue-50 dark:bg-transparent border border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
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
            className="mt-12"
          />
        </main>

        <!-- 右侧边栏 (占 3 列) -->
        <aside class="lg:col-span-3">
          <!-- 复用通用侧边栏 -->
          <AppSidebar
            :author="author"
            :categories="categories"
            :tags="tags"
            :category-article-counts="categoryArticleCounts"
            :tag-article-counts="tagArticleCounts"
            :selected-cate-id="selectedCateId"
            :selected-tag-id="selectedTagId"
            @filter-category="filterByCategory"
            @filter-tag="filterByTag"
            @clear-filter="clearFilter"
          />
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
