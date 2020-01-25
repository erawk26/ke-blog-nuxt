<template lang="pug">
    .wrapper
        .loading
            div(:style="`background-color:${bgColor};`")
            div(:style="`background-color:${bgColor};`")
            div(:style="`background-color:${bgColor};`")
            div(:style="`background-color:${bgColor};`")
</template>

<script>
export default {
  props: {
    color: {
      default: null,
      type: String
    }
  },
  computed: {
    bgColor() {
      return this.color || this.$vuetify.theme.currentTheme.primary
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.loading {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
    &:nth-child(1) {
      left: 8px;
      animation: load-state-1 0.6s infinite;
    }
    &:nth-child(2) {
      left: 8px;
      animation: load-state-2 0.6s infinite;
    }
    &:nth-child(3) {
      left: 32px;
      animation: load-state-2 0.6s infinite;
    }
    &:nth-child(4) {
      left: 56px;
      animation: load-state-3 0.6s infinite;
    }
  }
}
@keyframes load-state-1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes load-state-3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes load-state-2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>
