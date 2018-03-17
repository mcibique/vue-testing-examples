import Vue from 'vue';
import Vuex from 'vuex';

import createAuthModule from './auth';

export function createStore (vueInstance = Vue) {
  vueInstance.use(Vuex);

  return new Vuex.Store({
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    modules: {
      auth: createAuthModule()
    }
  });
}

export const STORE_ID = Symbol('store');
