import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import Vuelidate from 'vuelidate';
import {config} from "./config";

Vue.config.productionTip = false;
const socket = io(config.apiServerUrl, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity
});
Vue.use(VueSocketIOExt, socket);
Vue.use(Vuelidate);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
