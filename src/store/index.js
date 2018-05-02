import Vue from 'vue';
import Vuex from 'vuex';
import { Getter, State, Action, Mutation, namespace } from 'vuex-class';

import createAuthModule from './auth';

export const AUTH_MODULE_ID = 'auth';

export function createStore (/* istanbul ignore next */ vueInstance = Vue) {
  vueInstance.use(Vuex);

  return new Vuex.Store({
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    modules: {
      [AUTH_MODULE_ID]: createAuthModule()
    }
  });
}

export const STORE_ID = Symbol('store');

let AuthGetter = namespace(AUTH_MODULE_ID, Getter);
let AuthState = namespace(AUTH_MODULE_ID, State);
let AuthAction = namespace(AUTH_MODULE_ID, Action);
let AuthMutation = namespace(AUTH_MODULE_ID, Mutation);

export {
  AuthGetter,
  AuthState,
  AuthAction,
  AuthMutation
};
