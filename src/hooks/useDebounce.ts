import { customRef } from 'vue'

/**
 * 创建一个防抖 Ref
 * 值的更新会被延迟
 * @param value 初始值
 * @param delay 延迟时间(ms)
 */
export function useDebouncedRef<T>(value: T, delay = 200) {
  let timeout: ReturnType<typeof setTimeout>
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue: T) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      },
    }
  })
}

/**
 * 创建一个防抖函数
 * @param fn 要执行的函数
 * @param delay 延迟时间(ms)
 */
export function useDebounceFn<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let timeout: ReturnType<typeof setTimeout>

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout)
  }

  return debounced
}

// 默认导出防抖函数
export default useDebounceFn
