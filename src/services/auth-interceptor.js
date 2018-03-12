import axios from 'axios';
import container from '@di';
import { STORE_ID } from '@/store';

axios.interceptors.request.use(function (config) {
  let store = container.get(STORE_ID);
  if (store.state.auth.token) {
    config.headers.Authorization = `Bearer ${store.state.auth.token}`;
  }

  return config;
});
