<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticleList, getCategoryList, getTagList, getSwiperList, getAuthorInfo } from '@/api'
import type { Article } from '@/types/app/article'
import type { Cate } from '@/types/app/cate'
import type { Tag } from '@/types/app/tag'
import type { Swiper } from '@/types/app/swiper'
import type { User } from '@/types/app/user'

// 数据状态
const loading = ref(true)
const articles = ref<Article[]>([])
const categories = ref<Cate[]>([])
const tags = ref<Tag[]>([])
const swipers = ref<Swiper[]>([])
const author = ref<User | null>(null)
const error = ref<string>('')

// 分页状态
const page = ref(1)
const size = ref(10)
const total = ref(0)

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    error.value = ''

    // 并行加载所有数据
    const [articlesRes, categoriesRes, tagsRes, swipersRes, authorRes] = await Promise.all([
      getArticleList({ page: page.value, size: size.value, isDraft: 0, isDel: 0 }),
      getCategoryList('recursion'),
      getTagList(),
      getSwiperList(),
      getAuthorInfo(),
    ])

    // 设置数据（兼容 null 数据为空数组）
    if (articlesRes.data) {
      articles.value = articlesRes.data.result || []
      total.value = articlesRes.data.total || 0
    }

    categories.value = Array.isArray(categoriesRes?.data) ? categoriesRes.data : []
    tags.value = Array.isArray(tagsRes?.data) ? tagsRes.data : []
    swipers.value = Array.isArray(swipersRes?.data) ? swipersRes.data : []
    author.value = authorRes.data || null
  } catch (err: any) {
    error.value = err.message || '数据加载失败'
    console.error('加载数据失败：', err)
  } finally {
    loading.value = false
  }
}

