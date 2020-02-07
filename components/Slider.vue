<template lang="pug">
  .slider
    transition(mode="out-in" :name="animationName")
      .slide(v-for="(slide,i) in slides" v-if="active==i" :key="i")
        h3 {{ slide.title }}
        p(v-html="$md.render(slide.caption)")
    v-btn.prev.mx-2.mb-2(small @click="loop(-1)") prev
    v-btn.next.mx-2.mb-2(small @click="loop(1)") next
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
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      active: 0,
      animationName: 'slide-right'
    }
  },
  methods: {
    loop(dir) {
      const next = this.active + dir
      this.animationName = dir > 0 ? 'slide-left' : 'slide-right'
      this.active =
        next < 0
          ? this.slides.length - 1
          : next >= this.slides.length
          ? 0
          : next
    }
  }
}
</script>

<style lang="scss" scoped></style>
