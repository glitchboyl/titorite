<template>
  <div class="popup-menu" :class="{opened}" tabindex="-1" v-click-outside="closeMenu">
    <ul>
      <li v-for="md in modes" :class="{active:md.name == mode}" @click="modeChange(md.name)" :key="md.name">{{ md.title }}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'popup-menu',
    data() {
      return {
        modes: [{
          name: 'writing',
          title: '写作模式'
        }, {
          name: 'reading',
          title: '阅读模式'
        }, {
          name: 'preview',
          title: '预览模式'
        }]
      }
    },
    computed: {
      opened() {
        return this.$store.state.isPopupMenuOpened
      },
      mode() {
        return this.$store.state.mode
      }
    },
    methods: {
      modeChange(mode) {
        let self = this;
        self.$store.commit('mode-change', {
          mode
        });
        self.closeMenu();
      },
      closeMenu() {
        this.$store.commit('toggle-popup-menu', {
          status: false
        });
      }
    }
  }
</script>