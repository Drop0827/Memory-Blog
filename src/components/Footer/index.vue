<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuthorInfo, getWebConfigByName } from '@/api'
import AnimalsImg from '@/components/Footer/images/animals.webp'
import avatarImage from '@/assets/image/7.png'
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
  <footer class="relative mt-32 z-40">
    <!-- Animals Image (Peeking) -->
    <div class="absolute -top-[60px] left-0 w-full flex justify-center pointer-events-none z-10">
      <img :src="AnimalsImg" class="w-[800px] max-w-full object-contain drop-shadow-xl" alt="Footer Animals" />
    </div>

    <!-- Main Content -->
    <div class="bg-white/90 dark:bg-[#1e2530]/90 backdrop-blur-md border-t border-gray-100 dark:border-white/5 pt-16 pb-8 px-4 relative z-20">
      <div class="container mx-auto max-w-[1000px] flex flex-col md:flex-row items-center gap-8 md:gap-12">

        <!-- Left: Avatar -->
        <div class="shrink-0 group">
          <div class="relative">
             <img
              :src="avatarImage"
              class="w-24 h-24 rounded-full border-4 border-white dark:border-[#2a3241] shadow-xl group-hover:rotate-12 transition-transform duration-500 object-cover"
            />
            <span class="absolute bottom-0 right-0 text-xl">👋</span>
          </div>
        </div>

        <!-- Right: Text & Info -->
        <div class="flex-1 text-center md:text-left space-y-4">
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base font-medium">
            {{ user?.info || '保持热爱，奔赴山海。' }}
          </p>

          <div class="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-xs text-gray-400 mt-4 justify-center md:justify-start">
             <div class="flex items-center gap-1">
                <img src="https://bu.dusays.com/2025/12/04/6930fdfbda057.png" class="w-4 h-4" />
                <span>基于开源项目 <a href="https://github.com/LiuYuYang01/ThriveX-Admin" target="_blank" class="hover:text-blue-500 transition-colors">ThriveX</a> 构建</span>
             </div>
          </div>

           <div class="text-xs text-gray-300 dark:text-gray-600">
             &copy; {{ currentYear }} Memory Blog.
           </div>
        </div>
      </div>
    </div>
  </footer>
</template>
