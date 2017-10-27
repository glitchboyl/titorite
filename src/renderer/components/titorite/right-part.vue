<template>
  <div class="Titorite-right">
    <div class="content-container">
      <div class="cover-top"></div>
      <div id="content" class="preview markdown-body" ref="content"></div>
      <cover-bottom></cover-bottom>
    </div>
  </div>
</template>

<script>
  import coverBottom from './right-bottom'
  export default {
    name: 'Titorite-right',
    components: {
      coverBottom
    }
  };
</script>