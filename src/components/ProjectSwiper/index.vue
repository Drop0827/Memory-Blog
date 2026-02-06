<script setup lang="ts">
/**
 * ProjectSwiper 作品展示轮播组件
 * 基于原作者的 Swiper 组件移植到 Vue 3
 */
import { ref, computed } from 'vue'

interface SwiperItem {
  id: number
  src: string
  title: string
  url?: string
}

interface Props {
  items?: SwiperItem[]
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    {
      id: 1,
      src: 'https://bu.dusays.com/2025/08/29/68b16f22981d4.jpg',
      title: '示例项目 1',
      url: '#',
    },
    {
      id: 2,
      src: 'https://bu.dusays.com/2025/08/09/689624f3698af.jpg',
      title: '示例项目 2',
      url: '#',
    },
    {
      id: 3,
      src: 'https://bu.dusays.com/2024/09/17/66e96ca781d49.png',
      title: '示例项目 3',
      url: '#',
    },
  ],
})

const currentIndex = ref(2)
const isHovering = ref(false)

// 复制数组实现无缝滚动
const duplicatedItems = computed(() => [...props.items, ...props.items])

const handlePrev = () => {
  currentIndex.value = currentIndex.value === 0 ? props.items.length - 1 : currentIndex.value - 1
}

const handleNext = () => {
  currentIndex.value = (currentIndex.value + 1) % props.items.length
}

const openUrl = (url?: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="swiper-container">
    <h2 class="text-white text-3xl text-center relative top-32 z-10">我的作品 🥳</h2>

    <div class="banner" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
      <div
        class="img-wrapper"
        :style="{
          transform: `translateX(-${currentIndex * 26.78}vw)`,
          transition: isHovering ? 'none' : 'transform 0.5s ease',
        }"
      >
        <div
          v-for="(item, index) in duplicatedItems"
          :key="`${item.id}-${index}`"
          class="img-box"
          @click="openUrl(item.url)"
        >
          <div class="info">
            <h3>{{ item.title }}</h3>
          </div>
          <img :src="item.src" :alt="item.title" />
        </div>
      </div>
    </div>

    <div class="btn-group">
      <button class="btn" @click="handlePrev">
        <svg class="icon" viewBox="0 0 1024 1024" width="30" height="30">
          <path
            d="M862.485 481.154H234.126l203.3-203.3c12.497-12.497 12.497-32.758 0-45.255s-32.758-12.497-45.255 0L135.397 489.373c-12.497 12.497-12.497 32.758 0 45.254l256.774 256.775c6.249 6.248 14.438 9.372 22.627 9.372s16.379-3.124 22.627-9.372c12.497-12.497 12.497-32.759 0-45.255l-203.3-203.301h628.36c17.036 0 30.846-13.81 30.846-30.846s-13.81-30.846-30.846-30.846z"
          />
        </svg>
      </button>
      <button class="btn" @click="handleNext">
        <svg class="icon rotate-180" viewBox="0 0 1024 1024" width="30" height="30">
          <path
            d="M862.485 481.154H234.126l203.3-203.3c12.497-12.497 12.497-32.758 0-45.255s-32.758-12.497-45.255 0L135.397 489.373c-12.497 12.497-12.497 32.758 0 45.254l256.774 256.775c6.249 6.248 14.438 9.372 22.627 9.372s16.379-3.124 22.627-9.372c12.497-12.497 12.497-32.759 0-45.255l-203.3-203.301h628.36c17.036 0 30.846-13.81 30.846-30.846s-13.81-30.846-30.846-30.846z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.swiper-container {
  --post-spacing: 1.78vw;
  --post-size: 25vw;
  --mask-size: 100vw;
  position: relative;
  width: 100vw;
  height: 100vh;
}

.banner {
  overflow: hidden;
  position: relative;
  width: 100vw;
  height: calc(var(--post-size) / 0.72);
  mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDE0NDAgNTAwIiBpZD0iaiI+CiAgPHBhdGggZmlsbD0icmdiKDIwMCwyMDAsMjAwKSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCAwczI3NS4wNCAxMDAgNzIwIDEwMFMxNDQwIDAgMTQ0MCAwdjUwMHMtMjc1LjA0LTEwMC03MjAtMTAwUzAgNTAwIDAgNTAwVjB6Ii8+Cjwvc3ZnPgo=);
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: var(--mask-size);
  position: absolute;
  top: 10%;
}

.img-wrapper {
  display: flex;
  position: absolute;
  width: max-content;
  height: calc(var(--post-size) / 0.72);
  transform: translate(13.39vw, 0);
}

.img-box {
  height: 100%;
  margin-right: var(--post-spacing);
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.img-box .info {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: hsla(0, 0%, 9%, 0.5);
  text-align: center;
  color: #fff9f1;
  font-size: 1.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.img-box:hover .info {
  opacity: 1;
}

.img-box img {
  width: 100%;
  height: 100%;
  object-position: center;
  object-fit: cover;
  display: block;
}

.btn-group {
  height: 15vh;
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translate(-50%, -50%);
  transition: opacity 1s;
  opacity: 0;
  display: flex;
  z-index: 10;
}

.banner:hover ~ .btn-group,
.btn-group:hover {
  opacity: 1;
}

.btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid #171717;
  background-color: #fff;
  margin: 10px;
  cursor: pointer;
  transition: 0.4s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:hover {
  transform: scale(1.2);
  background-color: #000;
}

.btn:hover .icon {
  fill: #fff;
}
</style>
