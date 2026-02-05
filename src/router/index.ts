import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// 图床链接 - 为每个页面分配固定的不同背景图片
const BgImages = {
  notes: 'https://bu.dusays.com/2026/02/04/698346b2079d6.jpg', // 1.jpg - 开发笔记
  life: 'https://bu.dusays.com/2026/02/04/698346b3e9880.png', // 3.jpg - 生活随笔
  university: 'https://bu.dusays.com/2026/02/04/698346b17d6e5.jpg', // 4.jpg - 大学生活
  timeline: 'https://bu.dusays.com/2026/02/04/698346b1530ec.jpg', // 5.jpg - 开发历程
  statistics: 'https://bu.dusays.com/2026/02/04/698346b16d065.jpg', // 6.jpg - 网站统计
  footprints: 'https://bu.dusays.com/2026/02/04/698346b17c425.png', // 7.jpg - 我的足迹
  tags: 'https://bu.dusays.com/2026/02/04/698346b2163ae.jpg', // 8.jpg - 标签云
  devices: 'https://bu.dusays.com/2026/02/04/698346b4ee9f4.png', // 9.jpg - 我的设备
  resume: 'https://bu.dusays.com/2026/02/04/698346c017609.jpg', // cat.jpg - 我的履历
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
        coverImage: BgImages.notes,
      },
    },
    {
      path: '/life',
      name: 'life',
      component: () => import('../views/ColumnView.vue'),
      props: {
        title: '生活随笔',
        coverImage: BgImages.life,
      },
    },
    {
      path: '/university',
      name: 'university',
      component: () => import('../views/ColumnView.vue'),
      props: {
        title: '大学生活',
        coverImage: BgImages.university,
      },
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../views/ColumnView.vue'),
      props: {
        title: '开发历程',
        coverImage: BgImages.timeline,
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/memories',
      name: 'memories',
      component: () => import('../views/MemoriesView.vue'),
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
      props: { title: '网站统计', coverImage: BgImages.statistics },
    },
    {
      path: '/footprints',
      name: 'footprints',
      component: () => import('../views/ColumnView.vue'),
      props: { title: '我的足迹', coverImage: BgImages.footprints },
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('../views/ColumnView.vue'),
      props: { title: '标签云', coverImage: BgImages.tags },
    },
    {
      path: '/devices',
      name: 'devices',
      component: () => import('../views/ColumnView.vue'),
      props: { title: '我的设备', coverImage: BgImages.devices },
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import('../views/ColumnView.vue'),
      props: { title: '我的履历', coverImage: BgImages.resume },
    },
  ],
})

export default router
