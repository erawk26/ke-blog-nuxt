<template lang="pug">
  v-app
    v-navigation-drawer(v-model="drawer" disable-resize-watcher app right close-on-click)
      .z-index-10.abs.top.right.mt-2.px-4.flex-grow-1.j-end
        dot-menu
      my-menu.nav-main.menu--main(type="dropdown" :menu="$store.state.menus.main" hide-icon)
    v-app-bar.full-width(
      shrink-on-scroll
      prominent
      scroll-threshold="200"
      min-height="75"
      app)
      component(is="Header")
      v-app-bar-nav-icon.mobile-only(@click="drawer=!drawer")
    v-main.main-layout.full-width.row-1.row-span-1.col-full
      nuxt
    component(is="Footer").row-2.row-span-1.col-full
</template>

<script>
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import MyMenu from '~/components/Menu'
import DotMenu from '~/components/DotMenu'
export default {
  components: { DotMenu, MyMenu, Header, Footer },
  data() {
    return {
      drawer: false,
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
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/_global.scss';
@import '~/assets/scss/_vuetify.scss';
@import '~/assets/scss/_atomic.scss';
@import '~/assets/scss/_animations.scss';
.main-layout {
  // grid-template-rows: 1fr 5.5rem;
  // @media (max-width: $menu-bp - 1) {
  //   grid-template-rows: 0px 1fr 13.5rem;
  // }
}
.v-app-bar {
  .v-toolbar__content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @extend .abs-center;
  }
}
.pad-under-max {
  @include pad-under-max;
  @media (max-width: $menu-bp - 1) {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}
.scrolled:not(.top) .navigation-drawer {
  z-index: 100;
  top: -6rem;
  left: 0;
  width: 100%;
  transform: translateY(4.5rem);
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
