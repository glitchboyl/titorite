<template>
  <div class="side-menu">
    <div class="logo"></div>
    <ul>
      <li @click="newFile">新建</li>
      <li @click="openFile">打开</li>
      <li @click="saveFile">保存</li>
      <li @click="saveAsFile">另存为</li>
      <li class="break"></li>
      <li @click="exportAsHTML">导出为HTML</li>
      <li @click="exportAsPDF">导出为PDF</li>
      <li class="break"></li>
      <!-- <li>设置</li> -->
      <li>关于</li>
    </ul>
  </div>
</template>

<script>
  import {
    ipcRenderer,
    shell
  } from 'electron';
  import fs from 'fs';
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
      },
      isTipShowed() {
        return this.$store.state.isTipShowed;
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
      },
      exportAs(type) {
        let self = this;
        new Promise((resolve, reject) => {
          fs.access('./resources', (err) => {
            if (!err) {
              resolve('/resources/app.asar');
            }
            resolve('');
          })
        }).then((_path) => {
          return new Promise((resolve, reject) => {
            fs.readFile(`.${_path}/dist/electron/static/github-markdown.min.css`, 'utf-8', (err, data) => {
              if (err) throw err;
              resolve(data.toString());
            });
          })
        }).then((stylesheet) => {
          let doc = document.implementation.createHTMLDocument();
          const head = doc.querySelector('head');
          const body = doc.querySelector('body');
          const meta = doc.createElement('meta');
          const style = doc.createElement('style');
          const title = doc.createElement('title');
          meta.setAttribute('charset', 'utf-8');
          head.appendChild(meta);
          head.appendChild(title);
          style.innerHTML = stylesheet;
          head.appendChild(style);
          body.setAttribute('class', 'markdown-body');
          body.innerHTML = document.querySelector('#content').cloneNode(true).innerHTML;
          ipcRenderer.send(`export-as-${type}`, `<!DOCTYPE html><html>${doc.querySelector('html').innerHTML}</html>`);
          ipcRenderer.once('exporting', (event) => {
            self.$store.commit('toggle-side-menu', {
              status: false
            });
            self.$store.state.tipping({
              type: 'info',
              message: `正在导出${type.toUpperCase()}, 请稍后...`
            });
            ipcRenderer.once('exported-success', (event, path) => {
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  shell.openItem(path);
                  resolve();
                }, 1200);
              }).then(() => {
                if (self.isTipShowed) {
                  self.$store.commit('toggle-tip', {
                    status: false
                  });
                }
                setTimeout(() => {
                  self.$store.state.tipping({
                    type: 'success',
                    message: '导出成功。'
                  });
                }, type == 'pdf' ? 0 : 300);
              })
            });
          });
        })
      },
      exportAsHTML() {
        this.exportAs('html');
      },
      exportAsPDF() {
        this.exportAs('pdf');
      }
    }
  }
</script>