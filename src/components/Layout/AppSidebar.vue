<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores'
import type { User } from '@/types/app/user'
import type { Cate } from '@/types/app/cate'
import type { Tag } from '@/types/app/tag'

import GithubIcon from '@/assets/svg/socializing/GitHub.svg'
import CSDNIcon from '@/assets/svg/socializing/CSDN.svg'
import QQIcon from '@/assets/svg/socializing/QQ.svg'

const props = defineProps<{
  author: User | null
  categories: Cate[]
  tags: Tag[]
  categoryArticleCounts?: Record<string, number>
  tagArticleCounts?: Record<string, number>
  selectedCateId?: number | null
  selectedTagId?: number | null
}>()

const configStore = useConfigStore()
const { theme, web } = storeToRefs(configStore)

// 计算属性：从 Theme 配置获取，如果为空则回退到默认值或 Author 信息
const bgImage = computed(() => {
  // 优先使用自定义的作者背景图
  const author_bg = (theme.value as any).author_bg
  if (author_bg) return author_bg

  const covers = theme.value.covers
  if (Array.isArray(covers) && covers.length > 0) return covers[0]
  if (typeof covers === 'string' && covers) return covers
  return 'https://bu.dusays.com/2026/02/04/698346b16d065.jpg'
})

const avatarImage = computed(
  () =>
    (theme.value as any).author_avatar ||
    theme.value.light_logo ||
    'https://bu.dusays.com/2026/02/04/698346b17c425.png',
)
const authorName = computed(() => theme.value.record_name || props.author?.name || 'OHH')
const authorInfo = computed(
  () => theme.value.record_info || props.author?.info || '再渺小的星光，也有属于他的光芒！',
)
const socials = computed(() => theme.value.social || [])

// 社交图标映射
const getSocialIcon = (name: string) => {
  const lower = name.toLowerCase()
  if (lower.includes('github')) return GithubIcon
  if (lower.includes('csdn')) return CSDNIcon
  if (lower.includes('qq')) return QQIcon
  return null
}

// 运行时间计算
const runTime = ref('')
let timer: any = null

const calculateRunTime = () => {
  const createTime = web.value.create_time || 1514736000000 // 默认 2018-01-01
  const startTime = new Date(createTime).getTime()
  const now = new Date().getTime()
  const diff = now - startTime

  const days = Math.floor(diff / (24 * 3600 * 1000))
  const leave1 = diff % (24 * 3600 * 1000)
  const hours = Math.floor(leave1 / (3600 * 1000))
  const leave2 = leave1 % (3600 * 1000)
  const minutes = Math.floor(leave2 / (60 * 1000))
  const leave3 = leave2 % (60 * 1000)
  const seconds = Math.floor(leave3 / 1000)

  // 简单显示天数即可，或者更详细
  // 这里模仿原样式：X年X个月X天 (简单估算)
  // 为了精确，我们可以直接显示 "X天 X小时 X分 X秒" 或者保持原样 "7年0个月15天" 的格式
  // 原样格式比较难精确计算（因为闰年等），这里简化为 "X天" 或者尝试计算年月日

  const dateDiff = new Date(diff)
  const years = new Date().getFullYear() - new Date(createTime).getFullYear()
  // 简单计算年份差异，精确计算比较复杂，这里先用简单的总天数展示，或者保留静态如果用户没要求。
  // 用户截图中是 "7年0个月15天"。
  // 让我们尝试计算年/月/天

  let Y = new Date(now).getFullYear() - new Date(startTime).getFullYear()
  let M = new Date(now).getMonth() - new Date(startTime).getMonth()
  let D = new Date(now).getDate() - new Date(startTime).getDate()

  if (D < 0) {
    M--
    D += new Date(new Date(now).getFullYear(), new Date(now).getMonth(), 0).getDate()
  }
  if (M < 0) {
    Y--
    M += 12
  }

  runTime.value = `${Y}年${M}个月${D}天`
}

