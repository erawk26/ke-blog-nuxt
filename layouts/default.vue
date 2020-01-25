<template lang="pug">
  v-app
    .main-layout.css-grid-2
      app-header
      main.full-width.max-pg-width.row-1.row-span-1.col-full.pt-5
        nuxt.pad-under-max
      app-footer
</template>

<script>
import AppHeader from '../components/Header'
import AppFooter from '../components/Footer'
export default {
  components: { AppHeader, AppFooter },
  data() {
    return {
      scrolled: 'top'
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.addEventListener('scroll', this.debounce(this.onScroll, 200))
  },
  methods: {
    childRoute(href) {
      return this.$route.path.split('/').includes(href.replace('/', ''))
    },
    onScroll() {
      const threshhold = 100
      if (window.pageYOffset < threshhold) {
        this.scrolled = 'top'
      } else if (
        window.innerHeight + window.pageYOffset + 1 >=
        document.body.offsetHeight
      ) {
        this.scrolled = 'bottom'
      } else {
        this.scrolled = 'middle'
      }
    },
    debounce(func, wait, immediate) {
      let timeout
      return function() {
        const context = this
        const args = arguments
        const later = function() {
          timeout = null
          if (!immediate) func.apply(context, args)
        }
        const callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/_atomic.scss';
@import '~/assets/scss/_animations.scss';
@import '~/assets/scss/_global.scss';
.main-layout {
  grid-template-rows: 1fr 65px;

  @media (max-width: 599px) {
    grid-template-rows: 1fr 135px;
  }
  height: 100%;
}
.pad-under-max {
  $padding: 60px;
  $bp: $page-max-width + ($padding * 2);
  padding: 0;
  @media (min-width: 600px) and (max-width: $bp - 1) {
    padding-left: $padding;
    padding-right: $padding;
  }
}
.scrolled:not(.top) .navigation-drawer {
  z-index: 100;
  top: -60px;
  left: 0;
  width: 100%;
  transform: translateY(45px);
  position: fixed;
  transition: all 1s ease;
}
// .scrolled:not(.bottom) footer {
//   z-index: 100;
//   bottom: -60px;
//   left: 0;
//   width: 100%;
//   transform: translateY(-60px);
//   position: fixed;
//   transition: all 1s ease 1s;
// }
</style>
