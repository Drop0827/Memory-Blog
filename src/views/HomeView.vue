<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { getArticleList, getCategoryList, getTagList, getSwiperList, getAuthorInfo } from '@/api'
import type { Article } from '@/types/app/article'
import type { Cate } from '@/types/app/cate'
import type { Tag } from '@/types/app/tag'
import type { Swiper } from '@/types/app/swiper'
import type { User } from '@/types/app/user'

import Starry from '@/components/Starry/index.vue'
import Typed from '@/components/Typed/index.vue'
import AppSwiper from '@/components/Swiper/index.vue'
import AppNavbar from '@/components/Layout/AppNavbar.vue'
import AppSidebar from '@/components/Layout/AppSidebar.vue'

// 数据状态
const loading = ref(true)
const articles = ref<Article[]>([])
const categories = ref<Cate[]>([])
const tags = ref<Tag[]>([])
const swipers = ref<Swiper[]>([])
const author = ref<User | null>(null)

// 分页
const page = ref(1)
const size = ref(10)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / size.value))

// 打字机文本
const typedStrings = ref([
  'Keep Hungry, Keep Foolish.',
  'Code creates the world.',
  'To be a better man.',
])

// 加载数据
const loadData = async () => {
  try {
    loading.value = true

    const [articlesRes, categoriesRes, tagsRes, swipersRes, authorRes] = await Promise.all([
      getArticleList({ page: page.value, size: size.value, isDraft: 0, isDel: 0 }),
      getCategoryList('recursion'),
      getTagList(),
      getSwiperList(),
      getAuthorInfo(),
    ])

    const articleData = articlesRes.data
    articles.value = articleData.result || []
    total.value = articleData.total || 0

    categories.value = categoriesRes.data || []
    tags.value = tagsRes.data || []
    swipers.value = swipersRes.data || []
    author.value = authorRes.data || null
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

onMounted(() => {
  loadData()
})
</script>

<template>
  <div
    class="home-view min-h-screen bg-gray-50 dark:bg-[#0d1320] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 selection:bg-blue-500 selection:text-white"
  >
    <!-- 1. 全局星空背景 -->
    <Starry />

    <!-- 2. 顶部导航栏 (使用通用组件, 开启透明) -->
    <AppNavbar :transparent="true" />

    <!-- 3. 首页静态 Hero 区域 (大背景图 + 打字机) -->
    <div class="relative w-full h-[550px] overflow-hidden group">
      <!-- 静态背景图 -->
      <img
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
        class="w-full h-full object-cover object-center transition-transform duration-[3s] group-hover:scale-105"
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
          class="flex items-center gap-3 text-lg md:text-2xl font-mono bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 shadow-2xl animate-fade-in-up delay-100"
        >
          <span class="animate-pulse">🚀</span>
          <span class="text-gray-200">Welcome:</span>
          <Typed
            :strings="typedStrings"
            :typeSpeed="80"
            :backSpeed="50"
            :loop="true"
            className="font-bold text-blue-300"
          />
        </div>

        <!-- 向下滚动提示 -->
        <div class="absolute bottom-8 animate-bounce text-white/50">
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
    </div>

    <!-- 4. 内容区 -->
    <div class="container mx-auto px-4 lg:px-12 xl:px-32 max-w-7xl py-12 relative z-10">
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
          <!-- 文章列表标题 -->
          <div
            class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700/50 pb-4 mb-8 mt-12"
          >
            <h2 class="text-2xl font-bold flex items-center gap-2">
              <span class="text-3xl">📝</span> 最新文章
            </h2>
            <span class="text-gray-400 text-sm">共 {{ total }} 篇</span>
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
                    class="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-500 transition-colors line-clamp-2"
                  >
                    {{ article.title }}
                  </h3>
                  <p
                    class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4"
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
                    class="px-4 py-1.5 text-xs font-bold bg-blue-50 dark:bg-transparent border border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                  >
                    阅读全文
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- 分页 -->
          <div v-if="totalPages > 1" class="flex justify-center mt-12 gap-2">
            <button
              @click="changePage(page - 1)"
              :disabled="page === 1"
              class="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
            >
              上一页
            </button>
            <span class="px-4 py-2 text-blue-500 font-bold">{{ page }} / {{ totalPages }}</span>
            <button
              @click="changePage(page + 1)"
              :disabled="page === totalPages"
              class="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
            >
              下一页
            </button>
          </div>
        </main>

        <!-- 右侧边栏 (占 3 列) -->
        <aside class="lg:col-span-3">
          <!-- 复用通用侧边栏 -->
          <AppSidebar :author="author" :categories="categories" :tags="tags" />
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
</style>
