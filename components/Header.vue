<template lang="pug">
  my-menu.nav-main.menu--main.eo-flex.j-start(type="flat" :menu="$store.state.menus.main" hide-icon :parentState="isMini")
    template(v-slot:extra)           
      theme-btn(hide-text)
</template>

<script>
import MyMenu from '~/components/Menu'
import ThemeBtn from '~/components/ThemeToggle'
export default {
  name: 'AppHeader',
  components: { MyMenu, ThemeBtn },
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
