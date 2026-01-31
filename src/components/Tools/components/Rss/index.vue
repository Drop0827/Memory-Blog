<script setup lang="ts">
import Modal from '@/components/Modal/index.vue'
import type { Web } from '@/types/app/config'

const props = defineProps<{
  show: boolean
  data?: Web
}>()

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<template>
  <Modal :show="show" title="查看订阅地址" @close="close">
    <div
      class="bg-gray-100 dark:bg-black/20 p-4 rounded-lg font-mono text-sm break-all select-all dark:text-gray-300"
    >
      {{ (data?.url || '') + '/api/rss' }}
    </div>
  </Modal>
</template>
