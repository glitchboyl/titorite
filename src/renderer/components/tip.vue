<template>
  <div class="tip-instance tip-pop" :class="[tipType,{'tip-shown':isTipShowed}]" style="text-align: center;">
    <div class="tip-main">{{ message }}</div>
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