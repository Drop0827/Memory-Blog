<script setup lang="ts">
/**
 * AMapContainer 高德地图组件
 * 基于原作者的 Map 组件移植到 Vue 3
 */
import { ref, onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

// 为高德地图添加全局类型声明
declare global {
  interface Window {
    _AMapSecurityConfig: {
      securityJsCode: string
    }
  }
}

interface Props {
  securityJsCode?: string
  apiKey?: string
  center?: [number, number]
  markerPosition?: [number, number]
  zoom?: number
}

const props = withDefaults(defineProps<Props>(), {
  securityJsCode: 'c8c59309d679d989a8a56461956cdd38',
  apiKey: 'dad939358a9a25219a1c42c8d62cb218',
  center: () => [117.853829, 29.922533],
  markerPosition: () => [121.853829, 29.922533],
  zoom: 6.8,
})

const isLoading = ref(true)
let map: any = null

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: props.securityJsCode,
  }

  AMapLoader.load({
    key: props.apiKey,
    version: '2.0',
    plugins: ['AMap.Scale', 'AMap.Marker', 'AMap.InfoWindow'],
  })
    .then((AMap) => {
      map = new AMap.Map('amap-container', {
        mapStyle: 'amap://styles/grey',
        viewMode: '3D',
        zoom: props.zoom,
        center: props.center,
      })

      // 添加标记点
      const marker = new AMap.Marker({
        position: props.markerPosition,
        title: '目标位置',
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        offset: new AMap.Pixel(-10, -30),
      })

      map.add(marker)

      // 标记点点击事件
      marker.on('click', () => {
        map.setCenter(marker.getPosition())
        map.setZoom(15)
      })

      isLoading.value = false
    })
    .catch((e) => {
      console.error('地图加载失败:', e)
      isLoading.value = false
    })
})

onUnmounted(() => {
  map?.destroy()
})
</script>

<template>
  <div class="w-full h-[700px] border border-gray-800 rounded-3xl mt-10 relative overflow-hidden">
    <!-- 加载状态 -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-black/80 z-10"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"
        ></div>
        <p class="text-white">地图加载中...</p>
      </div>
    </div>
    <!-- 地图容器 -->
    <div id="amap-container" class="w-full h-full"></div>
  </div>
</template>
