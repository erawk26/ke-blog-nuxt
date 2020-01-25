<template lang="pug">
  v-header
    my-menu(type="flat" :menu="$store.state.menus.main" :parentState="isMini")
      template(v-slot:extra)           
        theme-btn
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
