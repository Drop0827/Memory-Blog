<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: string[]
}>()

const positions = [
  { left: '10px', top: '0' },
  { left: '160px', top: '0' },
  { right: '160px', top: '0' },
  { right: '10px', top: '0' },
]
</script>

<template>
  <div class="w-full hidden md:block">
    <div
      v-for="(item, index) in data"
      :key="index"
      class="lantern-box z-[999]"
      :style="positions[index % positions.length]"
    >
      <div class="lantern-light">
        <div class="lantern-line"></div>
        <div class="lantern-circle">
          <div class="lantern-rect">
            <div class="lantern-text">{{ item }}</div>
          </div>
        </div>
        <div class="lantern-tassel-top">
          <div class="lantern-tassel-middle"></div>
          <div class="lantern-tassel-bottom"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
