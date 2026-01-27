/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '400px',
      },
      colors: {
        primary: '#539dfd',
        'black-a': '#232931',
        'black-b': '#2c333e'
      },
      transitionDuration: {
        'DEFAULT': '300ms',
      }
    },
  },
  plugins: [], // 先不放 heroui 插件，因为它是 React 版的
}
