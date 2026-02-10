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
  isFullScreen?: boolean
  footprints?: Array<{
    position: [number, number]
    image: string
    title: string
  }>
}

const props = withDefaults(defineProps<Props>(), {
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_JS_CODE,
  apiKey: import.meta.env.VITE_AMAP_KEY,
  center: () => [117.853829, 29.922533],
  markerPosition: () => [121.853829, 29.922533],
  zoom: 6.8,
  footprints: () => [],
})

const mapId = `amap-${Math.random().toString(36).substr(2, 9)}`
const isLoading = ref(true)
let map: any = null

const emit = defineEmits<{
  (e: 'select-image', imageUrl: string): void
}>()

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
      map = new AMap.Map(mapId, {
        mapStyle: 'amap://styles/grey',
        viewMode: '3D',
        zoom: props.zoom,
        center: props.center,
      })

      // 如果提供了 footprints 列表，则渲染多个自定义头像 Marker
      if (props.footprints && props.footprints.length > 0) {
        props.footprints.forEach((fp) => {
          // 创建自定义内容
          const content = document.createElement('div')
          content.className = 'custom-marker'
          content.style.width = '48px'
          content.style.height = '48px'
          content.style.borderRadius = '50%'
          content.style.overflow = 'hidden'
          content.style.border = '2px solid white'
          content.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)'

          const img = document.createElement('img')
          img.src = fp.image
          img.style.width = '100%'
          img.style.height = '100%'
          img.style.objectFit = 'cover'
          content.appendChild(img)

          const marker = new AMap.Marker({
            position: fp.position,
            title: fp.title,
            content: content,
            offset: new AMap.Pixel(-24, -24), // Center the 48x48 marker
            anchor: 'center',
          })

          marker.on('click', () => {
            map.setCenter(marker.getPosition())
            map.setZoom(10)
            emit('select-image', fp.image)
          })

          map.add(marker)
        })
      } else {
        // Fallback or specific single marker usage
        const marker = new AMap.Marker({
          position: props.markerPosition,
          title: '目标位置',
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          offset: new AMap.Pixel(-10, -30),
        })
        map.add(marker)
        marker.on('click', () => {
          map.setCenter(marker.getPosition())
          map.setZoom(15)
        })
      }

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
  <Teleport to="body" :disabled="!isFullScreen">
    <div
      :class="[
        isFullScreen
          ? 'fixed inset-0 h-screen w-screen z-0'
          : 'w-full h-[700px] border border-gray-800 rounded-3xl mt-10 relative overflow-hidden',
      ]"
    >
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
      <div :id="mapId" class="w-full h-full"></div>
    </div>
  </Teleport>
</template>
