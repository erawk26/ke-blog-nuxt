<template lang="pug">
  article.page(:class="$route.name")
    section.body.pa-5.max-pg-width
      h1.uc {{title}}
      div(v-html="$md.render(body)")
</template>

<script>
export default {
  async asyncData({ params, payload }) {
    if (payload) {
      return payload
    } else {
      const obj = await require(`~/assets/content/news/${params.slug}.json`)
      return obj
    }
  }
}
</script>

<style lang="scss" scoped></style>
