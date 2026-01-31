<script setup lang="ts">
import { ref } from 'vue'
import { createAvatar } from '@dicebear/core'
import { pixelArt } from '@dicebear/collection'

const props = defineProps<{
  className?: string
}>()

// Generate seed once
const seed = Math.random().toString(36).substring(2, 15)

const avatar = createAvatar(pixelArt, {
  seed,
  size: 128,
}).toDataUri()
</script>

<template>
  <img :src="avatar" alt="Avatar" :class="className" />
</template>
