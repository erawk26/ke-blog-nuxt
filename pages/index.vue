<template lang="pug">
  article.home()
    h1.uc {{title}}
    div(v-html="$md.render(body)")
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
  async asyncData({ params, payload }) {
    if (payload) {
      return payload
    } else {
      const obj = await require('~/assets/content/home.json')
      return obj
    }
  }
}
</script>

<style lang="scss" scoped></style>
