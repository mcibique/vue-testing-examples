import cloneDeep from 'lodash/cloneDeep';

import container from '@di';
import { AUTH_SERVICE_ID } from '@/services/auth';

export default function createModule () {
  return {
    namespaced: true,
    state: cloneDeep({
      token: null
    }),
    actions: {
      async login ({ commit }, { username, password }) {
        let authService = container.get(AUTH_SERVICE_ID);
        let token = await authService.login(username, password);
        commit('SET_TOKEN', token);
        return token;
      },
      async logout ({ commit }) {
        let authService = container.get(AUTH_SERVICE_ID);
        await authService.logout();
        commit('RESET_TOKEN');
      }
    },
    mutations: {
      'RESET_TOKEN' (state) {
        state.token = null;
      },
      'SET_TOKEN' (state, token) {
        state.token = token;
      }
    },
    getters: {
      isAuthenticated: (state) => !!state.token
    }
  };
}
