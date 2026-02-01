import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import Img1 from '@/assets/image/1.jpg'
import Img3 from '@/assets/image/3.png'
import Img4 from '@/assets/image/4.jpg'
import Img5 from '@/assets/image/5.jpg'

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
