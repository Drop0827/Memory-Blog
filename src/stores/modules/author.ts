import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/app/user'

const useAuthorStore = defineStore('author', () => {
  const author = ref<User>({} as User)

  function setAuthor(data: User) {
    author.value = data
  }

  return {
    author,
    setAuthor,
  }
})

export default useAuthorStore
