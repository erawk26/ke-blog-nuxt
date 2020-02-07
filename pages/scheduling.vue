<template lang="pug">
  article.scheduling()
    h1.uc {{title}}
    div(v-html="$md.render(body)")
    transition(name="accordion-fade")
      v-form(ref='availability' v-if="!loading" netlify)
        v-menu(v-model='datepickerIsOpen' :close-on-content-click='true' transition='scale-transition' offset-y min-width='290px')
          template(v-slot:activator='{ on }')
            v-text-field(outlined v-model='dates' label='Availability' append-icon='event' readonly v-on='on')
          v-date-picker(v-model='dates' @input='dateAdded')
        transition(name="accordion-fade")
          v-combobox(outlined deletable-chips v-model="datesArr" v-if="datesArr.length" :items="datesArr" label="Your Times" multiple chips)
        v-textarea(outlined v-model='comments' label="body" required)
        v-btn.mr-4.bold(outlined color='success' @click='submitForm')
          | Send
        v-btn.mr-4.bold(outlined color='error' @click='reset')
          | Clear   

</template>

<script>
// import Slider from '~/components/Slider'
export default {
  components: {
    // Slider
  },
  data() {
    return {
      loading: true,
      datepickerIsOpen: false,
      dates: '',
      datesArr: [],
      comments: ''
    }
  },
  async asyncData({ params, payload }) {
    if (payload) {
      return payload
    } else {
      const obj = await require('~/assets/content/page2/scheduling.json')
      // obj.slideData = await require('~/assets/content/album/nested-fields-gallery.json')
      return obj
    }
  },
  mounted() {
    setTimeout(() => {
      this.loading = false
    }, 2000)
  },
  methods: {
    dateAdded(newVal) {
      this.datesArr.push(newVal)

      // eslint-disable-next-line no-console
      console.log(newVal)
    },
    submitForm() {},
    reset() {}
  }
}
</script>

<style lang="scss" scoped></style>
