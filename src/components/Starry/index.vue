<script setup lang="ts">
import { onMounted } from 'vue'
import './index.scss'

const initStars = () => {
  /*星星的密集程度，数字越大越多*/
  const stars = 800
  const starsContainer = document.querySelector('.stars_starrySky')
  if (!starsContainer) return

  // 清空现有星星防止重复
  starsContainer.innerHTML = ''

  /*星星的看起来的距离,值越大越远*/
  const r = 800
  for (let i = 0; i < stars; i++) {
    const star = document.createElement('div')
    star.classList.add('star_starrySky')
    starsContainer.appendChild(star)
  }

  const starElements = document.querySelectorAll<HTMLElement>('.star_starrySky')
  starElements.forEach((starElement) => {
    const s = 0.2 + Math.random() * 1
    const curR = r + Math.random() * 300
    starElement.style.transformOrigin = `0 0 ${curR}px`
    starElement.style.transform = `translate3d(0,0,-${curR}px) rotateY(${Math.random() * 360}deg) rotateX(${Math.random() * -50}deg) scale(${s},${s})`
  })
}

onMounted(() => {
  initStars()
})
</script>

<template>
  <div class="StarryComponent fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
    <div class="overflow-hidden absolute w-full h-[180%] sm:h-[160%] md:h-[150%]">
      {/*背景层*/}
      <div class="stars_starrySky"></div>
    </div>
  </div>
</template>
