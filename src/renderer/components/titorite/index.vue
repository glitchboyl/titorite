<template>
  <div class="Titorite-container" :class=[mode]>
    <left-part ref="editorContainer"></left-part>
    <div class="Titorite-spliter"></div>
    <right-part ref="contentContainer"></right-part>
    <cover-bottom></cover-bottom>
  </div>
</template>

<script>
  import {
    ipcRenderer,
    shell
  } from 'electron';
  import CodeMirror from '@/assets/js/codemirror';
  import Currying from '@/assets/js/currying';
  import xml from '@/assets/js/xml';
  import markdown from '@/assets/js/markdown';
  import overlay from '@/assets/js/overlay';
  import gfm from '@/assets/js/gfm';
  import javascript from '@/assets/js/javascript';
  import marked from 'marked';
  import highlight from 'highlight.js';
  import leftPart from './left-part';
  import rightPart from './right-part';
  import coverBottom from './cover-bottom';
  export default {
    name: 'Titorite',
    data() {
      return {
        scroll: null
      }
    },
    computed: {
      mode() {
        return this.$store.state.mode;
      },
      isEdited() {
        return this.$store.state.isEdited;
      },
      path() {
        return this.$store.state.filePath;
      }
    },
    mounted() {
      let self = this;
      let Editor = self.$refs.editorContainer.$refs.editor;
      let Content = self.$refs.contentContainer.$refs.content;
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        breaks: true,
        highlight(code) {
          return highlight.highlightAuto(code).value;
        }
      });
      Currying(CodeMirror)(xml)(markdown)(overlay)(gfm)(javascript);
      const Titorite = CodeMirror(Editor, {
        mode: {
          name: "gfm"
        },
        autoCloseBrackets: true,
        lineWrapping: true,
        scrollbarStyle: null,
        showCursorWhenSelecting: true,
        theme: "base16-light"
      });
      Titorite.setOption("extraKeys", {
        'Ctrl-S' (editor) {
          if (self.path) {
            if (self.isEdited) {
              ipcRenderer.send('save-file', editor.getValue(), self.path);
            }
          } else {
            ipcRenderer.send('show-save-dialog', editor.getValue());
          }
        },
        'Ctrl-B' (editor) {
          var str = editor.doc.getSelection().trim();
          if (str === "") {
            return;
          }
          if (str.indexOf("**") != -1) {
            if (str.indexOf("**") != str.lastIndexOf("**")) {
              if (str.indexOf("**") == 0 && str.lastIndexOf("**") == str.length - 2) {
                str = str.replace(new RegExp("\\*+\\*", "gm"), "");
              } else {
                str = "**" + str.replace(new RegExp("\\*+\\*", "gm"), "") + "**";
              }
            } else {
              str = "**" + str.replace("**", "");
            }
          } else {
            str = "**" + str + "**";
          }
          editor.doc.replaceSelection(str);
          //editor.doc.getSelection() = "**"+editor.doc.getSelection()+"**";
        },
        'Ctrl-I' (editor) {
          var str = editor.doc.getSelection().trim();
          if (str === "") {
            return;
          }
          if (str.indexOf("**") == -1) {
            if (str.indexOf("*") != str.lastIndexOf("*")) {
              if (str.indexOf("**") == 0 && str.lastIndexOf("**") == str.length - 1) {
                str = str.replace(new RegExp("\\*", "gm"), "");
              } else {
                str = "*" + str.replace(new RegExp("\\*", "gm"), "") + "*";
              }
            } else {
              str = "*" + str.replace("*", "") + "*";
            }
          } else {
            str = "*" + str + "*";
          }
          editor.doc.replaceSelection(str);
          //editor.doc.getSelection() = "**"+editor.doc.getSelection()+"**";
        },
        'Ctrl-H' (editor) {
          var str = editor.doc.getSelection().trim();
          if (str === "") {
            return;
          }
          if (str.indexOf("#") != 0) {
            str = "\n# " + str;
          } else if (str.indexOf("#") == 0) {
            str = "#" + str;
          }
          editor.doc.replaceSelection(str);
        }
      });
      Titorite.on('change', (editor) => {
        if (!self.isEdited) self.$store.commit('editing', {
          status: true
        });
        Content.innerHTML = marked(editor.getValue());
        Content.querySelectorAll('a').forEach((that) => {
          that.addEventListener('click', self.openExternal)
        })
      });
      Titorite.on('drop', (editor, event) => {
        event.preventDefault();
        let file = event.dataTransfer.files[0];
        const readFile = () => {
          if (file.path == self.path) return;
          let reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => {
            editor.doc.setValue(reader.result);
            editor.execCommand('goDocEnd');
            editor.focus();
            self.$store.commit('save-file-path', {
              path: file.path
            });
            self.$store.commit('editing', {
              status: false
            });
          }
        };
        ipcRenderer.send('focus-main-window');
        if (self.isEdited) {
          ipcRenderer.send('show-ask-dialog-then-read', editor.getValue(), self.path);
        } else if (!self.isEdited && self.path) {
          ipcRenderer.send('confirm-read-file');
        } else {
          readFile();
        }
        ipcRenderer.once('read-file', readFile);
      });
      Titorite.on('scroll', (editor) => {
        if (!self.scroll) self.scroll = 'left';
        if (self.scroll == 'left') {
          let scrollTop = editor.display.scroller.scrollTop;
          document.querySelector('.content-container').scrollTop = scrollTop;
          setTimeout(() => {
            if (scrollTop == editor.display.scroller.scrollTop) self.scroll = null;
          }, 500);
        }
      });
      document.querySelector('.content-container').addEventListener('scroll', () => {
        if (!self.scroll) self.scroll = 'right';
        if (self.scroll == 'right') {
          let scrollTop = document.querySelector('.content-container').scrollTop;
          Titorite.display.scroller.scrollTop = scrollTop;
          setTimeout(() => {
            if (scrollTop == document.querySelector('.content-container').scrollTop) self.scroll = null;
          }, 500);
        }
      });
      self.$store.commit('set-titorite', {
        Titorite
      });
      ipcRenderer.on('saved-success', (event, path) => {
        self.$store.commit('editing', {
          status: false
        });
        self.$store.commit('toggle-side-menu', {
          status: false
        });
        self.$store.state.tipping({
          type: 'success',
          message: '保存成功。'
        });
        if (path) self.$store.commit('save-file-path', {
          path
        });
      })
    },
    methods: {
      openExternal(event) {
        event.preventDefault();
        shell.openExternal(event.target.href)
      }
    },
    components: {
      leftPart,
      rightPart,
      coverBottom
    }
  };
</script>