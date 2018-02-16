import cloneDeep from 'lodash/cloneDeep';

import AuthService from '@/services/auth';

export default function createModule () {
  return {
    namespaced: true,
    state: cloneDeep({
      token: null
    }),
    actions: {
      async login ({ commit }, { username, password }) {
        let authService = new AuthService();
        let token = await authService.login(username, password);
        commit('SET_TOKEN', token);
        return token;
      },
      async logout ({ commit }) {
        let authService = new AuthService();
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
