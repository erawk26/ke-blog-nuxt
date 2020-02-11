<template lang="pug">
  .header-wrapper.eo-flex.a-stretch.full-width.max-pg-width
    nuxt-link.cell.site-logo.eo-flex.center(to="/" title="Home")
      logo
    v-spacer
    .cell.eo-flex.a-center.j-end.desktop-only
      my-menu.underline.nav-main.menu--main.eo-flex.j-start(type="flat" :menu="$store.state.menus.main.slice(1)" hide-icon :parentState="isMini")
        template(v-slot:extra)
          dot-menu
</template>

<script>
import Logo from '~/components/Logo'
import MyMenu from '~/components/Menu'
import DotMenu from '~/components/DotMenu'
export default {
  name: 'AppHeader',
  components: { DotMenu, MyMenu, Logo },
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
    min-width: 95px;
    svg {
      // height: 100%;
      // display: block;
      // // height: 100%;
      // width: auto;
    }
  }
}
</style>
