<template lang="pug">
  article.page.home()
    section.hero
      album.rel(v-if="sliderData" type="carousel" :slides="sliderData.slides" :title="sliderData.title")
    section.body.pa-5.max-pg-width
      h1.uc {{title}}
      div(v-html="$md.render(body)")
    section.post-body-components
      | Page components will go here

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
  components: {},
  async asyncData({ params, payload }) {
    if (payload) {
      return payload
    } else {
      const obj = await require('~/assets/content/page2/homepage.json')
      obj.sliderData = await require('~/assets/content/album/nested-fields-gallery.json')
      return obj
    }
  }
}
</script>

<style lang="scss" scoped></style>
