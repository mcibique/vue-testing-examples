import Vue from 'vue';
import Vuex from 'vuex';
import { namespace } from 'vuex-class';

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

let { Getter: AuthGetter, State: AuthState, Action: AuthAction, Mutation: AuthMutation } = namespace(AUTH_MODULE_ID);

export {
  AuthGetter,
  AuthState,
  AuthAction,
  AuthMutation
};
