import { RouteRecordRaw } from 'vue-router'
import LayoutBase from '../layout/Base.vue'
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false,
    },
    component: LayoutBase,
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
