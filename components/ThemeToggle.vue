<template lang="pug">
  span
    v-tooltip(allow-overflow right :position-y="150" :position-x="350" v-model="showTooltip")
      template(#activator="showTooltip")
        v-btn.dark-btn(link icon @mouseenter="flashTooltip()" @click="cycleTheme()")
          v-icon {{colorMode==='auto'?'brightness_auto':$vuetify.theme.dark?'brightness_5':'brightness_4'}}
      span {{colorMode==='auto'?'Auto':$vuetify.theme.dark?'Dark':'Light'}} Mode
</template>

<script>
export default {
  props: {},
  data: () => ({
    colorMode: 'auto',
    isMini: true,
    showTooltip: false,
    timeout: null
  }),
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
      this.flashTooltip()
    },
    flashTooltip(time) {
      time = time || 3000
      this.showTooltip = true
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.showTooltip = false
      }, time)
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
