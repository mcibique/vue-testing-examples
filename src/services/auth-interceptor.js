import axios from 'axios';
import store from '@/store';

axios.interceptors.request.use(function (config) {
  if (store.state.auth.token) {
    config.headers.Authorization = `Bearer ${store.state.auth.token}`;
  }

  return config;
});
