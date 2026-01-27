import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 这里的 /api 会拦截前端发往 /api 的请求，并转发到 8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 如果后端接口本身就带 /api 前缀，就不需要下面的 rewrite
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