onMounted(() => {
  calculateRunTime()
  timer = setInterval(calculateRunTime, 60000) // update every minute
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 定义事件
const emit = defineEmits<{
  (e: 'filter-category', cateId: number, cateName: string): void
  (e: 'filter-tag', tagId: number, tagName: string): void
  (e: 'clear-filter'): void
}>()

// 处理分类点击
const handleCategoryClick = (cate: Cate) => {
  if (cate.id) {
    emit('filter-category', cate.id, cate.name)
  }
}

// 处理标签点击
const handleTagClick = (tag: Tag) => {
  if (tag.id) {
    emit('filter-tag', tag.id, tag.name)
  }
}
</script>

<template>
  <aside class="space-y-6">
    <!-- 作者卡片 -->
    <div
      class="bg-white dark:bg-[#1e2530] border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
    >
      <!-- 背景图 -->
      <div class="h-32 w-full overflow-hidden relative">
        <img
          :src="bgImage"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div class="absolute inset-0 bg-black/10"></div>
      </div>

      <!-- 内容区 -->
      <div class="px-6 pb-6 text-center relative">
        <!-- 头像 (重叠) -->
        <div class="relative -mt-10 mb-3 inline-block">
          <img
            :src="avatarImage"
            class="w-20 h-20 rounded-full border-[3px] border-white dark:border-[#1e2530] shadow-md object-cover bg-white"
          />
        </div>

        <!-- 名字与简介 -->
        <h3 class="text-lg font-bold mb-1 text-gray-800 dark:text-gray-100">
          {{ authorName }}
        </h3>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mb-6 leading-relaxed px-2">
          {{ authorInfo }}
        </p>

        <!-- 社交账号 -->
        <div class="pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <p class="text-xs text-gray-400 mb-3">社交账号</p>
          <div class="flex justify-center gap-4 flex-wrap">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.url || ''"
              target="_blank"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              :title="social.name"
            >
              <img
                v-if="getSocialIcon(social.name)"
                :src="getSocialIcon(social.name)"
                class="w-5 h-5"
                :alt="social.name"
              />
              <span v-else class="text-[10px] font-bold text-gray-500">{{
                social.name.slice(0, 1).toUpperCase()
              }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 站点运行时间 (动态) -->
    <div
      class="bg-white dark:bg-[#1e2530] border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm text-center"
    >
      <h4 class="text-sm font-bold text-gray-400 mb-4 flex items-center justify-center gap-2">
        ⏳ 站点运行时间
      </h4>
      <div class="text-gray-600 dark:text-gray-300 font-mono text-sm">{{ runTime }}</div>
    </div>

    <!-- 分类卡片 -->
    <div
      class="bg-gray-400/20 dark:bg-[#1e2530] backdrop-blur-md border-[3px] border-l-blue-500 border-gray-100 dark:border-gray-700/50 rounded-xl p-6 shadow-sm"
    >
      <h4
        class="text-lg font-bold mb-4 flex items-center gap-2 border-l-4 border-blue-500 pl-3 text-gray-800 dark:text-white"
      >
        📚 文章分类
      </h4>
      <ul class="space-y-2">
        <li
          v-for="cate in categories"
          :key="cate.id"
          @click="handleCategoryClick(cate)"
          class="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20': selectedCateId === cate.id }"
        >
          <span
            class="text-sm transition"
            :class="
              selectedCateId === cate.id
                ? 'text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-600 dark:text-gray-300 group-hover:text-blue-500'
            "
            >{{ cate.name }}</span
          >
          <span
            class="text-xs px-2 py-0.5 rounded-full transition"
            :class="
              selectedCateId === cate.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-600'
            "
            >{{ categoryArticleCounts?.[cate.name] || 0 }}</span
          >
        </li>
      </ul>
    </div>

    <!-- 标签云 -->
    <div
      class="bg-gray-400/20 dark:bg-[#1e2530] backdrop-blur-md border-[3px] border-l-purple-500 border-gray-100 dark:border-gray-700/50 rounded-xl p-6 shadow-sm"
    >
      <h4
        class="text-lg font-bold mb-4 flex items-center gap-2 border-l-4 border-purple-500 pl-3 text-gray-800 dark:text-white"
      >
        🏷️ 热门标签
      </h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag.id"
          @click="handleTagClick(tag)"
          class="px-3 py-1 text-xs rounded-lg transition-all cursor-pointer"
          :class="
            selectedTagId === tag.id
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 dark:bg-white/5 hover:bg-purple-500 hover:text-white text-gray-600 dark:text-gray-300'
          "
        >
          #{{ tag.name }}
          <span v-if="tagArticleCounts?.[tag.name]" class="ml-1 opacity-75"
            >({{ tagArticleCounts?.[tag.name] }})</span
          >
        </span>
      </div>
    </div>
  </aside>
</template>
