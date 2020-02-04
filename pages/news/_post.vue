<template>
  <article>
    <h1>{{ blogPost.title }}</h1>
  </article>
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
