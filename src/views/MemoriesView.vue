<script setup lang="ts">
import { ref, computed } from 'vue'

// 当前选中的标签
const activeTab = ref<'albums' | 'footprints'>('albums')

// 相册数据
const albums = ref([
  {
    id: 1,
    name: '全部',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    count: 699,
  },
  {
    id: 2,
    name: '嘉兴',
    cover: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400',
    count: 16,
  },
  {
    id: 3,
    name: '南京',
    cover: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400',
    count: 52,
  },
  {
    id: 4,
    name: '香格里拉',
    cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
    count: 48,
  },
  {
    id: 5,
    name: '温州',
    cover: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
    count: 12,
  },
  {
    id: 6,
    name: '杭州',
    cover: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400',
    count: 15,
  },
  {
    id: 7,
    name: '丽江',
    cover: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400',
    count: 52,
  },
  {
    id: 8,
    name: '金华',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    count: 100,
  },
])

// 足迹数据
const footprints = ref([
  {
    id: 1,
    name: '浙江',
    cover: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
    cities: ['杭州', '温州', '嘉兴', '金华'],
  },
  {
    id: 2,
    name: '云南',
    cover: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400',
    cities: ['昆明', '丽江', '香格里拉', '大理'],
  },
  {
    id: 3,
    name: '江苏',
    cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
    cities: ['南京', '苏州', '无锡'],
  },
  {
    id: 4,
    name: '四川',
    cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    cities: ['成都', '九寨沟', '稻城'],
  },
])

// 统计信息
const stats = computed(() => ({
  totalAlbums: albums.value.length,
  totalPhotos: albums.value.reduce((sum, album) => sum + album.count, 0),
  totalProvinces: footprints.value.length,
  totalCities: footprints.value.reduce((sum, fp) => sum + fp.cities.length, 0),
}))
</script>

<template>
  <div class="memories-page min-h-screen bg-[#0f1117] pt-24 pb-12">
    <div class="container mx-auto px-6 lg:px-12 max-w-7xl">
      <!-- 页面标题和标签切换 -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">回忆录</h1>
          <p class="text-gray-400">
            <template v-if="activeTab === 'albums'"> 共 {{ stats.totalAlbums }} 个相册 </template>
            <template v-else>
              共 {{ stats.totalProvinces }} 个省份，{{ stats.totalCities }} 个城市
            </template>
          </p>
        </div>

        <!-- 标签切换 -->
        <div class="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
          <button
            @click="activeTab = 'albums'"
            class="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="
              activeTab === 'albums' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
            "
          >
            <span>📷</span>
            <span>相册</span>
          </button>
          <button
            @click="activeTab = 'footprints'"
            class="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="
              activeTab === 'footprints'
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            "
          >
            <span>👣</span>
            <span>足迹</span>
          </button>
        </div>
      </div>

      <!-- 相册网格 -->
      <div
        v-if="activeTab === 'albums'"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        <div
          v-for="album in albums"
          :key="album.id"
          class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
        >
          <!-- 封面图 -->
          <img
            :src="album.cover"
            :alt="album.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <!-- 渐变遮罩 -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          ></div>

          <!-- 相册信息 -->
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="text-white font-bold text-lg mb-1">{{ album.name }}</h3>
            <div class="flex items-center gap-2 text-gray-300 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <span>{{ album.count }} 张照片</span>
            </div>
          </div>

          <!-- 悬浮效果 -->
          <div
            class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
        </div>
      </div>

      <!-- 足迹网格 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="footprint in footprints"
          :key="footprint.id"
          class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
        >
          <!-- 封面图 -->
          <img
            :src="footprint.cover"
            :alt="footprint.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <!-- 渐变遮罩 -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          ></div>

          <!-- 足迹信息 -->
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="text-white font-bold text-xl mb-2">{{ footprint.name }}</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="city in footprint.cities.slice(0, 3)"
                :key="city"
                class="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
              >
                {{ city }}
              </span>
              <span
                v-if="footprint.cities.length > 3"
                class="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
              >
                +{{ footprint.cities.length - 3 }}
              </span>
            </div>
          </div>

          <!-- 悬浮效果 -->
          <div
            class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-if="
          (activeTab === 'albums' && albums.length === 0) ||
          (activeTab === 'footprints' && footprints.length === 0)
        "
        class="text-center py-20"
      >
        <span class="text-6xl mb-4 block">📷</span>
        <p class="text-gray-400 text-lg">暂无内容</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 相册卡片悬浮效果 */
.group:hover img {
  filter: brightness(1.1);
}
</style>
