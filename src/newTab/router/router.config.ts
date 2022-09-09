import type { RouteRecordRaw } from 'vue-router'
import Index from '@newTab/views/Index.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: { title: '', keepAlive: false },
  },
]
