<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AMapContainer from '@/components/AMapContainer/index.vue'
import { getFootprintList } from '@/api'
import type { Footprint } from '@/types/app/footprint'

// 当前选中的标签
const activeTab = ref<'albums' | 'footprints'>('albums')

// 图片预览状态
const previewImage = ref<string | null>(null)

// 足迹原始数据
const footprintList = ref<Footprint[]>([])

// 所有照片数据 (Flattened)
const allPhotos = computed(() => {
  return footprintList.value.reduce((acc, fp) => {
    let images: string[] = []
    if (Array.isArray(fp.images)) {
      images = fp.images
    } else if (typeof fp.images === 'string') {
      images = (fp.images as string).split('\n').filter(Boolean)
    }
    return acc.concat(images)
  }, [] as string[])
})

// 地图展示数据 (Derived from footprintList)
const mapFootprints = computed(() => {
  return footprintList.value
    .map((fp) => {
      // Handle images safely
      let images: string[] = []
      if (Array.isArray(fp.images)) {
        images = fp.images
      } else if (typeof fp.images === 'string') {
        images = (fp.images as string).split('\n').filter(Boolean)
      }

      const pos = fp.position ? (fp.position as string).split(',') : []
      return {
        position: [Number(pos[0]), Number(pos[1])] as [number, number],
        image: images[0] || '', // Initial image
        title: fp.address || '未知地点',
      }
    })
    .filter((item) => item.position.length === 2 && !isNaN(item.position[0]))
})

// 统计信息
const stats = computed(() => ({
  totalPhotos: allPhotos.value.length,
  totalFootprints: footprintList.value.length,
}))

// 处理地图标记点击
const handleMarkerClick = (imageUrl: string) => {
  previewImage.value = imageUrl
}

// Fetch data
onMounted(async () => {
  try {
    const res = await getFootprintList()
    if (res.code === 200 && res.data) {
      footprintList.value = res.data
    }
  } catch (e) {
    console.error('Failed to fetch footprints:', e)
  }
})
</script>

<template>
  <div class="memories-page min-h-screen bg-[#0f1117] relative">
    <!-- 悬浮头部区域 (磨砂玻璃) -->
    <div
      class="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full flex justify-center px-4"
    >
      <div
        class="pointer-events-auto bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg px-8 py-4 flex flex-col items-center gap-4 transition-all duration-300 hover:bg-black/50"
      >
        <!-- 页面标题 -->
        <div class="text-center">
          <h1
            v-if="activeTab !== 'footprints'"
            class="text-2xl font-bold text-white mb-1 drop-shadow-md"
          >
            回忆录
          </h1>
          <p v-if="activeTab !== 'footprints'" class="text-xs text-gray-300">
            <template v-if="activeTab === 'albums'"> 共 {{ stats.totalPhotos }} 张照片 </template>
            <template v-else> 共 {{ stats.totalFootprints }} 个足迹点 </template>
          </p>
        </div>

        <!-- 标签切换 -->
        <div class="flex items-center bg-white/10 rounded-full p-1 border border-white/5">
          <button
            @click="activeTab = 'albums'"
            class="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="
              activeTab === 'albums'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            "
          >
            <span>📷</span>
            <span>照片墙</span>
          </button>
          <button
            @click="activeTab = 'footprints'"
            class="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="
              activeTab === 'footprints'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            "
          >
            <span>👣</span>
            <span>足迹地图</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 全局照片墙 (全屏铺满) -->
    <div v-if="activeTab === 'albums'" class="w-full min-h-screen px-1 pt-0 pb-0">
      <div
        class="columns-2 md:columns-3 lg:columns-4 xl:columns-6 2xl:columns-8 gap-1 space-y-1 animate-fade-in mx-auto"
      >
        <div
          v-for="(img, index) in allPhotos"
          :key="index"
          class="break-inside-avoid relative group overflow-hidden cursor-zoom-in bg-gray-900/50 rounded-none"
          @click="previewImage = img"
        >
          <img
            :src="img"
            loading="lazy"
            class="w-full h-auto object-cover opacity-0 transition-opacity duration-700 ease-in-out block"
            @load="(e) => (e.target as HTMLImageElement).classList.remove('opacity-0')"
          />
          <!-- 悬浮遮罩 -->
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none"
          ></div>
        </div>
      </div>
    </div>

    <!-- 足迹地图 (全屏展示) -->
    <AMapContainer
      v-if="activeTab === 'footprints'"
      isFullScreen
      :footprints="mapFootprints"
      @select-image="handleMarkerClick"
    />

    <!-- 空状态 -->
    <div v-if="activeTab === 'albums' && allPhotos.length === 0" class="text-center py-20">
      <span class="text-6xl mb-4 block">📷</span>
      <p class="text-gray-400 text-lg">暂无照片</p>
    </div>

    <!-- 图片预览遮罩 -->
    <div
      v-if="previewImage"
      class="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out animate-fade-in"
      @click="previewImage = null"
    >
      <img
        :src="previewImage"
        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300 scale-95"
        :class="{ 'scale-100': previewImage }"
        @click.stop
      />
      <!-- 关闭按钮 -->
      <button class="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 相册卡片悬浮效果 */
.group:hover img {
  filter: brightness(1.1);
}
</style>
