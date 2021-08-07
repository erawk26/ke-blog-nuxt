<template lang="pug">
article.page.scheduling
  section.body.pa-5.max-pg-width
    h1.uc {{ title }}
    div(v-html='$md.render(body)')
    v-alert(
      v-if='statusMsg || errorMsg',
      dense,
      icon=false,
      outlined,
      text,
      :type='errorMsg ? "error" : "success"'
    )
      | {{ statusMsg || errorMsg }}
    v-form(ref='availability', v-on:submit.prevent)
      v-stepper(v-model='stepper', vertical='')
        v-stepper-step(:complete='stepper > 1', step='1', @click='stepper = 1')
          | Enter Your Contact Info
        v-stepper-content(step='1')
          .eo-flex.center.pt-2
            v-text-field.mr-3(
              outlined,
              v-model='firstName',
              label='First Name',
              required,
              :rules='nameRules'
            )
            v-text-field.ml-3(
              outlined,
              v-model='lastName',
              label='Last Name',
              required,
              :rules='nameRules'
            )
          .eo-flex.center.pt-2
            v-text-field.mr-3(
              outlined,
              v-model='email',
              label='Email',
              required,
              :rules='emailRules'
            )
            v-text-field.ml-3(
              outlined,
              v-model='phone',
              label='Phone',
              required
            )
          v-btn.ml-2(
            outlined,
            color='success',
            @click='stepper += 1',
            :disabled='firstName.length <= 2'
          ) Next
        v-stepper-step(
          :complete='stepper > 2',
          step='2',
          @click='stepper = Math.min(stepper, 2)'
        ) Select Availability
        v-stepper-content(step='2')
          scheduler#scheduler(
            ref='scheduler',
            v-on:change='selectionChanged',
            :cal-start='calendar.start',
            :cal-end='calendar.end',
            :day-start='workDay.start',
            :day-end='workDay.end',
            :days='numOfDays',
            :iso-start='startDay'
          )
          template(v-for='(item, i) in schedule', v-if='schedule.length')
            h2.mt-1.display-1.full-width {{ item.day }}
            v-chip-group
              template(v-for='(time, j) in item.times')
                v-chip.ma-1 {{ time }}
                //v-divider.mt-1(v-if="i < schedule.length - 1" )
          .eo-flex.j-start.a-center.mt-5
            v-btn.mr-2(outlined, color='warning', @click='stepper -= 1') Prev
            v-btn.mr-2.bold(outlined, color='error', @click='reset') Clear
            v-btn.mr-2(
              outlined,
              color='success',
              @click='stepper += 1',
              :disabled='datesArr.length === 0'
            ) Next
        v-stepper-step(:complete='stepper > 3', step='3') Confirm Info
        v-stepper-content(step='3', @click='stepper = Math.min(stepper, 3)')
          v-card.unstyle.pa-2.mb-5.output.eo-flex.a-stretch.wrap(
            elevation='4',
            tag='ul',
            key='schedule',
            v-if='schedule.length'
          )
            li.client-info.mb-3.full-width
              .eo-flex.a-end
                v-icon.mr-2 face
                span {{ firstName }} {{ lastName }}
              a.unstyle.eo-flex.a-end(v-if='phone', :href='"tel:" + phone')
                v-icon.mr-2 phone
                span {{ phone }}
              a.unstyle.eo-flex.a-end(:href='"mailto:" + email')
                v-icon.mr-2 email
                span {{ email }}
              v-divider.full-width.mt-1(v-if='schedule')
            li.availability(v-for='(item, i) in schedule', :key='item.day') {{ item.day }}
              ul.unstyle.pr-2
                li.flex.inline.mx-2(v-for='(time, j) in item.times') {{ time }}
          v-textarea(
            v-if='firstName.length >= 2',
            key='comments',
            outlined,
            v-model='comments',
            label='comments',
            required
          )
          .eo-flex.pt-2.two-cols.a-start
            v-btn.mr-2(outlined, color='warning', @click='stepper -= 1') Prev
            v-btn.mr-2.bold(outlined, color='error', @click='reset') Clear
            v-btn.mr-2.bold(
              :disabled='!canSubmit',
              outlined,
              color='success',
              @click='submitForm'
            ) Send
</template>

<script>
/* eslint-disable no-console */
import { getISODay, compareAsc, subDays, addDays, format } from 'date-fns'
import { emailRules, nameRules } from '~/assets/js/formRules'
import Scheduler from '~/components/Scheduler'
export default {
  components: { Scheduler },
  async asyncData({ params, payload }) {
    if (payload) {
      return payload
    } else {
      const obj = await require('~/assets/content/page2/scheduling.json')
      return obj
    }
  },
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
      statusMsg: null,
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
  mounted() {
    this.calendar = this.cal()
    if (localStorage.formInfo) {
      const { firstName, lastName, comments, phone, email } = JSON.parse(
        localStorage.formInfo
      )
      this.firstName = firstName
      this.lastName = lastName
      this.comments = comments
      this.phone = phone
      this.email = email
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
      const thisWeek = subDays(new Date(), isoToday - isoStart)
      const nextWeek = addDays(new Date(), 8 - isoToday)
      let startDay = thisWeek
      if (isoToday > isoStart && isoToday - isoStart > 2) {
        startDay = nextWeek // if today is after the start day
      }
      // if (isoToday <= isoStart && isoStart - isoToday > 2) {
      //   startDay = nextWeek // if today is before the start day
      // }
      const start = format(startDay, 'yyyy-MM-dd')
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
      this.$axios
        .$post('/dev/schedules', obj)
        .then((response) => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          this.statusMsg = `We successfully added ${this.firstName}'s schedule to the database.`
          setTimeout(() => {
            this.statusMsg = null
            this.reset()
          }, 7500)
        })
        .catch((err) => {
          console.log({ err })
          window.scrollTo({ top: 0, behavior: 'smooth' })
          this.errorMsg = `We were unable to add ${this.firstName}'s schedule to the database.\n${err.message}`
          setTimeout(() => {
            this.errorMsg = null
          }, 7500)
        })
    },
    reset() {
      this.$refs.scheduler.reset()
      this.stepper = 2
      this.comments = ''
    }
  }
}
</script>

<style scoped>
.client-info span {
  font-size: 1.8rem;
}
.availability {
  width: 50%;
}
</style>
