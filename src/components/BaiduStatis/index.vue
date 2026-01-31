<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useConfigStore } from '@/stores'
import { storeToRefs } from 'pinia'

const configStore = useConfigStore()
const { other } = storeToRefs(configStore)
let scriptEl: HTMLScriptElement | null = null

const loadScript = () => {
  if (other.value?.baidu_token && !scriptEl) {
    // Type definition for window._hmt
    ;(window as any)._hmt = (window as any)._hmt || []

    scriptEl = document.createElement('script')
    scriptEl.src = `https://hm.baidu.com/hm.js?${other.value.baidu_token}`
    scriptEl.async = true
    document.head.appendChild(scriptEl)
  }
}

watch(
  () => other.value?.baidu_token,
  () => {
    loadScript()
  },
)

onMounted(() => {
  loadScript()
})

onUnmounted(() => {
  if (scriptEl && document.head.contains(scriptEl)) {
    document.head.removeChild(scriptEl)
  }
})
</script>

<template>
  <div style="display: none"></div>
</template>
