<template>
  <div class="Titorite-container">
    <left-part ref="editorContainer"></left-part>
    <div class="Titorite-spliter"></div>
    <right-part ref="contentContainer"></right-part>
  </div>
</template>

<script>
  import CodeMirror from '@/assets/js/codemirror';
  import markdown from '@/assets/js/markdown';
  import xml from '@/assets/js/xml';
  import marked from 'marked';
  import highlight from 'highlight.js';
  import leftPart from './left-part';
  import rightPart from './right-part';
  export default {
    name: 'Titorite',
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
      xml(CodeMirror);
      markdown(CodeMirror);
      const Titorite = CodeMirror(Editor, {
        mode: {
          name: "markdown"
        },
        autoCloseBrackets: true,
        lineWrapping: true,
        scrollbarStyle: null,
        showCursorWhenSelecting: true,
        theme: "base16-light"
      });
      Titorite.on('change', () => {
        Content.innerHTML = marked(Titorite.getValue());
      });
      Titorite.on('scroll', () => {
        // _Ls('.CodeMiroir-right .content-container').scrollTop = _Ls('#CodeMiroir-editor .CodeMiroir-scroll').scrollTop;
      });
    },
    components: {
      leftPart,
      rightPart
    }
  };
</script>