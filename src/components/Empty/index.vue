<script setup lang="ts">
import EmptySvg from '@/assets/svg/other/empty.svg'

defineProps<{
  info: string
}>()
</script>

<template>
  <div class="w-52 mx-auto py-12 mt-5">
    <img :src="EmptySvg" alt="空状态" width="208" height="144" />
    <div class="pt-5 text-center text-gray-700 dark:text-white">{{ info }}</div>
  </div>
</template>
