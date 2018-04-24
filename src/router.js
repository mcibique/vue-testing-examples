import Vue from 'vue';
import VueRouter from 'vue-router';

import container from '@di';
import { STORE_ID } from './store';
import Login from './views/Login.vue';
import About from './views/About.vue';

export function createRouter (/* istanbul ignore next */ vueInstance = Vue, store = container.get(STORE_ID)) {
  vueInstance.use(VueRouter);

  let router = new VueRouter({
    mode: /* istanbul ignore next */ process.env.NODE_ENV === 'test' ? 'abstract' : 'history',
    routes: [
      {
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/logout',
        name: 'logout',
        beforeEnter (to, from, next) {
          store.dispatch('auth/logout').finally(function () {
            next({ name: 'login' });
          });
        }
      },
      {
        path: '/about',
        name: 'about',
        component: About
      },
      {
        path: '/welcome',
        name: 'welcome',
        meta: { requiresAuth: true },
        component: () => import(/* webpackChunkName: "auth" */ './views/Welcome.vue')
      },
      {
        path: '/',
        name: 'root',
        redirect () {
          if (store.getters['auth/isAuthenticated']) {
            return '/welcome';
          } else {
            return '/login';
          }
        }
      },
      {
        path: '*',
        redirect: 'root'
      }
    ]
  });

  router.beforeEach(function (to, from, next) {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!store.getters['auth/isAuthenticated']) {
        return void next({ name: 'login' });
      }
    }

    next();
  });

  return router;
}

export const ROUTER_ID = Symbol('router');
