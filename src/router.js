import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from './views/Login.vue';
import About from './views/About.vue';

export function createRouter (vueInstance = Vue) {
  vueInstance.use(VueRouter);

  return new VueRouter({
    mode: process.env.NODE_ENV === 'test' ? 'abstract' : 'history',
    routes: [
      {
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/about',
        name: 'about',
        component: About
      },
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import(/* webpackChunkName: "auth" */ './views/Welcome.vue')
      },
      {
        path: '*',
        redirect: '/login'
      }
    ]
  });
}
