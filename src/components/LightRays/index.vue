<script setup lang="ts">
/**
 * LightRays 光束效果组件
 * 使用 WebGL (OGL) 实现光束跟随鼠标效果
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Renderer, Program, Triangle, Mesh } from 'ogl'

// 定义光源位置类型
type RaysOrigin =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'right'
  | 'left'
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left'

// 定义组件 Props
interface Props {
  raysOrigin?: RaysOrigin
  raysColor?: string
  raysSpeed?: number
  lightSpread?: number
  rayLength?: number
  pulsating?: boolean
  fadeDistance?: number
  saturation?: number
  followMouse?: boolean
  mouseInfluence?: number
  noiseAmount?: number
  distortion?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  raysOrigin: 'top-center',
  raysColor: '#ffffff',
  raysSpeed: 1,
  lightSpread: 1,
  rayLength: 2,
  pulsating: false,
  fadeDistance: 1.0,
  saturation: 1.0,
  followMouse: true,
  mouseInfluence: 0.1,
  noiseAmount: 0.0,
  distortion: 0.0,
  className: '',
})

// 容器引用
const containerRef = ref<HTMLDivElement | null>(null)

// 内部状态
let renderer: Renderer | null = null
let mesh: Mesh | null = null
let uniforms: Record<string, { value: number | number[] }> | null = null
let animationId: number | null = null
const mousePos = { x: 0.5, y: 0.5 }
const smoothMouse = { x: 0.5, y: 0.5 }

// 十六进制颜色转 RGB
const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1, 1, 1]
}

// 根据光源位置获取锚点和方向
const getAnchorAndDir = (
  origin: RaysOrigin,
  w: number,
  h: number,
): { anchor: [number, number]; dir: [number, number] } => {
  const outside = 0.2
  switch (origin) {
    case 'top-left':
      return { anchor: [0, -outside * h], dir: [0, 1] }
    case 'top-right':
      return { anchor: [w, -outside * h], dir: [0, 1] }
    case 'left':
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] }
    case 'right':
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] }
    case 'bottom-left':
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] }
    case 'bottom-center':
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] }
    case 'bottom-right':
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] }
    default: // "top-center"
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] }
  }
}

// 顶点着色器
const vertexShader = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`

// 片段着色器 - 实现光束效果
const fragmentShader = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;

  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);

  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);

  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}`

// 初始化 WebGL
const initWebGL = () => {
  if (!containerRef.value) return

  // 创建渲染器
  renderer = new Renderer({
    dpr: Math.min(window.devicePixelRatio, 2),
    alpha: true,
  })

  const gl = renderer.gl
  gl.canvas.style.width = '100%'
  gl.canvas.style.height = '100%'

  // 清空容器并添加 canvas
  while (containerRef.value.firstChild) {
    containerRef.value.removeChild(containerRef.value.firstChild)
  }
  containerRef.value.appendChild(gl.canvas)

  // 创建 uniforms
  uniforms = {
    iTime: { value: 0 },
    iResolution: { value: [1, 1] },
    rayPos: { value: [0, 0] },
    rayDir: { value: [0, 1] },
    raysColor: { value: hexToRgb(props.raysColor) },
    raysSpeed: { value: props.raysSpeed },
    lightSpread: { value: props.lightSpread },
    rayLength: { value: props.rayLength },
    pulsating: { value: props.pulsating ? 1.0 : 0.0 },
    fadeDistance: { value: props.fadeDistance },
    saturation: { value: props.saturation },
    mousePos: { value: [0.5, 0.5] },
    mouseInfluence: { value: props.mouseInfluence },
    noiseAmount: { value: props.noiseAmount },
    distortion: { value: props.distortion },
  }

  // 创建几何体和程序
  const geometry = new Triangle(gl)
  const program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms,
  })
  mesh = new Mesh(gl, { geometry, program })

  // 更新尺寸和位置
  updatePlacement()
}

// 更新尺寸和光源位置
const updatePlacement = () => {
  if (!containerRef.value || !renderer || !uniforms) return

  renderer.dpr = Math.min(window.devicePixelRatio, 2)

  const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.value
  renderer.setSize(wCSS, hCSS)

  const dpr = renderer.dpr
  const w = wCSS * dpr
  const h = hCSS * dpr

  uniforms.iResolution.value = [w, h]

  const { anchor, dir } = getAnchorAndDir(props.raysOrigin, w, h)
  uniforms.rayPos.value = anchor
  uniforms.rayDir.value = dir
}

// 动画循环
const loop = (t: number) => {
  if (!renderer || !uniforms || !mesh) return

  uniforms.iTime.value = t * 0.001

  // 平滑鼠标跟随
  if (props.followMouse && props.mouseInfluence > 0.0) {
    const smoothing = 0.92
    smoothMouse.x = smoothMouse.x * smoothing + mousePos.x * (1 - smoothing)
    smoothMouse.y = smoothMouse.y * smoothing + mousePos.y * (1 - smoothing)
    uniforms.mousePos.value = [smoothMouse.x, smoothMouse.y]
  }

  try {
    renderer.render({ scene: mesh })
    animationId = requestAnimationFrame(loop)
  } catch (error) {
    console.warn('WebGL rendering error:', error)
  }
}

// 处理鼠标移动
const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value || !renderer) return
  const rect = containerRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  mousePos.x = x
  mousePos.y = y
}

// 清理资源
const cleanup = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  window.removeEventListener('resize', updatePlacement)
  window.removeEventListener('mousemove', handleMouseMove)

  if (renderer) {
    try {
      const canvas = renderer.gl.canvas
      const loseContextExt = renderer.gl.getExtension('WEBGL_lose_context')
      if (loseContextExt) {
        loseContextExt.loseContext()
      }
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    } catch (error) {
      console.warn('Error during WebGL cleanup:', error)
    }
  }

  renderer = null
  mesh = null
  uniforms = null
}

// 监听 props 变化
watch(
  () => [
    props.raysColor,
    props.raysSpeed,
    props.lightSpread,
    props.rayLength,
    props.pulsating,
    props.fadeDistance,
    props.saturation,
    props.mouseInfluence,
    props.noiseAmount,
    props.distortion,
    props.raysOrigin,
  ],
  () => {
    if (!uniforms) return
    uniforms.raysColor.value = hexToRgb(props.raysColor)
    uniforms.raysSpeed.value = props.raysSpeed
    uniforms.lightSpread.value = props.lightSpread
    uniforms.rayLength.value = props.rayLength
    uniforms.pulsating.value = props.pulsating ? 1.0 : 0.0
    uniforms.fadeDistance.value = props.fadeDistance
    uniforms.saturation.value = props.saturation
    uniforms.mouseInfluence.value = props.mouseInfluence
    uniforms.noiseAmount.value = props.noiseAmount
    uniforms.distortion.value = props.distortion
    updatePlacement()
  },
)

onMounted(() => {
  initWebGL()
  window.addEventListener('resize', updatePlacement)
  if (props.followMouse) {
    window.addEventListener('mousemove', handleMouseMove)
  }
  animationId = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div
    ref="containerRef"
    :class="['w-full h-full pointer-events-none z-[3] overflow-hidden relative', props.className]"
  />
</template>
