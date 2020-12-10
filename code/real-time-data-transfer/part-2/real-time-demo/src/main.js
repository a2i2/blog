import Vue from 'vue';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import moment from 'moment';
import VueChatScroll from 'vue-chat-scroll';

Vue.use(VueChatScroll);
Vue.config.productionTip = false;
Vue.prototype.moment = moment;

new Vue({
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
