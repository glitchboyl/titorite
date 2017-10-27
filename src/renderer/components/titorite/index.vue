<template>
  <div class="Titorite-container" :class=[mode]>
    <left-part ref="editorContainer"></left-part>
    <div class="Titorite-spliter"></div>
    <right-part ref="contentContainer"></right-part>
    <cover-bottom></cover-bottom>
  </div>
</template>

<script>
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
        return this.$store.state.mode
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
      Titorite.on('change', (editor) => {
        Content.innerHTML = marked(editor.getValue());
      });
      Titorite.on('scroll', (editor) => {
        if (!self.scroll) self.scroll = 'left';
        if (self.scroll == 'left') {
          let scrollTop = editor.display.scroller.scrollTop;
          document.querySelector('.content-container').scrollTop = scrollTop;
          setTimeout(function() {
            if (scrollTop == editor.display.scroller.scrollTop) self.scroll = null;
          }, 500);
        }
      });
      document.querySelector('.content-container').addEventListener('scroll', () => {
        if (!self.scroll) self.scroll = 'right';
        if (self.scroll == 'right') {
          let scrollTop = document.querySelector('.content-container').scrollTop;
          Titorite.display.scroller.scrollTop = scrollTop;
          setTimeout(function() {
            if (scrollTop == document.querySelector('.content-container').scrollTop) self.scroll = null;
          }, 500);
        }
      });
    },
    components: {
      leftPart,
      rightPart,
      coverBottom
    }
  };
</script>