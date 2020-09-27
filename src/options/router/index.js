import Vue from 'vue'
import VueRouter from 'vue-router'
import Show from '../views/Show'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Show',
    component: Show,
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting'),
  },
  {
    path: '*',
    redirect: { path: '/' },
  }
]

const router = new VueRouter({
  routes
})

export default router
