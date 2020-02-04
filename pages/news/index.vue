<template lang="pug">
  section(:class="$route.name")
    h1.uc {{$route.name}} Page
    ul
      li(v-for="post in blogPosts")
        nuxt-link(:to="'/news/'+post.slug")
          | {{post.title}}
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    blogPosts() {
      return this.$store.state.blogPosts
    }
  }
}
</script>

<style lang="scss" scoped></style>
