import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
        coverImage:
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop',
      },
    },
    {
      path: '/life',
      name: 'life',
      component: () => import('../views/ColumnView.vue'),
      props: {
        title: '生活随笔',
        coverImage:
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop',
      },
    },
    {
      path: '/university',
      name: 'university',
      component: () => import('../views/ColumnView.vue'),
      props: {
        title: '大学生活',
        coverImage:
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2670&auto=format&fit=crop',
      },
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../views/ColumnView.vue'),
      props: {
        title: '开发历程',
        coverImage:
          'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
