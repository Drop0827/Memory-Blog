<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 个人信息配置
const personalInfo = {
  name: '刘宇阳',
  title: '全栈工程师',
  year: '02',
  dream: '我的梦想是做一名技术顶尖的架构师，奈何学历太低',
  avatar: 'https://bu.dusays.com/2026/02/05/69849f853c09d.webp', // 替换为你的头像
  blogUrl: '/',
  githubUrl: 'https://github.com',
}

// 技能标签
const skills = ref([
  { name: 'Vue', color: '#42b883' },
  { name: 'React', color: '#61dafb' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Java', color: '#f89820' },
  { name: 'Spring Boot', color: '#6db33f' },
  { name: 'MySQL', color: '#4479a1' },
  { name: 'Docker', color: '#2496ed' },
  { name: 'Linux', color: '#fcc624' },
])

// 个人简介段落
const aboutParagraphs = ref([
  '👋 你好，我是一名热爱技术的全栈工程师，专注于 Web 开发和后端架构设计。',
  '💻 日常工作中主要使用 Vue/React + TypeScript 进行前端开发，后端则以 Java + Spring Boot 为主。',
  '🎯 我热爱开源，喜欢探索新技术，也喜欢用代码解决实际问题。',
  '☕ 工作之余，我喜欢阅读、旅行、摄影，记录生活中的美好瞬间。',
])

// 联系方式
const contacts = ref([
  { icon: '📧', label: 'Email', value: 'your@email.com' },
  { icon: '📍', label: '位置', value: '中国' },
  { icon: '💼', label: '工作', value: '全栈开发工程师' },
])

// 滚动到更多内容
const scrollToMore = () => {
  const moreSection = document.getElementById('more-about')
  moreSection?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="about-page min-h-screen bg-[#0f1117]">
    <!-- 顶部 Hero 区域 - 带光晕效果 -->
    <section class="hero-section relative min-h-screen flex items-center overflow-hidden">
      <!-- 背景光晕效果 -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- 顶部光束 -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px]">
          <div
            class="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-500/10 to-transparent blur-3xl"
          ></div>
          <div
            class="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-[400px] bg-gradient-to-b from-white/30 to-transparent blur-sm"
          ></div>
          <div
            class="absolute top-0 left-[40%] w-1 h-[300px] bg-gradient-to-b from-white/20 to-transparent blur-sm rotate-[-15deg]"
          ></div>
          <div
            class="absolute top-0 left-[60%] w-1 h-[300px] bg-gradient-to-b from-white/20 to-transparent blur-sm rotate-[15deg]"
          ></div>
          <div
            class="absolute top-0 left-[30%] w-0.5 h-[200px] bg-gradient-to-b from-white/10 to-transparent blur-sm rotate-[-25deg]"
          ></div>
          <div
            class="absolute top-0 left-[70%] w-0.5 h-[200px] bg-gradient-to-b from-white/10 to-transparent blur-sm rotate-[25deg]"
          ></div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="container mx-auto px-6 lg:px-12 relative z-10 max-w-6xl">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <!-- 左侧文字介绍 -->
          <div class="flex-1 text-center lg:text-left">
            <h1
              class="text-4xl lg:text-5xl font-bold text-white mb-6 flex items-center justify-center lg:justify-start gap-3"
            >
              <span class="text-5xl animate-wave">👋</span>
              <span>Hello，我叫{{ personalInfo.name }}</span>
            </h1>

            <div
              class="flex items-center justify-center lg:justify-start gap-3 mb-6 text-xl text-gray-300"
            >
              <span>我是一名</span>
              <span class="text-white">{{ personalInfo.year }}</span>
              <span>年的</span>
              <span
                class="px-4 py-1.5 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 font-medium"
              >
                {{ personalInfo.title }}
              </span>
            </div>

            <p class="text-gray-400 text-lg mb-8">
              {{ personalInfo.dream }}
            </p>

            <!-- 按钮组 -->
            <div class="flex items-center justify-center lg:justify-start gap-4">
              <router-link
                to="/"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
              >
                个人博客
              </router-link>
              <a
                :href="personalInfo.githubUrl"
                target="_blank"
                class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all duration-300 border border-white/10"
              >
                GitHub
              </a>
            </div>
          </div>

          <!-- 右侧头像 -->
          <div class="flex-shrink-0">
            <div class="relative">
              <!-- 头像光晕 -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl scale-110"
              ></div>
              <!-- 头像容器 -->
              <div
                class="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl"
              >
                <img
                  :src="personalInfo.avatar"
                  :alt="personalInfo.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 继续了解按钮 -->
        <div class="absolute bottom-12 left-1/2 -translate-x-1/2">
          <button
            @click="scrollToMore"
            class="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer group"
          >
            <span class="text-sm">继续了解</span>
            <svg
              class="w-5 h-5 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
            <svg
              class="w-5 h-5 animate-bounce -mt-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- 更多关于我 -->
    <section id="more-about" class="py-20 bg-[#13151c]">
      <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
        <h2 class="text-3xl font-bold text-white mb-12 text-center">
          <span class="mr-2">📝</span> 关于我
        </h2>

        <div class="space-y-6">
          <p
            v-for="(paragraph, index) in aboutParagraphs"
            :key="index"
            class="text-gray-300 text-lg leading-relaxed"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>
    </section>

    <!-- 技能标签 -->
    <section class="py-20 bg-[#0f1117]">
      <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
        <h2 class="text-3xl font-bold text-white mb-12 text-center">
          <span class="mr-2">🛠️</span> 技术栈
        </h2>

        <div class="flex flex-wrap justify-center gap-4">
          <span
            v-for="skill in skills"
            :key="skill.name"
            class="px-5 py-2.5 rounded-full text-white font-medium transition-transform hover:scale-105 cursor-default"
            :style="{
              backgroundColor: skill.color + '30',
              borderColor: skill.color,
              borderWidth: '1px',
            }"
          >
            {{ skill.name }}
          </span>
        </div>
      </div>
    </section>

    <!-- 联系方式 -->
    <section class="py-20 bg-[#13151c]">
      <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
        <h2 class="text-3xl font-bold text-white mb-12 text-center">
          <span class="mr-2">📬</span> 联系我
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="contact in contacts"
            :key="contact.label"
            class="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
          >
            <span class="text-3xl mb-4 block">{{ contact.icon }}</span>
            <h3 class="text-gray-400 text-sm mb-2">{{ contact.label }}</h3>
            <p class="text-white font-medium">{{ contact.value }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 挥手动画 */
@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(-20deg);
  }
}

.animate-wave {
  display: inline-block;
  animation: wave 1.5s ease-in-out infinite;
  transform-origin: 70% 70%;
}
</style>
