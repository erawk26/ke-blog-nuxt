<template lang="pug">
  span
    v-list-item.uc.nav-item
        v-list-item-action.cursor.no-text(@click="cycleTheme()")
            v-icon {{colorMode==='auto'?'brightness_auto':$vuetify.theme.dark?'brightness_5':'brightness_4'}}
        v-list-item-content
            v-list-item-title {{colorMode==='auto'?'auto':$vuetify.theme.dark?'dark':'light'}}
</template>

<script>
export default {
  data: () => ({ colorMode: 'auto', isMini: true }),
  computed: {
    isNight: () => new Date().getHours() < 7 || new Date().getHours() > 17
  },
  mounted() {
    if (this.colorMode === 'auto') {
      // if the color mode is set to auto change the theme based on time of day
      this.changeTheme(this.isNight)
    }
  },
  methods: {
    changeTheme(bool) {
      // just change from light to dark, not cycling modes in here
      this.$vuetify.theme.dark =
        !bool === undefined ? !this.$vuetify.theme.dark : bool
    },
    getNextColorMode(color) {
      // just cycle the different modes, not changing color in here
      const nextColor =
        color === 'auto' ? 'light' : color === 'light' ? 'dark' : 'auto'
      return nextColor
    },
    cycleTheme() {
      // set colormode var, set theme
      this.colorMode = this.getNextColorMode(this.colorMode)
      this.colorMode === 'auto'
        ? this.changeTheme(this.isNight)
        : this.colorMode === 'dark'
        ? this.changeTheme(true)
        : this.changeTheme(false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
