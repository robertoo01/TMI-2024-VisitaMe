import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/landing'
  },
  {
    path: '/locationDetails',
    name: 'Location Details',
    component: () => import('@/views/LocationDetails.vue'),
  },
  {
    path: '/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/landing'
      },
      {
        path: 'landing',
        component: () => import('@/views/LandingPage.vue')
      },
      {
        path: 'location',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'sitelist',
        component: () => import('@/views/SiteListPage.vue')
      },
      {
        path: 'end',
        component: () => import('@/views/endRoute.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
