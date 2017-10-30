<template>
  <div class="window-operation" onselectstart="return false">
    <div class="minimize" title="Minimize" @click="minimize" onselectstart="return false">&#xe65b;</div>
    <div :class="{maximize:!isMaximized,restore:isMaximized}" :title="resize.title" @click="resize.method" v-html="resize.content" onselectstart="return false"></div>
    <div class="close" title="Close" @click="close" onselectstart="return false">&#xe624;</div>
  </div>
</template>

<script>
  import {
    ipcRenderer
  } from 'electron';
  export default {
    name: 'window-operation',
    props: ['isMaximized'],
    computed: {
      Titorite() {
        return this.$store.state.Titorite;
      },
      resize() {
        let self = this;
        let isMaximized = self.isMaximized;
        return {
          content: isMaximized ? `&#xe63d;` : `&#xe604;`,
          title: isMaximized ? `Restore` : `Maximize`,
          method: isMaximized ? self.restore : self.maximize,
        }
      },
      isEdited() {
        return this.$store.state.isEdited;
      },
      path() {
        return this.$store.state.filePath;
      }
    },
    methods: {
      minimize() {
        ipcRenderer.send('minimize-main-window');
      },
      maximize() {
        ipcRenderer.send('maximize-main-window');
      },
      restore() {
        ipcRenderer.send('restore-main-window');
      },
      close() {
        let self = this;
        self.isEdited ? ipcRenderer.send('show-ask-dialog-then-close', self.Titorite.getValue(), self.path) : ipcRenderer.send('close-main-window');
      }
    }
  };
</script>