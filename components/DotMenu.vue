<template lang="pug">
    v-menu.rel(bottom left open-on-hover :close-on-content-click="false")
        template(v-slot:activator='{ on }')
            v-btn(icon v-on='on')
                v-icon mdi-dots-vertical
        v-list
            v-list-item
                v-list-item-action
                    theme-btn
            v-list-item(to="/scheduling")
                v-list-item-title.uc Scheduling
</template>

<script>
import ThemeBtn from '~/components/ThemeToggle'
export default {
  components: {
    ThemeBtn
  }
}
</script>

<style lang="scss" scoped></style>
