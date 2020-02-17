<template lang="pug">
  article.page.scheduling()
    section.body.pa-5.max-pg-width
      h1.uc {{title}}
      div(v-html="$md.render(body)")
      v-form(ref='availability' v-on:submit.prevent)
        transition-group(name="accordion-fade")
          .eo-flex.center(v-if="!loading" key="clientName")
            v-text-field.mr-3(outlined v-model="firstName" label="First Name" required :rules='nameRules')
            v-text-field.ml-3(outlined v-model="lastName" label="Last Name" required :rules='nameRules')
          .eo-flex.center(v-if="!loading" key="clientContact")
            v-text-field.mr-3(outlined v-model="email" label="Email" required :rules='emailRules')
            v-text-field.ml-3(outlined v-model="phone" label="Phone" required)
          scheduler#scheduler(v-if="!loading" ref="scheduler" v-on:change="selectionChanged" :cal-start="calendar.start" :cal-end="calendar.end" :day-start="workDay.start" :day-end="workDay.end" :days="numOfDays" key="calendar")
          v-textarea(v-if="firstName.length>=2" key="comments" outlined v-model='comments' label="comments" required)
          v-card.unstyle.pa-2.mb-5.output(elevation="4" tag="ul" key="schedule" v-if="schedule.length")
            li(v-for="(item,i) in schedule" :key="item.day") {{item.day}}
              ul.unstyle
                li.flex.inline.mx-2(v-for="(time,j) in item.times") {{time}}
              v-divider.mt-1(v-if="i < schedule.length - 1" )  
          .eo-flex.two-cols.a-start(v-if="canSubmit" key="formBtns")
            v-btn.mr-4.bold(outlined color='success' @click='submitForm')
              | Send
            v-btn.mr-4.bold(outlined color='error' @click='reset')
              | Clear
          .warning.pa-3(rounded v-if="!canSubmit" key="warning")
            template(v-if="firstName.length<2") Please fill out your Name
            template(v-if="datesArr.length===0") Please add your availability in the form

</template>

<script>
/* eslint-disable no-console */
import { getISODay, compareAsc, subDays, addDays, format } from 'date-fns'
import { emailRules, nameRules } from '~/assets/js/formRules'
import Scheduler from '~/components/Scheduler'
export default {
  components: { Scheduler },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      loading: true,
      today: format(new Date(), 'yyyy-MM-dd'),
      datesArr: [],
      schedule: [],
      comments: '',
      errorMsg: null,
      workDay: {
        start: '07:00',
        end: '19:00'
      },
      calendar: {},
      emailRules,
      nameRules
    }
  },
  computed: {
    canSubmit() {
      return this.firstName.length >= 2 && this.datesArr.length > 0
    }
  },
  watch: {},
  async asyncData({ params, payload }) {
    if (payload) {
      return payload
    } else {
      const obj = await require('~/assets/content/page2/scheduling.json')
      return obj
    }
  },
  mounted() {
    this.calendar = this.cal()
    if (localStorage.formInfo) {
      const formData = JSON.parse(localStorage.formInfo)
      this.firstName = formData.firstName
      this.lastName = formData.lastName
      this.comments = formData.comments
      this.phone = formData.phone
      this.email = formData.email
    }
    this.loading = false
  },
  methods: {
    datesort: (arr) =>
      arr.sort((p, c) =>
        compareAsc(new Date(p + 'T00:00'), new Date(c + 'T00:00'))
      ),
    userFormat(data) {
      const formatted = data.map((obj) => {
        const day = Object.keys(obj)[0]
        const formattedDay = format(new Date(day + 'T00:00'), 'iiii, MMM do')
        const times = obj[day].map((item) => {
          const start = format(new Date(day + 'T' + item.start), 'h:mmaaaa')
          const end = format(new Date(day + 'T' + item.end), 'h:mmaaaa')
          return (start + ' - ' + end).replace(/:00|\./gi, '')
        })
        return { day: formattedDay, times }
      })
      return formatted
    },
    cal() {
      const isoToday = getISODay(new Date())
      const isoStart = this.startDay
      const n = this.numOfDays
      const start =
        isoToday > isoStart
          ? format(subDays(new Date(), isoToday - isoStart), 'yyyy-MM-dd')
          : format(addDays(new Date(), isoStart - isoToday), 'yyyy-MM-dd')
      const end = format(addDays(new Date(start), n), 'yyyy-MM-dd')
      return { start, end }
    },
    selectionChanged(evt) {
      this.datesArr = evt // Object.assign(evt)
      this.schedule = this.userFormat(evt) // this.datesort(Object.assign(evt))
    },
    submitForm() {
      const obj = {
        firstName: this.firstName,
        lastName: this.lastName,
        schedule: this.schedule,
        comments: this.comments,
        email: this.email,
        phone: this.phone
      }
      localStorage.setItem('formInfo', JSON.stringify(obj))
    },
    reset() {
      this.$refs.scheduler.reset()
      this.comments = ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
