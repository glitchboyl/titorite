<template>
  <div class="about-cover">
    <div class="about">
      <div class="about-header">
        <img class="logo" src="../assets/cat.png">
        <div>Titorite</div>
      </div>
      <div class="about-main"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tip',
    computed: {
      tipType() {
        return `tip-${this.$store.state.tip.type}`;
      },
      message() {
        return this.$store.state.tip.message;
      },
      isTipShowed() {
        return this.$store.state.isTipShowed;
      }
    }
  };
</script>