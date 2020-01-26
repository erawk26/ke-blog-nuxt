<template lang="pug">
  .row-2.row-span-1.col-full.full-width
    v-card.max-pg-width.d-flex.align-center.justify-start.flex-wrap.px-2(tile elevation="0")
      .cell.flex-grow.copy
        theme-btn.mr-3
        sub &copy; 2015 - {{ year }}. {{ companyName }}
      .cell
        my-menu.nav-footer.menu--footer.d-flex.justify-start(:menu="menus.footer" hide-text type="flat")
</template>

<script>
import MyMenu from '~/components/Menu'
import ThemeBtn from '~/components/ThemeToggle'
export default {
  name: 'AppFooter',
  components: { ThemeBtn, MyMenu },
  computed: {
    menus() {
      return this.$store.state.menus
    },
    companyName() {
      return this.$store.state.siteInfo
        ? this.$store.state.siteInfo.company.name
        : ''
    },
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss">
footer.v-footer {
  height: 100%;
  &.theme--dark {
    background-color: #424242;
  }
  &.theme--light {
    background-color: $white;
  }
}
.v-bottom-navigation {
  .nav-main.menu--main {
    padding: 0;
    max-width: 100%;
    i {
      font-size: 2.5rem;
    }
    .nav-item {
      flex: 1;
      padding: 0;
      max-width: 75px;
    }
    button.v-btn {
      padding: 0;
      height: 100%;
    }
  }
}
footer > .v-card {
  width: 100%;
}
.nav-footer {
  .v-list-item__action {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  a.nav-item.v-list-item--link {
    padding: 0 6px;
  }
}
</style>
