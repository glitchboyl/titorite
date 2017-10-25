<template>
  <div class="Titorite-left">
    <div class="cover-top"></div>
    <div id="Titorite-editor" ref="editor"></div>
    <cover-bottom></cover-bottom>
  </div>
</template>

<script>
  import coverBottom from './left-bottom'
  export default {
    name: 'Titorite-left',
    components: {
      coverBottom
    }
  };
</script>