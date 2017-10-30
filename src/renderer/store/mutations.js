import {
  setTitorite,
  toggleSideMenu,
  togglePopupMenu,
  modeChange,
  editing,
  toggleTip,
  tipChange,
  saveFilePath
} from './mutations-types';

export default {
  [setTitorite](state, {
    Titorite
  }) {
    state.Titorite = Titorite;
  },
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
  },
  [editing](state, {
    status
  }) {
    state.isEdited = status;
  },
  [toggleTip](state, {
    status
  }) {
    state.isTipShowed = status;
  },
  [tipChange](state, tip) {
    state.tip = tip;
  },
  [saveFilePath](state, {
    path
  }) {
    state.filePath = path;
  }
}