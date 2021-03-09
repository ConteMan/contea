import Vue from 'vue';
import VueRouter from 'vue-router';
import BaseLayout from '../../layout/BaseLayout.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Main',
    component: BaseLayout,
    redirect: '/list/all',
    children: [
      {
        path: 'list/:platform',
        name: 'List',
        component: () => import('../views/List.vue')
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('../views/Setting.vue')
      }
    ]
  },
  {
    path: '*',
    redirect: { name: 'Main' },
  }
];

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const router = new VueRouter({
  mode: 'hash',
  routes
});

export default router;
