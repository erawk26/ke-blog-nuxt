<template lang="pug">
  article(:class="$route.name")
    h1.uc {{title}}
    div(v-html="$md.render(body)")
</template>

<script>
export default {
  computed: {
    sliderData() {
      const albums = this.$store.state.albums
      const keys = albums.map((a) => a.title)
      return keys.includes(this.albumRel)
        ? albums[keys.indexOf(this.albumRel)]
        : null
    }
  },
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
  }
}
</script>

<style lang="scss" scoped></style>
