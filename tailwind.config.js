/** @type {import('tailwindcss').Config} */
export default {
  // 1. 修改检测路径：适配 Vue 的目录结构
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 原作者开启了类名黑夜模式
  theme: {
    extend: {
      // 2. 还原原作者的自定义断点
      screens: {
        'xs': '400px',
      },
      // 3. 还原原作者的灵魂配色
      colors: {
        primary: '#539dfd', //
        'black-a': '#232931', // 深色背景 A
        'black-b': '#2c333e'  // 深色背景 B
      },
      // 4. 还原默认过渡动画时间
      transitionDuration: {
        'DEFAULT': '300ms',
      }
    },
  },
  plugins: [
    // 注意：原作者用了 @heroui/react，这是 React 插件，Vue 无法直接使用。
    // 我们先保留基础配置，如果你以后想用 HeroUI 的 Vue 版，可以在这里添加。
  ],
}
