<template lang="pug">
  v-list(:dense="true" :color="color")
    v-list-item.nav-item.uc(v-for='(item, i) in menu' :key='i' :to="item.to" :href="item.href" link :nuxt="!item.external" :target="item.external?'_blank':'_self'" :title="item.title")
      //FLAT MENU HERE
      template(v-if="type=='flat'")
        v-list-item-action(:class="{'visually-hidden':hideIcon,'no-text':hideText }")
          v-icon {{item.icon}}
        v-list-item-content(:class="{'visually-hidden':hideText,'no-icon':hideIcon }")
          v-list-item-title {{item.title}}
      // MOBILE VIEW HERE
      .full-width.d-flex.flex-column.align-center(v-else-if="type == 'mobile'" active='')
        v-icon.d-block {{item.icon}}
        span {{item.title}}
      // DROPDOWN MENU HERE  
      v-list-group.flex-grow-1(v-else :prepend-icon="hideIcon?'':item.icon" :append-icon="!item.submenu?'':'expand_more'")
        template(v-slot:activator)
          v-list-item-content()
            v-list-item-title() {{item.title}}
        v-list-item(v-if="!parentState" v-for='(subitem, j) in item.submenu', :key='j' dense sub-group  :to="subitem.to" :href="subitem.href" link :nuxt="!subitem.external" :target="subitem.external?'_blank':'_self'")
            v-list-item-content()
              v-list-item-title() {{subitem.title}}
    slot(name="extra")
</template>
<script>
export default {
  components: {},
  props: {
    menu: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'flat'
    },
    color: {
      type: String,
      default: 'transparent'
    },
    hideText: {
      type: Boolean,
      default: null
    },
    hideIcon: {
      type: Boolean,
      default: null
    },
    parentState: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  watch: {
    // parentState: (newV, oldV) => //console.log(newV, oldV)
  }
}
</script>
<style scoped>
.v-list-item__action.no-text {
  margin-left: 0;
  margin-right: 0;
}
</style>
<style lang="scss">
.v-list-item.nav-item .v-list-item__title {
  line-height: 1;
  font-size: 1.8rem;
}
.v-navigation-drawer a.nav-item {
  padding: 0;
}
.underline.v-list {
  .v-list-item {
    //normal state
    &::before {
      width: calc(100% - 10px);
      margin: auto;
      background: none;
      transform: translateY(2rem);
      opacity: 0;
    }
  }
  .v-list-item--active,
  .v-list-item:hover {
    //hover or active
    &::before {
      transform: translateY(0);
      .theme--dark & {
        border-bottom: 1px solid $theme--dark-link;
      }
      .theme--light & {
        border-bottom: 1px solid $theme--light-link;
      }
      background: none;
      opacity: 1;
    }
  }
}
</style>
