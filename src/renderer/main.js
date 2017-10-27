import Vue from 'vue'
import store from './store';
import App from './App'
import vClickOutside from 'v-click-outside';

Vue.use(vClickOutside);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  store,
  render: h => h(App)
});
