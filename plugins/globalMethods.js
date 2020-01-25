import Vue from 'vue'
Vue.mixin({
  methods: {
    looper(arr, value, dir = 1) {
      const len = arr.length
      return arr[(arr.indexOf(value) + ((dir * -1) % len) + len) % len]
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
    },
    machine_readable: (val) =>
      val
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
  }
})
