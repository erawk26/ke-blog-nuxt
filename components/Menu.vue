<template lang="pug">
  v-list(:dense="true" :color="color")
    v-list-item.nav-item.uc(v-for='(item, i) in menu' :key='i' :to="item.to" :href="item.href" link :nuxt="!item.external" :target="item.external?'_blank':'_self'" :title="item.title")
      //FLAT MENU HERE
      template(v-if="type=='flat'")
        v-list-item-action(:class="{'no-text':hideText }")
          v-icon {{item.icon}}
        v-list-item-content(:class="{'visually-hidden':hideText }")
          v-list-item-title {{item.title}}
      // MOBILE VIEW HERE
      .full-width.d-flex.flex-column.align-center(v-else-if="type == 'mobile'" active='')
        v-icon.d-block {{item.icon}}
        span {{item.title}}
      // DROPDOWN MENU HERE  
      v-list-group.flex-grow-1(v-else :prepend-icon="item.icon" :append-icon="!item.submenu?'':'expand_more'")
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
      default: false
    },
    parentState: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // parentState: (newV, oldV) => //console.log(newV, oldV)
  }
}
</script>
<style lang="scss" scoped>
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
</style>
