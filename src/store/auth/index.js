import { Getter, State, Action, Mutation, namespace } from 'vuex-class';

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

let AuthGetter = namespace('auth', Getter);
let AuthState = namespace('auth', State);
let AuthAction = namespace('auth', Action);
let AuthMutation = namespace('auth', Mutation);

export {
  AuthGetter,
  AuthState,
  AuthAction,
  AuthMutation
};
