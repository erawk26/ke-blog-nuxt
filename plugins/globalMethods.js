import Vue from 'vue'
Vue.mixin({
  methods: {
    looper(arr, value, dir = 1) {
      const len = arr.length
      return arr[(arr.indexOf(value) + ((dir * -1) % len) + len) % len]
    },
    machine_readable: (val) =>
      val
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
  }
})
