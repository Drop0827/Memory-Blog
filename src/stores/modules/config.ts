import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Other, Theme, Web } from '@/types/app/config'

const useConfigStore = defineStore('config', () => {
  // Persistence logic
  const STORAGE_KEY = 'config_storage'

  // Default values
  let initialIsDark = false
  let initialWeb = {} as Web
  let initialTheme = {} as Theme
  let initialOther = {} as Other

  // Try to load from localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Handle Zustand persist format { state: { ... }, version: 0 } or plain object
      const state = parsed.state || parsed

      if (state.isDark !== undefined) initialIsDark = state.isDark
      if (state.web) initialWeb = state.web
      if (state.theme) initialTheme = state.theme
      if (state.other) initialOther = state.other
    }
  } catch (e) {
    console.error('Failed to load config from storage', e)
  }

  const isDark = ref<boolean>(initialIsDark)
  const web = ref<Web>(initialWeb)
  const theme = ref<Theme>(initialTheme)
  const other = ref<Other>(initialOther)

  function setIsDark(status: boolean) {
    isDark.value = status
  }

  function setWeb(data: Web) {
    web.value = data
  }

  function setTheme(data: Theme) {
    theme.value = data
  }

  function setOther(data: Other) {
    other.value = data
  }

  // Setup Watcher for Persistence
  watch(
    [isDark, web, theme, other],
    () => {
      const state = {
        isDark: isDark.value,
        web: web.value,
        theme: theme.value,
        other: other.value,
      }
      // Save in structure compatible with how we read it (and legacy Zustand format)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, version: 0 }))
    },
    { deep: true },
  )

  return {
    isDark,
    setIsDark,
    web,
    setWeb,
    theme,
    setTheme,
    other,
    setOther,
  }
})

export default useConfigStore
