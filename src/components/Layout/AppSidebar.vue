<script setup lang="ts">
import type { User } from '@/types/app/user'
import type { Cate } from '@/types/app/cate'
import type { Tag } from '@/types/app/tag'

import bgImage from '@/assets/image/6.jpg'
import avatarImage from '@/assets/image/7.png'

import GithubIcon from '@/assets/svg/socializing/GitHub.svg'
import CSDNIcon from '@/assets/svg/socializing/CSDN.svg'
import QQIcon from '@/assets/svg/socializing/QQ.svg'

defineProps<{
  author: User | null
  categories: Cate[]
  tags: Tag[]
}>()
</script>

<template>
  <aside class="space-y-6">
    <!-- 作者卡片 -->
    <div
      v-if="author"
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
            class="w-20 h-20 rounded-full border-[3px] border-white dark:border-[#1e2530] shadow-md object-cover"
          />
        </div>

        <!-- 名字与简介 -->
        <h3 class="text-lg font-bold mb-1 text-gray-800 dark:text-gray-100">
          {{ author.name || 'OHH' }}
        </h3>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mb-6 leading-relaxed px-2">
          {{ author.info || '再渺小的星光，也有属于他的光芒！' }}
        </p>

        <!-- 社交账号 -->
        <div class="pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <p class="text-xs text-gray-400 mb-3">社交账号</p>
          <div class="flex justify-center gap-4">
            <!-- GitHub -->
            <a
              href="https://github.com/Drop0827"
              target="_blank"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="GitHub"
            >
              <img :src="GithubIcon" class="w-5 h-5" alt="GitHub" />
            </a>

            <!-- CSDN -->
            <a
              href="https://blog.csdn.net/tttttxxxxxs"
              target="_blank"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              title="CSDN"
            >
              <img :src="CSDNIcon" class="w-5 h-5" alt="CSDN" />
            </a>

            <!-- Bilibili (Manual SVG) -->
            <a
              href="https://space.bilibili.com/171281410"
              target="_blank"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors"
              title="Bilibili"
            >
              <svg viewBox="0 0 1024 1024" class="w-5 h-5 text-[#fb7299]" fill="currentColor"><path d="M777.525 316.695h-531.05c-66.605 0-120.605 54-120.605 120.605v280.935c0 66.6 54 120.6 120.605 120.6h531.05c66.605 0 120.605-54 120.605-120.6V437.3c0-66.605-54-120.605-120.605-120.605z m-531.05 452.89c-28.435 0-51.355-22.925-51.355-51.355V437.3c0-28.43 22.92-51.355 51.355-51.355h531.05c28.435 0 51.355 22.925 51.355 51.355v280.935c0 28.43-22.92 51.355-51.355 51.355h-531.05z m51.355-385.735c-15.68 0-28.435-12.75-28.435-28.43s12.755-28.435 28.435-28.435h73.475l78.89-80.205c10.46-10.455 27.42-10.455 37.88 0s10.455 27.42 0 37.88l-54.885 55.79h269.41l-58.42-59.395c-10.46-10.46-10.46-27.425 0-37.88s27.42-10.46 37.88 0l82.72 84.095h70.365c15.68 0 28.435 12.755 28.435 28.435s-12.755 28.435-28.435 28.435H297.83z"></path></svg>
            </a>

            <!-- QQ -->
            <a
              href="tencent://message/?uin=2720751424&Site=&Menu=yes"
              target="_blank"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              title="QQ"
            >
              <img :src="QQIcon" class="w-5 h-5 transform hover:rotate-12 transition-transform" alt="QQ" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 站点运行时间 (New Feature based on screenshot) -->
    <div
      class="bg-white dark:bg-[#1e2530] border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm text-center"
    >
      <h4 class="text-sm font-bold text-gray-400 mb-4 flex items-center justify-center gap-2">
        ⏳ 站点运行时间
      </h4>
      <div class="text-gray-600 dark:text-gray-300 font-mono text-sm">7年0个月15天</div>
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
          class="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer"
        >
          <span
            class="text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition"
            >{{ cate.name }}</span
          >
          <span
            class="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-600 transition"
            >{{ cate.children?.length || 0 }}</span
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
          class="px-3 py-1 text-xs bg-gray-200 dark:bg-white/5 hover:bg-blue-500 hover:text-white rounded-lg transition-all cursor-pointer text-gray-600 dark:text-gray-300"
        >
          #{{ tag.name }}
        </span>
      </div>
    </div>
  </aside>
</template>
