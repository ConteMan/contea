import { RouteRecordRaw } from 'vue-router'
import Layout from '../layout/Index.vue'
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false,
    },
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('~/newTab/views/Module.vue'),
        meta: { title: '首页', keepAlive: false, showTab: true },
      },
      {
        path: '/simple',
        name: 'Simple',
        component: () => import('~/newTab/views/Index.vue'),
      },
    ],
  },
]
