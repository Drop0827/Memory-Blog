<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useConfigStore } from '@/stores'
import { storeToRefs } from 'pinia'
import TimerSvg from '@/assets/svg/other/timer.svg'

// Animation utility
const useAnimatedNumber = (targetValue: number, duration = 2000) => {
  const current = ref(0)

  const start = () => {
    const startTime = performance.now()
    const startValue = 0

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3)

      current.value = Math.round(startValue + (targetValue - startValue) * ease)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        current.value = targetValue
      }
    }

    requestAnimationFrame(animate)
  }

  // Auto start if target changes
  watch(
    () => targetValue,
    () => {
      start()
    },
    { immediate: true },
  )

  return current
}

const configStore = useConfigStore()
const { web } = storeToRefs(configStore)
const showDetailed = ref(false)

const calculateTimeDifference = (startTimestamp: number) => {
  if (!startTimestamp) return { years: 0, months: 0, days: 0, totalDays: 0 }

  const startDate = new Date(+startTimestamp)
  const currentDate = new Date()

  let years = currentDate.getFullYear() - startDate.getFullYear()
  let months = currentDate.getMonth() - startDate.getMonth()
  let days = currentDate.getDate() - startDate.getDate()

  if (days < 0) {
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
    days += lastMonth.getDate()
    months--
  }
  if (months < 0) {
    months += 12
    years--
  }

  const totalDays = Math.floor(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  )

  return { years, months, days, totalDays }
}

const timeDiff = computed(() => calculateTimeDifference(Number(web.value?.create_time || 0)))

// Animate total days
const animatedTotal = useAnimatedNumber(timeDiff.value.totalDays, 2000)

// Watch for animation completion roughly by time or value check
setTimeout(() => {
  showDetailed.value = true
}, 2500) // Slightly longer than transition
</script>

<template>
  <div
    class="flex flex-col tw_container bg-white dark:bg-black-b p-4 mb-5 tw_title rounded-xl shadow-sm"
  >
    <div class="tw_title w-full dark:text-white flex items-center mb-3">
      <img :src="TimerSvg" alt="站点运行时间" width="33" height="23" />
      <span class="ml-2 font-bold">站点运行时间</span>
    </div>

    <div class="mt-2.5 dark:text-gray-400 font-mono text-lg text-center">
      <transition name="fade" mode="out-in">
        <span v-if="!showDetailed" key="total"> {{ animatedTotal }} 天 </span>
        <div v-else key="detail" class="flex justify-center gap-2">
          <span>{{ timeDiff.years }} 年</span>
          <span>{{ timeDiff.months }} 个月</span>
          <span>{{ timeDiff.days }} 天</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
