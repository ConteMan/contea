import type { RouteRecordRaw } from 'vue-router'
import LayoutBase from '@newTab/layout/Base.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: LayoutBase,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('~/newTab/views/Index.vue'),
        meta: { title: '', keepAlive: false },
      },
    ],
  },
]
