<template lang="pug">
  my-menu.nav-main.menu--main.eo-flex.j-start(type="flat" :menu="$store.state.menus.main" hide-icon :parentState="isMini")
</template>

<script>
import MyMenu from '~/components/Menu'
export default {
  name: 'AppHeader',
  components: { MyMenu },
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

<style lang="scss"></style>
