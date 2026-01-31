<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import ICPIcon from '@/components/Footer/images/ICP.png'

const props = defineProps<{
  icp?: string
}>()

const icpRef = ref<HTMLElement | null>(null)

const isHtml = computed(() => {
  const val = props.icp || ''
  return val.includes('<') || val.includes('script')
})

const processScripts = () => {
  if (isHtml.value && icpRef.value) {
    icpRef.value.innerHTML = props.icp || ''

    const scripts = icpRef.value.getElementsByTagName('script')
    Array.from(scripts).forEach((oldScript) => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      newScript.textContent = oldScript.textContent
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }
}

watch(
  () => props.icp,
  () => {
    nextTick(processScripts)
  },
)

onMounted(() => {
  processScripts()
})
</script>

<template>
  <div v-if="icp" class="flex flex-col items-center gap-2 pb-4">
    <div class="group flex justify-center items-center space-x-2 cursor-pointer">
      <img v-if="!isHtml" :src="ICPIcon" alt="ICP" width="20" height="22" class="w-5 h-[22px]" />

      <div v-if="isHtml" ref="icpRef" class="group-hover:text-blue-500 flex items-center"></div>

      <a
        v-else
        href="https://beian.miit.gov.cn"
        target="_blank"
        rel="noopener noreferrer"
        class="group-hover:text-blue-500 transition-colors"
      >
        {{ icp }}
      </a>
    </div>
  </div>
</template>
