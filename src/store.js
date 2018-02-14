import Vue from 'vue';
import Vuex from 'vuex';
import auth from './store.auth';
import cloneDeep from 'lodash/cloneDeep';

export function createStore (vueInstance = Vue) {
  vueInstance.use(Vuex);

  return new Vuex.Store({
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    modules: {
      auth: {
        ...auth,
        state: cloneDeep(auth.state)
      }
    }
  });
}
