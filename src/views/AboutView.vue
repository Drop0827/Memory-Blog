<script setup lang="ts">
/**
 * AboutView 关于我页面
 */
import { ref, onMounted, onUnmounted } from 'vue'
import LightRays from '@/components/LightRays/index.vue'
import RotatingText from '@/components/RotatingText/index.vue'
import SplitText from '@/components/SplitText/index.vue'
import ScrollAnimatedHeading from '@/components/ScrollAnimatedHeading/index.vue'
import AnimatedContent from '@/components/AnimatedContent/index.vue'
import IconCloud from '@/components/IconCloud/index.vue'

// 个人信息配置
const personalInfo = {
  name: 'OHH',
  year: '01',
  dream: '我的梦想是做一名技术顶尖的架构师',
  avatar: 'https://bu.dusays.com/2026/02/04/698346b17c425.png',
  blogUrl: '/',
  githubUrl: 'https://github.com/Drop0827',
}

// 职业标签轮播
const jobTitles = ['全栈工程师', '前端工程师', '后端工程师']

// 技术图标（参考原作者的完整列表）
const techIcons = [
  // 前端
  'vue',
  'react',
  'typescript',
  'javascript',
  'html5',
  'css3',
  'tailwindcss',
  'sass',
  'webpack',
  'vite',
  // 后端
  'java',
  'springboot',
  'python',
  'nodedotjs',
  // 数据库
  'mysql',
  'redis',
  'mongodb',
  // 工具
  'docker',
  'git',
  'github',
  'linux',
  'nginx',
  // IDE
  'visualstudiocode',
  'intellijidea',
]

// 联系方式
const contacts = ref([
  { icon: '📧', label: 'Email', value: '2720751424@qq.com' },
  { icon: '📍', label: '位置', value: '江苏南京' },
  { icon: '💼', label: '工作', value: '全栈开发工程师' },
])

