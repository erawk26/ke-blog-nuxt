<template lang="pug">
  section.home()
    h1.uc Intro Page
</template>

<script>
export default {
  head() {
    return {
      script: [
        { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }
      ]
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped></style>
