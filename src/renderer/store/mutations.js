import {
  toggleSideMenu,
  togglePopupMenu,
  modeChange
} from './mutations-types';

export default {
  [toggleSideMenu](state, {
    status
  }) {
    state.isSideMenuOpened = status;
  },
  [togglePopupMenu](state, {
    status
  }) {
    state.isPopupMenuOpened = status;
  },
  [modeChange](state, {
    mode
  }) {
    state.mode = mode;
  }
}
