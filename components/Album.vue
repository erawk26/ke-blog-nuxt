<template lang="pug">
  section.carousel
    carousel(loop autoplay :scroll-per-page="false" :autoplay-timeout="5000" :per-page="1" autoplay-hover-pause v-model="active" :perPageCustom="style==='hero'?[[760, 2] , [960, 3], [1080, 4]]:false")
      slide(v-for='(slide, i) in slides', :key='i')
        v-card
          v-img(aspect-ratio="1.77" :src="slide.image")
          .caption.full-width.abs.right.bottom.px-5.text-right(v-if="slide.caption")
            span.text-shadow(v-html="$md.render(slide.caption)")
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
    style: {
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

<style lang="scss" scoped>
.caption {
  color: $primary;
  background: linear-gradient(
    180deg,
    rgba(black, 0) 0%,
    rgba(black, 0.35) 75%,
    rgba(black, 0.65) 100%
  );
}
</style>
