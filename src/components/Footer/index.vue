<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuthorInfo, getWebConfigByName } from '@/api'
import ICPBeian from './components/ICPBeian/index.vue'
import Tooltip from './components/Tooltip.vue'
import AnimalsImg from '@/components/Footer/images/animals.webp'
import type { User } from '@/types/app/user'
import type { Web } from '@/types/app/config'

const user = ref<User | null>(null)
const web = ref<Web | null>(null)

onMounted(async () => {
  try {
    const userRes = await getAuthorInfo()
    user.value = userRes.data

    const webRes = await getWebConfigByName('web')
    web.value = webRes.data?.value as Web
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <footer>
    <div
      class="sticky bottom-0 z-30 translate-y-[25px] flex justify-center w-full bg-cover bg-center pointer-events-none"
    >
      <!-- Gradient overlay handled by CSS or separate div if needed -->
      <div
        class="absolute bottom-[25px] left-0 w-full h-[60%] bg-gradient-to-t from-white to-transparent dark:from-[#0d1320] dark:to-transparent"
      ></div>

      <div class="flex justify-center lg:w-[950px] xl:w-[1200px] mx-auto z-40">
        <img
          :src="AnimalsImg"
          alt="动物"
          width="660"
          height="80"
          class="relative hidden md:block"
        />
      </div>
    </div>

    <div
      class="bg-white dark:bg-[#0d1320] border-t border-gray-100 dark:border-white/5 px-10 relative z-50"
    >
      <div class="flex justify-center items-center py-4">
        <img
          v-if="user?.avatar"
          :src="user.avatar"
          alt="作者头像"
          class="w-20 h-20 rounded-full mr-8 shadow-[5px_11px_30px_20px_rgba(255,255,255,0.1)] hover:rotate-12 transition-transform duration-500"
        />
        <h2
          class="w-[90%] xl:w-3/6 text-sm sm:text-base text-gray-700 dark:text-[#8c9ab1] line-clamp-4"
        >
          {{ web?.footer }}
        </h2>
      </div>

      <!-- ICP -->
      <ICPBeian :icp="web?.icp" />

      <!-- Copyright -->
      <div class="py-4 border-t border-gray-100 dark:border-white/5 flex justify-center">
        <Tooltip content="一款免费、开源、年轻、高颜值的现代化博客管理系统">
          <div class="flex justify-center items-center space-x-3">
            <img
              src="https://bu.dusays.com/2025/12/04/6930fdfbda057.png"
              width="30"
              height="30"
              alt="ThriveX 博客管理系统"
            />
            <a
              href="https://github.com/LiuYuYang01/ThriveX-Admin"
              target="_blank"
              class="hover:text-blue-500 transition-colors dark:text-gray-400 font-medium"
            >
              基于开源项目 ThriveX 构建
            </a>
          </div>
        </Tooltip>
      </div>
    </div>
  </footer>
</template>
