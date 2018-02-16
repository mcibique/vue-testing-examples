import './bootstrap';
import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import store from './store';
import './services/api';

Vue.config.productionTip = false;

new Vue({
  router: createRouter(Vue),
  store,
  render: h => h(App)
}).$mount('#app');
