<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useConfigStore } from '@/stores'
import { getWebConfigByName } from '@/api'
import AppFooter from '@/components/Footer/index.vue'

const configStore = useConfigStore()
const route = useRoute()

const showFooter = computed(() => route.name !== 'memories')

onMounted(async () => {
  try {
    const [webRes, themeRes, otherRes] = await Promise.all([
      getWebConfigByName('web'),
      getWebConfigByName('theme'),
      getWebConfigByName('other'),
    ])

    if (webRes.code === 200 && webRes.data && webRes.data.value) {
      configStore.setWeb(webRes.data.value)
    }
    if (themeRes.code === 200 && themeRes.data && themeRes.data.value) {
      configStore.setTheme(themeRes.data.value)
    }
    if (otherRes.code === 200 && otherRes.data && otherRes.data.value) {
      configStore.setOther(otherRes.data.value)
    }
  } catch (error) {
    console.error('Failed to init config:', error)
  }
})
</script>

<template>
  <!-- 路由占位符，以后页面跳转都会显示在这里 -->
  <router-view />
  <AppFooter v-if="showFooter" />
</template>

<style>
/* 暂时留空 */
</style>
