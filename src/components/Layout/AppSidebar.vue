<script setup lang="ts">
import type { User } from '@/types/app/user'
import type { Cate } from '@/types/app/cate'
import type { Tag } from '@/types/app/tag'

defineProps<{
  author: User | null
  categories: Cate[]
  tags: Tag[]
}>()
</script>

<template>
  <aside class="space-y-8">
    <!-- 作者卡片 -->
    <div
      v-if="author"
      class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 text-center transform hover:scale-[1.02] transition duration-500 shadow-xl"
    >
      <div class="relative w-24 h-24 mx-auto mb-4">
        <img
          :src="author.avatar || '/avatar.png'"
          class="w-full h-full rounded-full object-cover border-4 border-blue-500/20 p-1"
        />
        <div
          class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900"
        ></div>
      </div>
      <h3 class="text-xl font-bold mb-1 text-white">{{ author.name }}</h3>
      <p class="text-sm text-gray-400 mb-4">{{ author.info || 'Code creates the world' }}</p>

      <div class="flex justify-center gap-4 text-2xl text-gray-400">
        <span class="hover:text-blue-400 cursor-pointer transition">🐱</span>
        <span class="hover:text-blue-400 cursor-pointer transition">🐦</span>
        <span class="hover:text-blue-400 cursor-pointer transition">📧</span>
      </div>
    </div>

    <!-- 分类卡片 -->
    <div class="bg-gray-800/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg">
      <h4
        class="text-lg font-bold mb-4 flex items-center gap-2 border-l-4 border-blue-500 pl-3 text-white"
      >
        📚 文章分类
      </h4>
      <ul class="space-y-2">
        <li
          v-for="cate in categories"
          :key="cate.id"
          class="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition cursor-pointer"
        >
          <span class="group-hover:text-blue-400 transition text-gray-300">{{ cate.name }}</span>
          <span class="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300">{{
            cate.children?.length || 0
          }}</span>
        </li>
      </ul>
    </div>

    <!-- 标签云 -->
    <div class="bg-gray-800/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg">
      <h4
        class="text-lg font-bold mb-4 flex items-center gap-2 border-l-4 border-purple-500 pl-3 text-white"
      >
        🏷️ 热门标签
      </h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag.id"
          class="px-3 py-1 text-xs bg-white/5 hover:bg-blue-600 hover:text-white rounded-lg transition-all cursor-pointer border border-white/5 text-blue-200"
        >
          #{{ tag.name }}
        </span>
      </div>
    </div>
  </aside>
</template>
