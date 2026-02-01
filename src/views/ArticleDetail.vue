<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleDetail, recordArticleView } from '@/api'
import type { Article } from '@/types/app/article'
import AppNavbar from '@/components/Layout/AppNavbar.vue'
import AppSidebar from '@/components/Layout/AppSidebar.vue' // Reuse Sidebar if possible, or just build a simple layout
import Starry from '@/components/Starry/index.vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const route = useRoute()
const loading = ref(true)
const article = ref<Article | null>(null)
const previewId = 'article-preview'

// 简单的日期格式化
const formatDate = (ts: string) => {
  if (!ts) return ''
  return new Date(Number(ts)).toLocaleDateString() + ' ' + new Date(Number(ts)).toLocaleTimeString()
}

const windowLink = typeof window !== 'undefined' ? window.location.href : ''

const loadData = async () => {
  const id = Number(route.params.id)
  if (!id) return

  try {
    loading.value = true
    const { data } = await getArticleDetail(id)
    article.value = data

    // 记录阅读量
    recordArticleView(id)
  } catch (err) {
    console.error('Fetch article failed', err)
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
    class="article-detail-view min-h-screen bg-white dark:bg-[#0d1320] text-gray-900 dark:text-gray-100 font-sans"
  >
    <!-- 1. 全局星空背景 (保持) -->
    <Starry />

    <!-- 2. 顶部导航 -->
    <AppNavbar :transparent="true" />

    <!-- 3. 顶部 Header / Hero 区域 -->
    <div class="relative w-full h-[55vh] min-h-[400px] flex items-center justify-center">
      <!-- 背景图 -->
      <div class="absolute inset-0 z-0">
        <img
          :src="
            article?.cover ||
            'https://images.unsplash.com/photo-1499750310159-5b5f2269a2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
          "
          class="w-full h-full object-cover"
          alt="Page Header"
        />
        <!-- 遮罩层 - 加深以突出白字 -->
        <div class="absolute inset-0 bg-black/50"></div>
      </div>

      <!-- 文章标题信息 (居中显示) -->
      <div class="relative z-10 container mx-auto px-4 max-w-5xl text-center text-white">
        <h1 class="text-3xl md:text-5xl font-bold mb-8 leading-tight drop-shadow-lg tracking-wide">
          {{ article?.title }}
        </h1>

        <!-- Meta 信息栏 -->
        <div
          class="inline-flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm md:text-base bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 shadow-sm"
        >
          <!-- 分类 -->
          <div class="flex items-center gap-2">
            <span class="opacity-80">🌈 所属分类:</span>
            <span v-for="cate in article?.cateList" :key="cate.id" class="font-bold">
              {{ cate.name }}
            </span>
          </div>
          <div class="w-px h-4 bg-white/30 hidden md:block"></div>
          <!-- 阅读 -->
          <div class="flex items-center gap-2">
            <span class="opacity-80">🔥 阅读量:</span>
            <span class="font-bold">{{ article?.view }}</span>
          </div>
          <div class="w-px h-4 bg-white/30 hidden md:block"></div>
          <!-- 评论 -->
          <div class="flex items-center gap-2">
            <span class="opacity-80">💬 评论数:</span>
            <span class="font-bold">{{ article?.comment || 0 }}</span>
          </div>
          <div class="w-px h-4 bg-white/30 hidden md:block"></div>
          <!-- 时间 -->
          <div class="flex items-center gap-2">
            <span class="opacity-80">🕒 发布时间:</span>
            <span class="font-bold">{{ formatDate(article?.createTime || '') }}</span>
          </div>
        </div>
      </div>

      <!-- 波浪装饰 (可选) -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          class="relative block w-[calc(100%+1.3px)] h-[50px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            class="fill-gray-50 dark:fill-[#0d1320]"
          ></path>
        </svg>
      </div>
    </div>

    <!-- 4. 主要内容区域 -->
    <div class="container mx-auto px-4 max-w-[900px] relative z-20 pb-24 -mt-10">
      <!-- 加载中 -->
      <div
        v-if="loading"
        class="text-center py-20 animate-pulse text-gray-500 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
      >
        正在加载文章详情...
      </div>

      <div v-else-if="article">
        <!-- 卡片容器 -->
        <div
          class="bg-white dark:bg-[#1a202c] rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100 dark:border-gray-700/50"
        >
          <!-- 文章摘要 -->
          <div
            class="mb-10 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-5 relative"
          >
            <div class="flex items-start gap-3">
              <span class="text-2xl mt-1">📑</span>
              <div>
                <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-1 text-base">文章摘要</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-justify">
                  {{ article.description || '暂无摘要...' }}
                </p>
              </div>
            </div>
            <!-- AI Tag -->
            <div class="absolute top-3 right-3">
              <span
                class="text-[10px] px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded shadow-sm"
                >AI Summary</span
              >
            </div>
          </div>

          <!-- 正文图片 (如果有) -->
          <div v-if="article.cover" class="rounded-xl overflow-hidden shadow-md mb-8 group">
            <img
              :src="article.cover"
              class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Article Image"
            />
          </div>

          <!-- 正文内容 -->
          <div class="article-content">
            <MdPreview :editorId="previewId" :modelValue="article.content" previewTheme="default" />
          </div>

          <!-- 底部 - 版权与分享 -->
          <div class="mt-16 pt-8 border-t border-dashed border-gray-200 dark:border-gray-700">
            <div
              class="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500"
            >
              <div class="flex items-center gap-2">
                <span>本文标签:</span>
                <div class="flex gap-2">
                  <span
                    v-for="tag in article.tagList"
                    :key="tag.id"
                    class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:text-blue-500 cursor-pointer"
                  >
                    #{{ tag.name }}
                  </span>
                </div>
              </div>
              <!-- 简单的分享按钮占位 -->
              <div class="flex gap-3">
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition"
                >
                  ❤
                </button>
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-50 hover:text-blue-500 transition"
                >
                  🔗
                </button>
              </div>
            </div>
          </div>

          <!-- 版权声明 (参考常见的博客风格) -->
          <div
            class="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-blue-500 text-sm text-gray-600 dark:text-gray-400"
          >
            <p class="mb-2"><strong>本文作者：</strong> Author Name</p>
            <p class="mb-2"><strong>本文链接：</strong> {{ windowLink }}</p>
            <p>
              <strong>版权声明：</strong> 本博客所有文章除特别声明外，均采用
              <a href="#" class="text-blue-500 hover:underline">BY-NC-SA</a>
              许可协议。转载请注明出处！
            </p>
          </div>
        </div>
      </div>

      <!-- 404 -->
      <div v-else class="text-center py-20 text-gray-500">
        <h2 class="text-2xl font-bold mb-2">文章未找到</h2>
        <button @click="$router.push('/')" class="mt-6 text-blue-500 hover:underline">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 优化阅读体验的排版 */
.article-content :deep(.md-editor-preview-wrapper) {
  padding: 0;
}
.article-content :deep(.md-editor-content) {
  background: transparent;
}
.dark .article-content :deep(.md-editor-content) {
  background: transparent;
  color: #e5e7eb;
}
</style>
