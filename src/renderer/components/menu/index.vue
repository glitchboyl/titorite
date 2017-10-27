<template>
  <div class="menu-cover" :class="{opened}" @click.self="closeMenu">
    <side-menu></side-menu>
    <popup-menu></popup-menu>
  </div>
</template>

<script>
import sideMenu from './side-menu';
import popupMenu from './popup-menu';
  export default {
    name: 'menu-cover',
    computed: {
      opened() {
        return this.$store.state.isSideMenuOpened
      }
    },
    methods: {
      closeMenu() {
        let self = this;
        if (self.opened) {
          this.$store.commit('toggle-side-menu', {
            status: false
          })
        }
      }
    },
    components:{
      sideMenu,
      popupMenu
    }
  }
</script>