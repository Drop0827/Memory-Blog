<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores'
import { getArticleDetail, recordArticleView } from '@/api'
import type { Article } from '@/types/app/article'
import AppNavbar from '@/components/Layout/AppNavbar.vue'
import AppSidebar from '@/components/Layout/AppSidebar.vue' // Reuse Sidebar if possible, or just build a simple layout
import Starry from '@/components/Starry/index.vue'
import Waves from '@/components/Waves/index.vue'
const BgImg = 'https://bu.dusays.com/2026/02/04/698346c017609.jpg' // cat.jpg - 使用不同于首页的背景
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const route = useRoute()
const configStore = useConfigStore()
const { isDark } = storeToRefs(configStore)
const loading = ref(true)
const article = ref<Article | null>(null)
const previewId = 'article-preview'

// 计算 Markdown 编辑器主题
const editorTheme = computed(() => (isDark.value ? 'dark' : 'light'))

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
    class="article-detail-view min-h-screen bg-gray-50 dark:bg-[#1a1b26] text-gray-900 dark:text-[#c0caf5] font-sans transition-colors duration-300"
  >
    <!-- 1. 全局星空背景 (保持) -->
    <Starry />

    <!-- 2. 顶部导航 -->
    <AppNavbar :transparent="true" />

    <!-- 3. 顶部 Header / Hero 区域 -->
    <div
      class="relative w-full h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden group"
    >
      <!-- 背景图 -->
      <div class="absolute inset-0 z-0">
        <img
          :src="BgImg"
          class="w-full h-full object-cover object-center transition-transform duration-[3s] group-hover:scale-105"
          alt="Page Header"
        />
        <!-- 遮罩层 - 加深以突出白字 -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"
        ></div>
      </div>

      <!-- 文章标题信息 (居中显示) -->
      <div class="relative z-10 container mx-auto px-4 max-w-5xl text-center text-white">
        <h1 class="text-3xl md:text-5xl font-bold mb-8 leading-tight drop-shadow-lg tracking-wide">
          {{ article?.title }}
        </h1>

        <!-- Meta 信息栏 -->
        <div
          class="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm md:text-base mt-6 opacity-90"
        >
          <!-- 分类 -->
          <div class="flex items-center gap-2">
            <span class="opacity-80">🌈 所属分类:</span>
            <span v-for="cate in article?.cateList" :key="cate.id" class="font-bold">
              {{ cate.name }}
            </span>
          </div>
          <div class="w-px h-3 bg-white/40 hidden md:block"></div>
          <!-- 阅读 -->
          <div class="flex items-center gap-2">
            <span class="opacity-80">🔥 阅读量:</span>
            <span class="font-bold">{{ article?.view }}</span>
          </div>
          <div class="w-px h-3 bg-white/40 hidden md:block"></div>
          <!-- 评论 -->
          <div class="flex items-center gap-2">
            <span class="opacity-80">💬 评论数:</span>
            <span class="font-bold">{{ article?.comment || 0 }}</span>
          </div>
          <div class="w-px h-3 bg-white/40 hidden md:block"></div>
          <!-- 时间 -->
          <div class="flex items-center gap-2">
            <span class="opacity-80">🕒 发布时间:</span>
            <span class="font-bold">{{ formatDate(article?.createTime || '') }}</span>
          </div>
        </div>
      </div>

      <!-- 波浪装饰 -->
      <div class="absolute bottom-0 left-0 w-full z-20 overflow-hidden leading-[0]">
        <Waves />
      </div>
    </div>

    <!-- 4. 主要内容区域 -->
    <div class="container mx-auto px-4 max-w-[900px] relative z-20 pb-24 pt-8">
      <!-- 加载中 -->
      <div v-if="loading" class="text-center py-20 animate-pulse text-gray-500 rounded-xl">
        正在加载文章详情...
      </div>

      <div v-else-if="article">
        <!-- 卡片容器 (移除卡片样式) -->
        <div class="w-full">
          <!-- 封面图片已隐藏，不在详情页显示 -->

          <!-- 正文内容 -->
          <div class="article-content">
            <MdPreview
              :editorId="previewId"
              :modelValue="article.content"
              :theme="editorTheme"
              previewTheme="default"
            />
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
.article-content :deep(.md-editor-preview) {
  font-family: 'Ma Shan Zheng', 'LXGW WenKai', serif;
  word-break: break-all;
}

/* 让 md-editor 所有层级背景透明 */
.article-content :deep(.md-editor) {
  background: transparent !important;
}
.article-content :deep(.md-editor-preview-wrapper) {
  background: transparent !important;
}

/* 暗黑模式下 Markdown 预览样式 - 模仿原作者风格 */
:global(.dark) .article-content :deep(.md-editor) {
  background: transparent !important;
  --md-bk-color: transparent !important;
}
:global(.dark) .article-content :deep(.md-editor-content) {
  background: transparent !important;
}
:global(.dark) .article-content :deep(.md-editor-preview-wrapper) {
  background: transparent !important;
}
:global(.dark) .article-content :deep(.md-editor-preview) {
  color: #c0caf5; /* 浅蓝灰色文字 */
  background: transparent !important;
}
:global(.dark) .article-content :deep(.md-editor-preview h1),
:global(.dark) .article-content :deep(.md-editor-preview h2),
:global(.dark) .article-content :deep(.md-editor-preview h3),
:global(.dark) .article-content :deep(.md-editor-preview h4),
:global(.dark) .article-content :deep(.md-editor-preview h5),
:global(.dark) .article-content :deep(.md-editor-preview h6) {
  color: #e0e6ff; /* 更亮的标题 */
}
:global(.dark) .article-content :deep(.md-editor-preview p) {
  color: #a9b1d6; /* 段落文字 */
}
:global(.dark) .article-content :deep(.md-editor-preview a) {
  color: #7aa2f7; /* 链接颜色 */
}
:global(.dark) .article-content :deep(.md-editor-preview code) {
  background: #24283b; /* 行内代码背景 */
  color: #bb9af7; /* 行内代码文字 */
}
:global(.dark) .article-content :deep(.md-editor-preview pre) {
  background: #24283b; /* 代码块背景 */
  border: 1px solid #3b4261;
}
:global(.dark) .article-content :deep(.md-editor-preview blockquote) {
  border-left-color: #7aa2f7;
  background: rgba(122, 162, 247, 0.1);
  color: #9aa5ce;
}
:global(.dark) .article-content :deep(.md-editor-preview table th) {
  background: #24283b;
  border-color: #3b4261;
}
:global(.dark) .article-content :deep(.md-editor-preview table td) {
  border-color: #3b4261;
}
:global(.dark) .article-content :deep(.md-editor-preview hr) {
  border-color: #3b4261;
}

/* 文章内图片样式 - 居中显示、限制宽度、圆角 */
.article-content :deep(.md-editor-preview img) {
  display: block;
  max-width: 90%;
  margin: 1.5rem auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.article-content :deep(.md-editor-preview img:hover) {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}
:global(.dark) .article-content :deep(.md-editor-preview img) {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
:global(.dark) .article-content :deep(.md-editor-preview img:hover) {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}
</style>
