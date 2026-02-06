<script setup lang="ts">
/**
 * IconCloud 3D 技术图标云组件
 * 使用纯 CSS/JS 实现 3D 球体效果
 */
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Props {
  iconSlugs?: string[]
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  iconSlugs: () => [
    'vue',
    'typescript',
    'javascript',
    'java',
    'springboot',
    'mysql',
    'redis',
    'docker',
    'git',
    'github',
    'vite',
    'nodedotjs',
    'tailwindcss',
    'css3',
    'html5',
    'python',
    'linux',
    'nginx',
    'react',
    'webpack',
  ],
  size: 400,
})

const containerRef = ref<HTMLElement | null>(null)
const rotation = ref({ x: 0, y: 0 })
const radius = computed(() => props.size / 2)
let animationId: number | null = null
let isHovering = false
let mouseX = 0
let mouseY = 0

// 计算每个图标在球体上的位置
const iconPositions = computed(() => {
  const total = props.iconSlugs.length
  const goldenRatio = (1 + Math.sqrt(5)) / 2

  return props.iconSlugs.map((slug, i) => {
    // 使用黄金螺旋分布算法实现均匀球面分布
    const theta = (2 * Math.PI * i) / goldenRatio
    const phi = Math.acos(1 - (2 * (i + 0.5)) / total)

    const x = Math.sin(phi) * Math.cos(theta)
    const y = Math.sin(phi) * Math.sin(theta)
    const z = Math.cos(phi)

    return { slug, x, y, z }
  })
})

// 获取图标 CDN URL
const getIconUrl = (slug: string) => {
  return `https://cdn.simpleicons.org/${slug}`
}

// 计算旋转后的 3D 位置
const getTransformedPosition = (pos: { x: number; y: number; z: number }) => {
  const radX = (rotation.value.x * Math.PI) / 180
  const radY = (rotation.value.y * Math.PI) / 180

  // 绕 Y 轴旋转
  let x1 = pos.x * Math.cos(radY) - pos.z * Math.sin(radY)
  let z1 = pos.x * Math.sin(radY) + pos.z * Math.cos(radY)
  let y1 = pos.y

  // 绕 X 轴旋转
  let y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX)
  let z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX)
  let x2 = x1

  return { x: x2, y: y2, z: z2 }
}

// 动画循环
const animate = () => {
  if (!isHovering) {
    rotation.value.y += 0.3
  } else {
    // 鼠标控制旋转
    rotation.value.y += (mouseX - 0.5) * 2
    rotation.value.x += (mouseY - 0.5) * 2
  }
  animationId = requestAnimationFrame(animate)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  mouseX = (e.clientX - rect.left) / rect.width
  mouseY = (e.clientY - rect.top) / rect.height
}

const handleMouseEnter = () => {
  isHovering = true
}

const handleMouseLeave = () => {
  isHovering = false
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="icon-cloud-container relative mx-auto"
    :style="{ width: `${size}px`, height: `${size}px` }"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      v-for="(pos, index) in iconPositions"
      :key="pos.slug"
      class="icon-item absolute transition-all duration-100"
      :style="{
        left: `${50 + getTransformedPosition(pos).x * 45}%`,
        top: `${50 + getTransformedPosition(pos).y * 45}%`,
        transform: `translate(-50%, -50%) scale(${0.5 + (getTransformedPosition(pos).z + 1) * 0.3})`,
        opacity: 0.3 + (getTransformedPosition(pos).z + 1) * 0.35,
        zIndex: Math.floor((getTransformedPosition(pos).z + 1) * 50),
      }"
    >
      <img
        :src="getIconUrl(pos.slug)"
        :alt="pos.slug"
        class="w-10 h-10 object-contain hover:scale-150 transition-transform duration-200 cursor-pointer"
        loading="lazy"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
    </div>
  </div>
</template>

<style scoped>
.icon-cloud-container {
  perspective: 1000px;
}

.icon-item {
  will-change: transform, opacity;
}
</style>
