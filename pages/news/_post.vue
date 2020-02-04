<template lang="pug">
  article
    h1 {{ blogPost.title }}
    div(v-html="$md.render(blogPost.body)")
</template>

<script>
export default {
  async asyncData({ params, payload }) {
    if (payload) return { blogPost: payload }
    else
      return {
        blogPost: await require(`~/assets/content/blog/${params.post}.json`)
      }
  }
}
</script>

<style lang="scss" scoped></style>
