<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuthorInfo, getWebConfigByName } from '@/api'
import AnimalsImg from '@/components/Footer/images/animals.webp'
// 图床链接
const avatarImage = 'https://bu.dusays.com/2026/02/04/698346b17c425.png' // User provided avatar
import type { User } from '@/types/app/user'
import type { Web } from '@/types/app/config'

const user = ref<User | null>(null)
const web = ref<Web | null>(null)
const currentYear = new Date().getFullYear()

onMounted(async () => {
  try {
    const userRes = await getAuthorInfo()
    user.value = userRes.data || null

    const webRes = await getWebConfigByName('web')
    web.value = (webRes.data?.value as Web) || null
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <footer class="relative mt-40 z-40 pb-10">
    <!-- Animals Image (Peeking) -->
    <!-- Animals Image (Sitting on top) -->
    <div class="absolute -top-[48px] left-0 w-full flex justify-center pointer-events-none z-30">
      <img
        :src="AnimalsImg"
        class="w-[800px] max-w-full object-contain drop-shadow-lg"
        alt="Footer Animals"
      />
    </div>

    <!-- Main Content -->
    <div class="bg-white/50 dark:bg-[#1e2530]/50 backdrop-blur-sm pt-12 pb-8 px-4 relative z-20">
      <div
        class="container mx-auto max-w-[1000px] flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-8"
      >
        <!-- Left: Avatar -->
        <div class="shrink-0 group mx-auto md:mx-0">
          <div class="relative">
            <img
              :src="avatarImage"
              class="w-20 h-20 rounded-xl border-2 border-white dark:border-[#2a3241] shadow-lg group-hover:rotate-6 transition-transform duration-500 object-cover"
            />
          </div>
        </div>

        <!-- Right: Text Only -->
        <div class="flex-1 text-center md:text-left">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-sm font-normal">
            {{
              '这是一个记录生活、分享知识的个人博客。热爱技术，也热爱生活，希望能在这里与你共同成长。'
            }}
          </p>
        </div>
      </div>

      <!-- Bottom Info (Centered) -->
      <div
        class="flex flex-col items-center gap-2 text-xs text-gray-400 border-t border-gray-200/30 dark:border-white/5 pt-6 w-full text-center"
      >
        <div class="flex items-center gap-2">
          <img
            src="https://bu.dusays.com/2026/02/07/6987190aeee4d.png"
            class="w-3 h-3 opacity-60"
          />
          <span>豫ICP备2020031040号-1</span>
        </div>
        <div class="flex items-center gap-1 opacity-80">
          <span>&copy; {{ currentYear }} Memory Blog.</span>
        </div>
      </div>
    </div>
  </footer>
</template>
