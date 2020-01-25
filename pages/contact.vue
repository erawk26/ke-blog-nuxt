<template lang="pug">
  section(:class="$route.name")
    h1.uc {{$route.name}} component
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped></style>
