<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuthorInfo } from '@/api'
import { useConfigStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { User } from '@/types/app/user'
import type { Social } from '@/types/app/config'

import avatarBg from '@/assets/image/avatar_bg.jpg'
import CSDN from '@/assets/svg/socializing/CSDN.svg'
import Douyin from '@/assets/svg/socializing/Douyin.svg'
import GitHub from '@/assets/svg/socializing/GitHub.svg'
import Gitee from '@/assets/svg/socializing/Gitee.svg'
import Juejin from '@/assets/svg/socializing/Juejin.svg'
import QQ from '@/assets/svg/socializing/QQ.svg'
import Weixin from '@/assets/svg/socializing/Weixin.svg'

const user = ref<User | null>(null)
const configStore = useConfigStore()
const { theme } = storeToRefs(configStore)

// Map for icons
const icons: Record<string, string> = {
  CSDN,
  Douyin,
  GitHub,
  Gitee,
  Juejin,
  QQ,
  Weixin,
}

const getIcon = (name: string) => icons[name] || ''

const loadData = async () => {
  try {
    const res = await getAuthorInfo()
    user.value = res.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div
    class="flex flex-col items-center pt-16 bg-no-repeat bg-white dark:bg-black-b w-full h-[350px] mb-5 tw_container rounded-xl overflow-hidden shadow-sm"
    :style="{
      backgroundSize: '100% 35%',
      backgroundImage: `url(${avatarBg})`,
    }"
  >
    <!-- Avatar -->
    <div
      class="avatar flex justify-center items-center w-[90px] h-[90px] rounded-full bg-white shadow-md overflow-hidden z-10"
    >
      <img
        :src="user?.avatar"
        alt="Author Avatar"
        class="w-[90%] h-[90%] rounded-full transition-transform hover:scale-110 duration-500"
      />
    </div>

    <!-- Info -->
    <div class="info text-center mt-4">
      <h3 class="text-lg text-[#333] dark:text-white font-bold">{{ user?.name }}</h3>
      <p class="w-[90%] mx-auto mt-2 text-sm text-[#686868] dark:text-[#cecece]">
        {{ user?.info }}
      </p>
    </div>

    <!-- Social -->
    <div class="socializing w-full pt-8 px-4">
      <div class="title relative w-full h-[1px] bg-[#eee] dark:bg-black-a">
        <span
          class="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-[110px] bg-white dark:bg-black-b text-center text-sm text-[#666] dark:text-[#979797]"
        >
          社交账号
        </span>
      </div>

      <div class="list flex justify-evenly w-[80%] mx-auto pt-6">
        <a
          v-for="(item, index) in theme?.social"
          :key="index"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:scale-110 transition-transform"
        >
          <img
            v-if="getIcon(item.name)"
            :src="getIcon(item.name)"
            :alt="item.name"
            :title="item.name"
            class="w-[23px] h-[23px]"
          />
        </a>
      </div>
    </div>
  </div>
</template>
