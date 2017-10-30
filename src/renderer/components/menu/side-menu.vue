<template>
  <div class="side-menu">
    <div class="logo"></div>
    <ul>
      <li @click="newFile">新建</li>
      <li @click="openFile">打开</li>
      <li @click="saveFile">保存</li>
      <li @click="saveAsFile">另存为</li>
      <li class="break"></li>
      <li>导出为HTML</li>
      <li>导出为PDF</li>
      <li class="break"></li>
      <!-- <li>设置</li> -->
      <li>关于</li>
    </ul>
  </div>
</template>

<script>
  import {
    ipcRenderer
  } from 'electron';
  export default {
    name: 'side-menu',
    computed: {
      Titorite() {
        return this.$store.state.Titorite;
      },
      isEdited() {
        return this.$store.state.isEdited;
      },
      path() {
        return this.$store.state.filePath;
      }
    },
    methods: {
      newFile() {
        let self = this;
        ipcRenderer.send('show-ask-dialog-then-new', self.Titorite.getValue(), self.path);
        ipcRenderer.once('new-file', () => {
          self.Titorite.doc.setValue('');
          self.Titorite.doc.clearHistory();
          self.Titorite.focus();
          self.$store.commit('editing', {
            status: false
          });
          self.$store.commit('toggle-side-menu', {
            status: false
          });
          self.$store.commit('save-file-path', {
            path: null
          });
        })
      },
      openFile() {
        let self = this;
        ipcRenderer.send('show-open-dialog');
        ipcRenderer.once('open-file', (event, path, content) => {
          const readFile = () => {
            if (path == self.path) return;
            self.Titorite.doc.setValue(content);
            self.Titorite.execCommand('goDocEnd');
            self.Titorite.focus();
            self.$store.commit('toggle-side-menu', {
              status: false
            });
            self.$store.commit('save-file-path', {
              path: path
            });
            self.$store.commit('editing', {
              status: false
            });
          };
          ipcRenderer.send('focus-main-window');
          if (self.isEdited) {
            ipcRenderer.send('show-ask-dialog-then-read', self.Titorite.getValue(), self.path);
          } else if (!self.isEdited && self.path) {
            ipcRenderer.send('confirm-read-file');
          } else {
            readFile();
          }
          ipcRenderer.once('read-file', readFile);
          ipcRenderer.once('close-menu', () => {
            self.$store.commit('toggle-side-menu', {
              status: false
            });
            self.Titorite.execCommand('goDocEnd');
            self.Titorite.focus();
          });
        });
      },
      saveFile() {
        let self = this;
        if (self.path) {
          if (self.isEdited) {
            ipcRenderer.send('save-file', self.Titorite.getValue(), self.path);
          }
        } else {
          self.saveAsFile();
        }
      },
      saveAsFile() {
        ipcRenderer.send('show-save-dialog', this.Titorite.getValue());
      }
    }
  }
</script>