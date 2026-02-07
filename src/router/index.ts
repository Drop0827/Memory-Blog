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
      component: () => import('../views/NoteView.vue'),
    },
    {
      path: '/life',
      name: 'life',
      component: () => import('../views/LifeView.vue'),
    },
    {
      path: '/university',
      name: 'university',
      component: () => import('../views/UniversityView.vue'),
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../views/TimelineView.vue'),
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
      path: '/tags',
      name: 'tags',
      component: () => import('../views/NoteView.vue'),
    },
    {
      path: '/devices',
      name: 'devices',
      component: () => import('../views/NoteView.vue'),
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import('../views/NoteView.vue'),
    },
  ],
})

export default router
