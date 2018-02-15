import './bootstrap';
import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createStore } from './store';

Vue.config.productionTip = false;

new Vue({
  router: createRouter(Vue),
  store: createStore(Vue),
  render: h => h(App)
}).$mount('#app');
