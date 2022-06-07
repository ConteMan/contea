import type { RouteRecordRaw } from 'vue-router'
import LayoutBase from '~/newTab/layout/Base.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    component: LayoutBase,
    redirect: '/module',
    children: [
      {
        path: '/module',
        name: 'Module',
        component: () => import('~/newTab/views/Module.vue'),
        meta: { title: '', keepAlive: false },
      },
    ],
  },
]
