<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { getRandom } from '@/utils'
import Ripple from '@/components/Ripple/index.vue'

const props = withDefaults(
  defineProps<{
    src?: string
    isRipple?: boolean
  }>(),
  {
    isRipple: true,
  },
)

const configStore = useConfigStore()
const { theme } = storeToRefs(configStore)

const bgImage = computed(() => {
  if (props.src) return props.src
  const covers = theme.value?.covers || []
  if (covers.length > 0) {
    return covers[getRandom(0, covers.length - 1)]
  }
  return '' // Fallback
})
</script>

<template>
  <div>
    <div
      class="overflow-hidden h-[300px] sm:h-[400px] md:h-[500px] relative bg-cover bg-center after:content-[''] after:w-full after:h-[20%] after:absolute after:bottom-0 after:left-0 after:bg-[linear-gradient(to_top,#fff,transparent)] dark:after:bg-[linear-gradient(to_top,#2c333e,transparent)]"
      :style="{ backgroundImage: `url(${bgImage})` }"
    >
      <div class="absolute top-0 left-0 bg-[rgba(0,0,0,0.2)] w-full h-full"></div>
      <div>
        <slot />
      </div>
    </div>

    <Ripple v-if="isRipple" />
  </div>
</template>
