<template>
  <div id="app" :class="{maximize,focusing,blurred}" tabindex="0">
    <titorite></titorite>
    <menu-cover></menu-cover>
    <tip></tip>
    <!-- <about></about> -->
    <operation :isMaximized="maximize"></operation>
    <div class="n-resize"></div>
    <div class="ne-resize"></div>
    <div class="e-resize"></div>
    <div class="se-resize"></div>
    <div class="s-resize"></div>
    <div class="sw-resize"></div>
    <div class="w-resize"></div>
    <div class="nw-resize"></div>
  </div>
</template>

<script>
  import {
    remote,
    ipcRenderer
  } from 'electron';
  import titorite from './components/titorite';
  import menuCover from './components/menu';
  import tip from './components/tip';
  import about from './components/about';
  import operation from './components/window-operation';
  export default {
    name: 'main-window',
    data() {
      return {
        maximize: remote.BrowserWindow.getAllWindows()[0].isMaximized(),
        focusing: true,
        blurred: false
      }
    },
    mounted() {
      let self = this;
      ipcRenderer.on('focusing', function() {
        self.blurred = false;
        self.focusing = true;
      });
      ipcRenderer.on('blurred', function() {
        self.focusing = false;
        self.blurred = true;
      });
      ipcRenderer.on('maximized', function() {
        self.maximize = true;
      });
      ipcRenderer.on('unmaximized', function() {
        self.maximize = false;
      });
      document.querySelectorAll('a')
    },
    components: {
      titorite,
      menuCover,
      tip,
      about,
      operation
    }
  };
</script>

<style>
  @import './assets/style/titorite.min.css';
  @import './assets/style/codemirror.min.css';
  @import './assets/style/github-markdown.min.css';
  @import './assets/style/theme/base16-light.css';
</style>