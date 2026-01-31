<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getArticleDetail } from '@/api'
import Modal from '@/components/Modal/index.vue'

const props = defineProps<{
  id: number
}>()

const router = useRouter()
const route = useRoute()
const show = ref(true) // Typically Encrypt component is shown when access is denied/needed, so modal open by default?
// Or maybe it is embedded. The React code uses useDisclosure and opens on mount.

const password = ref('')
const errorMsg = ref('')

const verifyPassword = async () => {
  if (!password.value) {
    errorMsg.value = '请输入密码'
    return
  }

  try {
    const res = await getArticleDetail(props.id, password.value)
    if (res.code === 200) {
      show.value = false
      // Update URL and likely reload or let parent handle
      router.replace({ query: { ...route.query, password: password.value } })
      // If parent watches query, it should reload data.
      // Or reload page window.location.reload() if needed, but route change is better.
    } else {
      errorMsg.value = res.message || '密码错误'
    }
  } catch (e) {
    errorMsg.value = '校验失败'
    console.error(e)
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <Modal :show="show" title="该文章已加密" :width="'max-w-md'" @close="goBack">
    <div class="flex flex-col gap-4">
      <div class="relative">
        <input
          type="password"
          v-model="password"
          placeholder="文章受保护，请输入密码"
          class="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-black/20 dark:text-white"
          @keydown.enter="verifyPassword"
        />
      </div>

      <div v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</div>

      <div class="flex justify-end gap-2 mt-2">
        <button
          @click="goBack"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 rounded-lg transition-colors"
        >
          返回
        </button>
        <button
          @click="verifyPassword"
          class="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-sm transition-colors"
        >
          校验
        </button>
      </div>
    </div>
  </Modal>
</template>
