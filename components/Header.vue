<template lang="pug">
  .header-wrapper.eo-flex.a-stretch.full-width.max-pg-width
    .cell.site-logo.eo-flex.center
      logo
    v-spacer
    .cell.eo-flex.a-center.j-end
      my-menu.nav-main.menu--main.eo-flex.j-start(v-if="!$vuetify.breakpoint.smAndDown" type="flat" :menu="$store.state.menus.main" hide-icon :parentState="isMini")
      //v-menu(bottom left)
        template(v-slot:activator='{ on }')
          v-btn(icon v-on='on')
            v-icon mdi-dots-vertical
        v-list
          v-list-item
            v-list-item-title link 1
          v-list-item
            v-list-item-title link 2
          v-list-item
            v-list-item-title link 3
</template>

<script>
import Logo from '~/components/Logo'
import MyMenu from '~/components/Menu'
export default {
  name: 'AppHeader',
  components: { MyMenu, Logo },
  data: () => ({ loading: true, isMini: true }),
  computed: {},
  watch: {
    isMini() {}
  },
  mounted() {
    this.loading = false
  },
  methods: {}
}
</script>

<style lang="scss">
header {
  .header-wrapper {
    height: 100%;
  }
  .site-logo {
    width: 95px;
    svg {
      // height: 100%;
      // display: block;
      // // height: 100%;
      // width: auto;
    }
  }
}
</style>
