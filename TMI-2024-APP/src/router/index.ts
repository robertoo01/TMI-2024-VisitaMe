import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path:'/',
    redirect:'/landing'
  },
  {
    path: '/landing',
    component: () => import('@/views/LandingPage.vue')
  },
  {
    path: '/sitelist',
    name: 'Sitelist',
    component: () => import('@/views/SiteListPage.vue')
  },
  {
    path: '/location',
    name: 'Location',
    component: () => import('@/views/Tab2Page.vue')
  },
  {
    path: '/end',
    name: 'End',
    component: () => import('@/views/endRoute.vue')
  },
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
