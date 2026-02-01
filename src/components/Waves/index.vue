<script setup lang="ts">
// 这是一个纯展示组件，没有复杂的逻辑
</script>

<template>
  <div>
    <svg
      class="waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g class="parallax">
        <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
        <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
        <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
        <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.waves {
  position: relative;
  width: 100%;
  height: 6vh; /* 大幅减小高度 */
  margin-bottom: -7px; /*Fix for safari gap*/
  min-height: 40px; /* 减小最小高度 */
  max-height: 60px; /* 限制最大高度 */
}

/* Animation */

.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

/* Dark mode adjustment for the last wave to match background */
:global(.dark) .parallax > use:nth-child(4) {
  fill: #0d1320; /* 假设暗黑模式背景是这个颜色 */
}
:global(.dark) .parallax > use:nth-child(1) {
  fill: rgba(13, 19, 32, 0.7);
}
:global(.dark) .parallax > use:nth-child(2) {
  fill: rgba(13, 19, 32, 0.5);
}
:global(.dark) .parallax > use:nth-child(3) {
  fill: rgba(13, 19, 32, 0.3);
}

/*Shrinking for mobile*/
@media (max-width: 768px) {
  .waves {
    height: 40px;
    min-height: 40px;
  }
}
</style>
