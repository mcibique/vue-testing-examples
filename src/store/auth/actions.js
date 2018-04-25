import container from '@di';
import { AUTH_SERVICE_ID } from '@/services/auth';

export async function login ({ commit }, { username, password, rememberMe }) {
  let authService = container.get(AUTH_SERVICE_ID);
  let token = await authService.login(username, password, rememberMe);
  commit('setToken', token);
  return token;
}

export async function logout ({ commit }) {
  let authService = container.get(AUTH_SERVICE_ID);
  await authService.logout().finally(function () {
    commit('resetToken');
  });
}
