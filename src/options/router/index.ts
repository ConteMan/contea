import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Example from '~/options/components/Example.vue'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'Example',
    path: '/',
    component: Example,
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  strict: true,
})
