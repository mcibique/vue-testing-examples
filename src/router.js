import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from './views/Login.vue';
import About from './views/About.vue';

export function createRouter (vueInstance = Vue) {
  vueInstance.use(VueRouter);

  return new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/welcome',
        name: 'welcome',
        component: About
      }
    ]
  });
}
