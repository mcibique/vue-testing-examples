import axios from 'axios';

let auth = {
  namespaced: true,
  state: {
    token: null
  },
  actions: {
    async login ({ commit }, { username, password }) {
      let token = await axios.post('/api/login', { username, password }).then(({ data }) => data);
      // let token = await Promise.resolve(`${username}:${password}`);
      commit('SET_TOKEN', token);
      return token;
    }
  },
  mutations: {
    'SET_TOKEN' (state, token) {
      state.token = token;
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token
  }
};

export default auth;
