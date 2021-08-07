<template lang="pug">
  article.page(:class="$route.name")
    section.album(:class="type()")
      album.rel(v-if="sliderData" :type="type()" :slides="sliderData.slides" :title="sliderData.title")
    section.body.pa-5.max-pg-width
      h1.uc {{title}}
      div(v-html="$md.render(body)")
    section.post-body-components
      | Page components will go here
    
</template>

<script>
export default {
  async asyncData({ params, payload }) {
    if (payload) {
      return payload
    } else {
      // get the global CMS fields
      const obj = await require(`~/assets/content/pages/${params.slug}.json`)
      // try {
      //   // try gathering any extra fields
      //   const extras = await require(`~/assets/content/page2/${params.slug}.json`)
      //   return { ...extras, ...obj }
      // } catch {
      // }
      return obj
    }
  },
  computed: {
    sliderData() {
      const albums = this.$store.state.albums
      const keys = albums.map((a) => a.title)
      return keys.includes(this.albumRel)
        ? albums[keys.indexOf(this.albumRel)]
        : null
    }
  },
  methods: {
    type() {
      return this.sliderData.type === 'default'
        ? 'carousel'
        : this.sliderData.type
    }
  }
}
</script>

<style lang="scss">
.album {
  @include set-max-width;
  &.hero {
    @include set-max-width(100%);
  }
  &.left {
  }
  &.right {
  }
  &.center {
  }
}
</style>