// 滚动到更多内容
const scrollToMore = () => {
  const moreSection = document.getElementById('more-about')
  moreSection?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="about-page min-h-screen bg-[#0d1017]">
    <!-- 顶部 Hero 区域 -->
    <section class="hero-section relative min-h-screen flex items-center overflow-hidden">
      <!-- WebGL 光束效果 -->
      <div class="absolute inset-0">
        <LightRays
          rays-origin="top-center"
          rays-color="#ffffff"
          :light-spread="2"
          :ray-length="2"
          :follow-mouse="true"
          :mouse-influence="0.1"
          :rays-speed="1"
        />
      </div>

      <!-- 内容区域 -->
      <div class="container mx-auto px-6 lg:px-12 relative z-10 max-w-6xl">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <!-- 左侧文字介绍 -->
          <div class="flex-1 lg:w-[50%]">
            <h1 class="text-4xl lg:text-[50px] font-semibold text-white mb-6">
              👋 Hello，我叫{{ personalInfo.name }}
            </h1>

            <div class="flex items-center gap-3 mb-6 text-2xl text-white">
              <span>我是一名 {{ personalInfo.year }} 年的</span>
              <RotatingText
                :texts="jobTitles"
                :rotation-interval="2000"
                main-class-name="px-3 py-1 bg-[#539dfd] rounded-lg"
              />
            </div>

            <div class="text-xl text-gray-400 mb-8">
              <SplitText :text="personalInfo.dream" />
            </div>

            <!-- 按钮组 -->
            <div class="flex items-center gap-4">
              <router-link
                to="/"
                class="px-6 py-2 bg-[#539dfd] hover:bg-[#3a86f5] text-white rounded-full font-medium transition-colors"
              >
                个人博客
              </router-link>
              <a
                :href="personalInfo.githubUrl"
                target="_blank"
                class="px-6 py-2 border border-gray-700 hover:border-cyan-500/50 text-white rounded-full font-medium transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          <!-- 右侧头像 -->
          <div class="flex-shrink-0">
            <img
              :src="personalInfo.avatar"
              :alt="personalInfo.name"
              class="w-[300px] h-[300px] rounded-full shadow-[5px_11px_30px_20px_rgba(255,255,255,0.1)]"
            />
          </div>
        </div>
      </div>

      <!-- 继续了解按钮 -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <button
          @click="scrollToMore"
          class="flex items-center gap-3 text-white cursor-pointer animate-bounce hover:text-[#539dfd] transition-colors"
        >
          <span>继续了解</span>
          <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </section>

    <!-- 第二部分：热爱 -->
    <section id="more-about" class="py-20">
      <div class="my-[200px]">
        <ScrollAnimatedHeading :min-font-size="20" :max-font-size="96">
          <h2 class="text-yellow-300 text-center">"热爱" 是所有的理由与解释</h2>
        </ScrollAnimatedHeading>
      </div>

      <ScrollAnimatedHeading :min-font-size="16" :max-font-size="30">
        <div class="text-white max-w-5xl mx-auto text-center space-y-4">
          <p class="leading-[3rem]">
            对于很多人来说写代码是一件 <b class="text-red-500">痛苦不堪</b> 的事情
          </p>
          <p class="leading-[3rem]">而我不一样，这正是我的 <b class="text-yellow-300">爱好</b></p>
          <p class="leading-[3rem]">每天工作做着自己喜欢的事情还能挣钱</p>
          <p class="leading-[3rem]">简直占据了 <b class="text-green-400">天时地利人和</b></p>
        </div>
      </ScrollAnimatedHeading>
    </section>

    <!-- 第三部分：全栈之路 -->
    <section class="py-20">
      <div class="my-[200px]">
        <ScrollAnimatedHeading :min-font-size="20" :max-font-size="96">
          <h2 class="text-yellow-300 text-center">所谓："不谋全局者，不足谋一域"</h2>
        </ScrollAnimatedHeading>
      </div>

      <ScrollAnimatedHeading :min-font-size="16" :max-font-size="30">
        <div class="text-white max-w-5xl mx-auto text-center space-y-6">
          <p>我认为只专注一个领域是无法做出一个 <b class="text-green-400">完整的项目</b></p>
          <p>因为如果只会前端那么做出来的项目是一个没有灵魂的项目</p>
          <p>但只会后端连界面都看不到又能有什么意义呢</p>
          <p>我想具备的是能够一个人完成整个项目的研发的能力</p>
          <p>因此，我踏入了 <b class="text-[#539dfd]">全栈工程师</b> 的探索之路</p>
        </div>
      </ScrollAnimatedHeading>
    </section>

    <!-- 第四部分：技术栈 -->
    <section class="py-20">
      <div class="max-w-5xl mx-auto">
        <AnimatedContent :distance="100" :duration="1">
          <p class="text-white text-3xl text-center leading-[3rem]">
            下面是我的 <b class="text-yellow-300">毕生所学</b>
          </p>
        </AnimatedContent>

        <AnimatedContent :distance="100" :duration="1" :delay="0.2">
          <p class="text-white text-3xl text-center leading-[3rem] mt-6 mb-[100px]">
            其中我最喜欢的一套组合是：<b class="text-[#42b883]">Vue</b>
            <span class="px-1">+</span>
            <b class="text-[#539dfd]">TypeScript</b>
          </p>
        </AnimatedContent>

        <IconCloud :icon-slugs="techIcons" />
      </div>
    </section>

    <!-- 联系方式 -->
    <section class="py-20 bg-[#13151c]">
      <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
        <AnimatedContent :distance="50" :duration="0.8">
          <h2 class="text-3xl font-bold text-white mb-12 text-center">
            <span class="mr-2">📬</span> 联系我
          </h2>
        </AnimatedContent>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedContent
            v-for="(contact, index) in contacts"
            :key="contact.label"
            :distance="50"
            :duration="0.8"
            :delay="index * 0.1"
          >
            <div
              class="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
            >
              <span class="text-3xl mb-4 block">{{ contact.icon }}</span>
              <h3 class="text-gray-400 text-sm mb-2">{{ contact.label }}</h3>
              <p class="text-white font-medium">{{ contact.value }}</p>
            </div>
          </AnimatedContent>
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