// 切换页码
const changePage = (newPage: number) => {
  page.value = newPage
  loadData()
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
    <!-- 顶部导航 -->
    <header class="bg-black/30 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-10">
      <div class="container mx-auto px-6 py-4">
        <h1
          class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Memory Blog
        </h1>
        <p class="text-gray-400 text-sm mt-1">基于后端 API 的博客前端</p>
      </div>
    </header>

    <div class="container mx-auto px-6 py-10">
      <!-- 作者信息卡片 -->
      <div
        v-if="author"
        class="mb-10 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm"
      >
        <div class="flex items-center gap-4">
          <img
            :src="author.avatar || '/default-avatar.png'"
            :alt="author.name"
            class="w-16 h-16 rounded-full border-2 border-purple-400"
          />
          <div>
            <h2 class="text-2xl font-bold">{{ author.name }}</h2>
            <p class="text-gray-300 mt-1">{{ author.info }}</p>
            <div class="flex gap-4 mt-2 text-sm text-gray-400">
              <span v-if="author.email">📧 {{ author.email }}</span>
              <span v-if="author.username">👤 {{ author.username }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-pulse text-blue-400 text-xl">正在加载数据...</div>
      </div>

      <!-- 错误提示 -->
      <div
        v-else-if="error"
        class="bg-red-900/30 border border-red-500/50 rounded-xl p-6 text-center"
      >
        <p class="text-red-300 text-lg">❌ {{ error }}</p>
        <button
          @click="loadData"
          class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          重新加载
        </button>
      </div>

      <!-- 主要内容 -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 左侧内容区 -->
        <div class="lg:col-span-3 space-y-8">
          <!-- 轮播图 -->
          <section v-if="swipers.length > 0" class="mb-8">
            <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span class="text-3xl">🎨</span>
              推荐内容
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="swiper in swipers.slice(0, 2)"
                :key="swiper.id"
                class="relative group overflow-hidden rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition"
              >
                <img
                  :src="swiper.image"
                  :alt="swiper.title"
                  class="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                />
                <div
                  class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
                >
                  <h4 class="text-lg font-semibold">{{ swiper.title }}</h4>
                  <p v-if="swiper.description" class="text-sm text-gray-300 mt-1">
                    {{ swiper.description }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- 文章列表 -->
          <section>
            <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span class="text-3xl">📝</span>
              最新文章
              <span class="text-sm font-normal text-gray-400">(共 {{ total }} 篇)</span>
            </h3>

            <div v-if="articles.length === 0" class="text-center py-12 text-gray-400">暂无文章</div>

            <div v-else class="space-y-4">
              <article
                v-for="article in articles"
                :key="article.id"
                class="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition group"
              >
                <div class="flex gap-4">
                  <!-- 文章封面 -->
                  <div v-if="article.cover" class="flex-shrink-0">
                    <img
                      :src="article.cover"
                      :alt="article.title"
                      class="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>

                  <!-- 文章信息 -->
                  <div class="flex-1">
                    <h4 class="text-xl font-bold group-hover:text-blue-400 transition">
                      {{ article.title }}
                    </h4>

                    <p v-if="article.description" class="text-gray-400 mt-2 line-clamp-2">
                      {{ article.description }}
                    </p>

                    <!-- 分类和标签 -->
                    <div class="flex flex-wrap gap-2 mt-3">
                      <span
                        v-for="cate in article.cateList?.slice(0, 3)"
                        :key="cate.id"
                        class="px-3 py-1 text-xs bg-purple-900/30 text-purple-300 rounded-full border border-purple-500/30"
                      >
                        {{ cate.name }}
                      </span>
                      <span
                        v-for="tag in article.tagList?.slice(0, 3)"
                        :key="tag.id"
                        class="px-3 py-1 text-xs bg-blue-900/30 text-blue-300 rounded-full border border-blue-500/30"
                      >
                        # {{ tag.name }}
                      </span>
                    </div>

                    <!-- 底部信息 -->
                    <div class="flex items-center gap-4 mt-4 text-sm text-gray-400">
                      <span
                        >📅 {{ new Date(Number(article.createTime)).toLocaleDateString() }}</span
                      >
                      <span v-if="article.view">👀 {{ article.view }} 次阅读</span>
                      <span v-if="article.comment">💬 {{ article.comment }} 条评论</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <!-- 分页 -->
            <div v-if="total > size" class="mt-8 flex justify-center gap-2">
              <button
                v-for="p in Math.ceil(total / size)"
                :key="p"
                @click="changePage(p)"
                class="px-4 py-2 rounded-lg transition"
                :class="
                  p === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                "
              >
                {{ p }}
              </button>
            </div>
          </section>
        </div>

        <!-- 右侧边栏 -->
        <aside class="space-y-6">
          <!-- 分类列表 -->
          <section class="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
              <span class="text-2xl">📚</span>
              分类
            </h3>
            <div v-if="categories.length === 0" class="text-gray-400 text-sm">暂无分类</div>
            <ul v-else class="space-y-2">
              <li
                v-for="cate in categories.slice(0, 10)"
                :key="cate.id"
                class="flex items-center justify-between p-2 rounded hover:bg-gray-700/50 transition cursor-pointer"
              >
                <span class="flex items-center gap-2">
                  <span v-if="cate.icon">{{ cate.icon }}</span>
                  {{ cate.name }}
                </span>
                <span v-if="cate.children?.length" class="text-xs text-gray-500">
                  {{ cate.children.length }}
                </span>
              </li>
            </ul>
          </section>

          <!-- 标签云 -->
          <section class="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
              <span class="text-2xl">🏷️</span>
              标签
            </h3>
            <div v-if="tags.length === 0" class="text-gray-400 text-sm">暂无标签</div>
            <div v-else class="flex flex-wrap gap-2">
              <span
                v-for="tag in tags.slice(0, 20)"
                :key="tag.id"
                class="px-3 py-1 text-sm bg-blue-900/20 text-blue-300 rounded-full border border-blue-500/30 hover:bg-blue-900/40 transition cursor-pointer"
              >
                {{ tag.name }}
                <span v-if="tag.count" class="ml-1 text-xs text-gray-500">({{ tag.count }})</span>
              </span>
            </div>
          </section>

          <!-- API 状态 -->
          <section class="p-6 bg-green-900/20 rounded-xl border border-green-500/30">
            <h3 class="text-xl font-bold mb-2 text-green-400">✅ API 连接成功</h3>
            <p class="text-sm text-gray-300">成功连接到后端 API</p>
            <div class="mt-4 text-xs text-gray-400 space-y-1">
              <div>• 文章数量: {{ total }}</div>
              <div>• 分类数量: {{ categories.length }}</div>
              <div>• 标签数量: {{ tags.length }}</div>
              <div>• 轮播图: {{ swipers.length }}</div>
            </div>
          </section>
        </aside>
      </div>
    </div>

    <!-- 底部 -->
    <footer class="mt-20 py-8 border-t border-gray-700/50 text-center text-gray-400">
      <p class="text-sm">Powered by Memory Blog | Vue 3 + Spring Boot 3</p>
      <p class="text-xs mt-2">
        API 文档请查看项目根目录的 <code class="text-blue-400">API使用文档.md</code>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
