<template lang="pug">
  article.home()
    h1.uc {{title}}
    div(v-html="$md.render(body)")
    //- slider(:slides="slideData.slides" :title="slideData.title")

</template>

<script>
// import Slider from '~/components/Slider'
export default {
  head() {
    return {
      script: [
        { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }
      ]
    }
  },
  components: {
    // Slider
  },
  async asyncData({ params, payload }) {
    if (payload) {
      return payload
    } else {
      const obj = await require('~/assets/content/extra/homepage.json')
      // obj.slideData = await require('~/assets/content/album/nested-fields-gallery.json')
      return obj
    }
  }
}
</script>

<style lang="scss" scoped></style>
