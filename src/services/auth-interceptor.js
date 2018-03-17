import container from '@di';
import { STORE_ID } from '@/store';

export function authRequestInterceptor (config) {
  let store = container.get(STORE_ID);
  if (store.state.auth.token) {
    config.headers.Authorization = `Bearer ${store.state.auth.token}`;
  }

  return config;
}
