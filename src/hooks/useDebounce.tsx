import { useCallback, useRef } from 'react';

// 封装防抖函数
export default function useDebounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  const timeoutRef = useRef<number | undefined>(null);

  const debouncedFunc = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        func(...args);
      }, wait);
    },
    [func, wait]
  );

  return debouncedFunc;
}
