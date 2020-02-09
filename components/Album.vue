<template lang="pug">
  section.carousel
    carousel(loop autoplay navigation-enabled :scroll-per-page="false" :autoplay-timeout="5000" :per-page="1" autoplay-hover-pause v-model="active" :perPageCustom="[[760, 2] , [960, 3], [1080, 4]]")
      slide(v-for='(slide, i) in slides', :key='i')
        v-card
          v-img(aspect-ratio="1.77" :src="slide.image")
          .abs.right.bottom.pa-5
            p(v-html="$md.render(slide.caption)")
</template>

<script>
export default {
  props: {
    slides: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'carousel'
    },
    desc: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      active: 0,
      animationName: 'fade'
    }
  },
  methods: {
    // loop(dir) {
    //   const next = this.active + dir
    //   this.animationName = dir > 0 ? 'slide-left' : 'slide-right'
    //   this.active =
    //     next < 0
    //       ? this.slides.length - 1
    //       : next >= this.slides.length
    //       ? 0
    //       : next
    // }
  }
}
</script>

<style lang="scss" scoped></style>
