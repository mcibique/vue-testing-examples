import './bootstrap';
import container, { RegisterConstantValue as registerConstantValue } from './di';
import Vue from 'vue';
import App from './App.vue';
import { createRouter, ROUTER_ID } from './router';
import { createStore, STORE_ID } from './store';
import './services/api';

Vue.config.productionTip = false;

let store = createStore(Vue);
registerConstantValue(STORE_ID, store);

let router = createRouter(Vue);
registerConstantValue(ROUTER_ID, router);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
