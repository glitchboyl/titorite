import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';

Vue.use(Vuex);

const state = {
  Titorite: null,
  isSideMenuOpened: false,
  isPopupMenuOpened: false,
  mode: 'preview',
  isEdited: false,
  isTipShowed: false,
  tip: {
    type: 'default',
    message: ''
  },
  tipping({
    type,
    message
  }) {
    Store.commit('toggle-tip', {
      status: true
    })
    Store.commit('tip-change', {
      type,
      message
    })
    new Promise((resolve, reject) => {
      setTimeout(() => {
        Store.commit('toggle-tip', {
          status: false
        });
        resolve();
      }, 2500)
    }).then(() => {
      setTimeout(() => {
        if (!Store.state.isTipShowed) Store.commit('tip-change', {
          type: 'default',
          message: ''
        });
      }, 500)
    })
  },
  filePath: null
}

const Store = new Vuex.Store({
  state,
  mutations
})

export default Store