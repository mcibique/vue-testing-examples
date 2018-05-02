import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

export default function createModule () {
  return {
    namespaced: true,
    state: {
      token: null
    },
    actions,
    mutations,
    getters
  };
}
