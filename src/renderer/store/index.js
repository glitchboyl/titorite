import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';

Vue.use(Vuex);

const state = {
  isSideMenuOpened: false,
  isPopupMenuOpened: false,
  mode: 'preview'
}

export default new Vuex.Store({
  state,
  mutations
})
