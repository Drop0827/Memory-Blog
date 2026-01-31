<script setup lang="ts">
import { computed } from 'vue'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

const props = defineProps<{
  class?: string
}>()

const className = computed(() =>
  twMerge(clsx('skeleton rounded-md bg-gray-200 dark:bg-gray-800', props.class)),
)
</script>

<template>
  <div :class="className"></div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
