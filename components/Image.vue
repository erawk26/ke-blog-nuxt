<template lang="pug">
  v-img(v-if="imgUrl" :alt="alt" :title="title" :lazy-src="lazyUrl" :src="imgUrl")
    template(v-slot:placeholder)
      v-row.fill-height.ma-0(align='center' justify='center')
        component(:is="imageStyle!=='avatar'?'loading':'v-progress-circular'" :color='$vuetify.theme.currentTheme.primary' indeterminate)
</template>
<script>
import Loading from '~/components/Loading'
export default {
  components: { Loading },
  props: {
    imageStyle: { type: String, default: 'thumb' },
    handle: { type: String, default: '' },
    alt: { type: String, default: '' },
    title: { type: String, default: '' }
  },
  data: () => ({
    resize: '',
    imgWidth: 100,
    imgHeight: 100
  }),
  computed: {
    lazyUrl() {
      return `http://via.placeholder.com/${this.imgWidth}x${this.imgHeight}`
    },
    imgUrl() {
      return `https://media.graphcms.com/${this.resize}${this.handle}`
    }
  },
  watch: {
    handle() {}
  },
  mounted() {
    switch (this.imageStyle) {
      case 'thumb':
        this.imgWidth = 100
        this.imgHeight = 100
        this.resize = `resize=w:${this.imgWidth},h:${this.imgHeight},fit:crop/`
        break
      case 'full':
        this.imgWidth = 1600
        this.imgHeight = 900
        this.resize = `resize=w:${this.imgWidth},h:${this.imgHeight},fit:crop/`
        break
      case 'avatar':
        this.imgWidth = 300
        this.imgHeight = 300
        this.resize = `resize=w:${this.imgWidth},h:${this.imgHeight},fit:crop/`
        break
      case 'original':
        this.resize = ''
    }
  },
  methods: {}
}
</script>

<style lang="scss"></style>
