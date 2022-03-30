import type { RouteRecordRaw } from 'vue-router'
import LayoutBase from '../layout/Base.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    component: LayoutBase,
    redirect: '/zen',
    children: [
      {
        path: '/module',
        name: 'Module',
        component: () => import('~/newTab/views/Module.vue'),
        meta: { title: '', keepAlive: false },
      },
      {
        path: '/zen',
        name: 'Zen',
        component: () => import('~/newTab/views/Zen.vue'),
        meta: { title: '', keepAlive: false },
      },
    ],
  },
]
