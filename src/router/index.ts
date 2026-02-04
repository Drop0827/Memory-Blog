import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// 图床链接
const Img1 = 'https://bu.dusays.com/2026/02/04/698346b2079d6.jpg' // 1.jpg
const Img3 = 'https://bu.dusays.com/2026/02/04/698346b3e9880.png' // 3.png
const Img4 = 'https://bu.dusays.com/2026/02/04/698346b17d6e5.jpg' // 4.jpg
const Img5 = 'https://bu.dusays.com/2026/02/04/698346b1530ec.jpg' // 5.jpg

const contrastImgs = [Img1, Img3, Img4, Img5]

const getRandomImage = () => {
  const index = Math.floor(Math.random() * contrastImgs.length)
  return contrastImgs[index]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/ColumnView.vue'),
      props: {
        title: '开发笔记',
        coverImage: getRandomImage(),
      },
    },
    {
      path: '/life',
      name: 'life',
      component: () => import('../views/ColumnView.vue'),
      props: {
        title: '生活随笔',
        coverImage: getRandomImage(),
      },
    },
    {
      path: '/university',
      name: 'university',
      component: () => import('../views/ColumnView.vue'),
      props: {
        title: '大学生活',
        coverImage: getRandomImage(),
      },
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../views/ColumnView.vue'),
      props: {
        title: '开发历程',
        coverImage: getRandomImage(),
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('../views/FriendsView.vue'),
    },
    {
      path: '/fishpond',
      name: 'fishpond',
      component: () => import('../views/FishpondView.vue'),
    },
    {
      path: '/wall',
      name: 'wall',
      component: () => import('../views/WallView.vue'),
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () => import('../views/ArticleDetail.vue'),
    },
    {
      path: '/moments',
      name: 'moments',
      component: () => import('../views/MomentsView.vue'),
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/ColumnView.vue'),
      props: { title: '网站统计', coverImage: getRandomImage() },
    },
    {
      path: '/footprints',
      name: 'footprints',
      component: () => import('../views/ColumnView.vue'),
      props: { title: '我的足迹', coverImage: getRandomImage() },
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('../views/ColumnView.vue'),
      props: { title: '标签云', coverImage: getRandomImage() },
    },
    {
      path: '/devices',
      name: 'devices',
      component: () => import('../views/ColumnView.vue'),
      props: { title: '我的设备', coverImage: getRandomImage() },
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import('../views/ColumnView.vue'),
      props: { title: '我的履历', coverImage: getRandomImage() },
    },
  ],
})

export default router
