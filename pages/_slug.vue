<template lang="pug">
  article(:class="$route.name")
    h1.uc {{title}}
    div(v-html="$md.render(body)")
</template>

<script>
export default {
  async asyncData({ params, payload }) {
    if (payload) {
      return payload
    } else {
      // get the global CMS fields
      const obj = await require(`~/assets/content/pages/${params.slug}.json`)
      try {
        // try gathering any extra fields
        const extras = await require(`~/assets/content/extra/${params.slug}.json`)
        return { ...extras, ...obj }
      } catch {
        // console.log('no file')
      }
      return obj
    }
  }
}
</script>

<style lang="scss" scoped></style>
