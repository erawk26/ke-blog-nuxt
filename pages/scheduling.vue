<template lang="pug">
  article.page.scheduling()
    section.body.pa-5.max-pg-width
      h1.uc {{title}}
      div(v-html="$md.render(body)")
      v-form(ref='availability' v-on:submit.prevent)
        v-stepper(v-model='stepper', vertical='')
          v-stepper-step(:complete='stepper > 1', step='1' @click="stepper=1")
            | Enter Your Contact Info
          v-stepper-content(step='1')
            .eo-flex.center.pt-2
              v-text-field.mr-3(outlined v-model="firstName" label="First Name" required :rules='nameRules')
              v-text-field.ml-3(outlined v-model="lastName" label="Last Name" required :rules='nameRules')
            .eo-flex.center.pt-2
              v-text-field.mr-3(outlined v-model="email" label="Email" required :rules='emailRules')
              v-text-field.ml-3(outlined v-model="phone" label="Phone" required)
            v-btn.ml-2(outlined color='primary', @click='stepper += 1' :disabled="firstName.length<=2") Next
          v-stepper-step(:complete='stepper > 2', step='2' @click="stepper=Math.min(stepper,2)") Select Availability
          v-stepper-content(step='2')
            scheduler#scheduler(ref="scheduler" v-on:change="selectionChanged" :cal-start="calendar.start" :cal-end="calendar.end" :day-start="workDay.start" :day-end="workDay.end" :days="numOfDays")
            v-card.unstyle.pa-2.mb-5.output(elevation="4" tag="ul" key="schedule" v-if="schedule.length")
              li(v-for="(item,i) in schedule" :key="item.day") {{item.day}}
                ul.unstyle
                  li.flex.inline.mx-2(v-for="(time,j) in item.times") {{time}}
                v-divider.mt-1(v-if="i < schedule.length - 1" )  
            v-btn.mr-2(outlined color='primary', @click='stepper -= 1') Prev
            v-btn.ml-2(outlined color='primary', @click='stepper += 1' :disabled="datesArr.length===0") Next
          v-stepper-step(:complete='stepper > 3', step='3') Confirm Info
          v-stepper-content(step='3' @click="stepper=Math.min(stepper,3)")
            v-card.unstyle.pa-2.mb-5.output(elevation="4" tag="ul" key="schedule" v-if="schedule.length")
              li {{firstName}} {{lastName}} {{phone}} {{email}}
              li(v-for="(item,i) in schedule" :key="item.day") {{item.day}}
                ul.unstyle
                  li.flex.inline.mx-2(v-for="(time,j) in item.times") {{time}}
                v-divider.mt-1(v-if="i < schedule.length - 1" ) 
            v-textarea(v-if="firstName.length>=2" key="comments" outlined v-model='comments' label="comments" required)
            .eo-flex.pt-2.two-cols.a-start(key="formBtns")
              v-btn.mr-2(outlined color='primary', @click='stepper -= 1')
                | Prev
              v-btn.mr-2.bold(:disabled="!canSubmit" outlined color='success' @click='submitForm')
                | Send
              v-btn.mr-2.bold(outlined @click='reset')
                | Clear

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
      stepper: 1,
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
      this.setSchedule(formData.datesArr)
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
        const times = this.$refs.scheduler.concatTime(obj[day]).map((item) => {
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
      this.datesArr = evt
      this.schedule = this.userFormat(evt)
    },
    submitForm() {
      const obj = {
        firstName: this.firstName,
        lastName: this.lastName,
        schedule: this.schedule,
        datesArr: this.datesArr,
        comments: this.comments,
        email: this.email,
        phone: this.phone
      }
      localStorage.setItem('formInfo', JSON.stringify(obj))
    },
    setSchedule(data) {
      const startDay = new Date(this.calendar.start + 'T00:00')
      const startISO = getISODay(startDay) // get the day
      // TODO get old dates and convert to new ones based off day of week ISO

      // const newDay = format(addDays(startDay, diff), 'yyyy-MM-dd')
      // return {
      //   [newDay]: { start: item[itemDay].start, end: item[itemDay].end }
      // }
      console.log(startDay, startISO)
      this.$refs.scheduler.setSelected(data)
    },
    reset() {
      this.$refs.scheduler.reset()
      this.stepper = 2
      this.comments = ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
