<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores'
import { getRandom } from '@/utils'
import Empty from '@/components/Empty/index.vue'
import type { Article } from '@/types/app/article'
import type { Theme } from '@/types/app/config'

const props = defineProps<{
  data: Paginate<Article[]>
}>()

const configStore = useConfigStore()
const { theme } = storeToRefs(configStore)
// Provide default if covers is undefined
const covers = computed(() => theme.value?.covers || [])

const genArticleInfo = (item: Article) => {
  if (item.description?.trim()?.length) {
    return item.description
  } else {
    return item.content.slice(0, 100)
  }
}

const formatDate = (date: any) => {
  if (!date) return ''
  const d = new Date(+date)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0]
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="item in data?.result"
      :key="item.id"
      class="relative overflow-hidden flex h-[190px] md:h-60 lg:h-52 xl:h-60 bg-black-b tw_container"
    >
      <div class="relative w-full py-5 px-5 sm:px-10 lg:px-5 xl:px-10 z-20">
        <RouterLink
          :to="`/article/${item.id}`"
          class="flex flex-col justify-between h-full text-center sm:text-start"
        >
          <h3
            class="overflow-hidden relative w-full my-2.5 text_shadow text-white hover:text-primary text-center text-lg md:text-xl lg:text-[22px] xl:text-2xl line-clamp-1"
          >
            {{ item.title }}
          </h3>
          <p
            class="text-center text-[#cecece] text-sm sm:text-[15px] leading-7 sm:indent-8 line-clamp-2 xl:line-clamp-3"
          >
            {{ genArticleInfo(item) }}
          </p>

          <div class="flex justify-center pt-5 text-end space-x-4 sm:space-x-8">
            <div class="flex items-center text-xs text-white">
              <span class="pr-1 flex items-center">
                <!-- Clock Icon -->
                <svg
                  class="p-1 mt-[-2px] mr-[3px] w-[23px] h-[23px] text-white rounded-full align-middle bg-[#539dfd]"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <path
                    d="M256,48C141.13,48,48,141.13,48,256s93.13,208,208,208,208-93.13,208-208S370.87,48,256,48Zm96,240h-96a16,16,0,0,1-16-16V128a16,16,0,0,1,32,0v128h80a16,16,0,0,1,0,32Z"
                  />
                </svg>
              </span>
              <span>{{ formatDate(item.createTime) }}</span>
            </div>

            <div class="flex items-center text-xs text-white">
              <span class="pr-1 flex items-center">
                <!-- Fire Icon -->
                <svg
                  class="p-1 mt-[-2px] mr-[3px] w-[23px] h-[23px] text-white rounded-full align-middle bg-[#eb373a]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12.0003 3L11.8719 3.00327C11.3857 3.03668 10.9749 3.39867 10.9023 3.88048L10.875 4.19526C10.875 5.56708 9.94966 6.74542 8.65349 7.0863L8.35634 7.15176L8.14083 7.18183C6.46743 7.37113 5.37893 9.17296 6.00762 10.7441L6.11303 10.9859L6.18342 11.1278C6.67134 12.0714 6.75895 13.1601 6.42512 14.1627L6.32671 14.436C6.01254 15.228 5.75924 16.0593 5.56942 16.9209C5.16335 18.7641 6.36881 20.5962 8.24357 20.9238C13.2031 21.7906 17.6535 18.1565 18.1215 13.2536L18.1455 12.9696C18.2587 11.3764 17.3722 9.87329 15.9083 9.17645L15.6322 9.03362C15.3418 8.86877 15.1768 8.54929 15.2045 8.21731L15.2152 7.97014C15.2343 7.36159 14.8694 6.80424 14.3013 6.57463L14.0765 6.49163C13.2929 6.2223 12.8943 5.31464 13.2505 4.56842L13.3361 4.37257C13.5181 3.91896 13.2917 3.40058 12.8465 3.23594L12.5546 3.15392L12.2858 3.09886L12.0003 3Z"
                  />
                </svg>
              </span>
              <span>{{ item.view }}</span>
            </div>

            <div class="flex items-center text-xs text-white">
              <span class="pr-1 flex items-center">
                <!-- Tag Icon -->
                <svg
                  class="p-1 mt-[-2px] mr-[3px] w-[23px] h-[23px] text-white rounded-full align-middle bg-[#f5a630]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.75 6.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"></path>
                  <path
                    fill-rule="evenodd"
                    d="M2.5 1h8.44a1.5 1.5 0 011.06.44l10.25 10.25a1.5 1.5 0 010 2.12l-8.44 8.44a1.5 1.5 0 01-2.12 0L1.44 12A1.5 1.5 0 011 10.94V2.5A1.5 1.5 0 012.5 1zm0 1.5v8.44l10.25 10.25 8.44-8.44L10.94 2.5H2.5z"
                  ></path>
                </svg>
              </span>
              <span>{{ item.cateList?.[0]?.name }}</span>
            </div>
          </div>
        </RouterLink>
      </div>

      <div
        class="absolute w-full h-60 bg-cover bg-center"
        :style="{
          filter: 'blur(1.8rem) brightness(0.9)',
          backgroundImage: `url(${item.cover || covers[getRandom(0, covers.length - 1)]})`,
        }"
      />
    </div>

    <div v-if="!data?.total">
      <Empty info="暂无文章" />
    </div>
  </div>
</template>

<style scoped>
.text_shadow {
  text-shadow: 0 0 10px #000;
}
</style>
