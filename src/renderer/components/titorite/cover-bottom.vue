<template>
  <div class="cover-bottom">
    <div class="sidemenu-button" title="Menu" @click.stop="openSideMenu" onselectstart="return false">&#xe67e;</div>
    <div class="popupmenu-button" :class="{active:isPopupMenuOpened}" title="Mode" @click.stop="openPopupMenu" onselectstart="return false">&#xe79e;</div>
  </div>
</template>

<script>
  export default {
    name: 'cover-bottom',
    computed: {
      isPopupMenuOpened() {
        return this.$store.state.isPopupMenuOpened
      }
    },
    methods: {
      openSideMenu() {
        this.$store.commit('toggle-side-menu', {
          status: true
        })
      },
      openPopupMenu() {
        this.$store.commit('toggle-popup-menu', {
          status: true
        })
      }
    }
  };
</script>