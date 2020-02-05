<template lang="pug">
  article
    h1 {{ newsPost.title }}
    div(v-html="$md.render(newsPost.body)")
</template>

<script>
export default {
  async asyncData({ params, payload }) {
    if (payload) return { newsPost: payload }
    else
      return {
        newsPost: await require(`~/assets/content/news/${params.post}.json`)
      }
  }
}
</script>

<style lang="scss" scoped></style>
