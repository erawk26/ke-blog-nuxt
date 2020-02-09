<template lang="pug">
  article.page(:class="$route.name")
    section.body.pa-5.max-pg-width
      h1.uc {{$route.name}} Page
      ul
        li(v-for="post in newsPosts")
          nuxt-link(:to="'/news/'+post.slug")
            | {{post.title}}
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    newsPosts() {
      return this.$store.state.newsPosts
    }
  }
}
</script>

<style lang="scss" scoped></style>
