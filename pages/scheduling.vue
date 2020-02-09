<template lang="pug">
  article.page.scheduling()
    section.body.pa-5.max-pg-width
      h1.uc {{title}}
      div(v-html="$md.render(body)")
      v-form(ref='availability')
        transition-group(name="accordion-fade")
          //- v-calendar(ref="calendar" :now="today" :min="today" :max="tenDays" v-show="datesArr.length" :value="today" key="calendar" :events="datesArr" color="primary" type="month")
          .eo-flex.center(v-if="!loading" key="clientName")
            v-text-field.mr-3(outlined v-model="firstName" label="First Name" required :rules='nameRules')
            v-text-field.ml-3(outlined v-model="lastName" label="Last Name" required :rules='nameRules')
          .eo-flex.center(v-if="!loading" key="clientContact")
            v-text-field.mr-3(outlined v-model="email" label="Email" required :rules='emailRules')
            v-text-field.ml-3(outlined v-model="phone" label="Phone" required)
          v-menu(v-model='datepickerIsOpen' key="datepicker" v-if="!loading" :close-on-content-click='true' transition='scale-transition' offset-y min-width='290px')
            template(v-slot:activator='{ on }')
              v-text-field(outlined v-model='apptDay' label='Day of Availability' append-icon='event' readonly v-on='on')
            v-date-picker(v-model='apptDay' :min="calStart" :max="scheduleLength" @input='dateAdded')
          .eo-flex.center(v-if="apptDay" key="timepicker")
            v-menu(ref='startMenu' v-model='startMenu' :close-on-content-click='false' :nudge-right='40' :return-value.sync='apptStart' transition='scale-transition' offset-y='' max-width='290px' min-width='290px')
              template(v-slot:activator='{ on }')
                v-text-field.mr-3(v-model='apptStart' label='Start of Availability' append-icon='access_time' readonly='' v-on='on' outlined)
              v-time-picker(v-if='startMenu' v-model="apptStart" :max="apptEnd" full-width='' @click:minute='checkAppt("start")' ampm-in-title format="24hr" :allowed-hours="allowedHours" :allowed-minutes="allowedMinutes")
            v-menu(ref='endMenu' v-model='endMenu' :close-on-content-click='false' :nudge-right='40' :return-value.sync='apptEnd' transition='scale-transition' offset-y='' max-width='290px' min-width='290px')
              template(v-slot:activator='{ on }')
                v-text-field.ml-3(required v-model='apptEnd' label='End of Availability' append-icon='access_time' readonly='' v-on='on' outlined)
              v-time-picker(v-if='endMenu' v-model="apptEnd" :min="apptStart" full-width='' @click:minute='checkAppt("end")' ampm-in-title format="24hr" :allowed-hours="allowedHours" :allowed-minutes="allowedMinutes")
          v-combobox(outlined deletable-chips v-model="datesArr" key="schedulepicker" v-if="datesArr.length" :items="datesArr" item-text="name" label="Your Availabilty" multiple chips)
          v-textarea(v-if="firstName.length>=2" key="comments" outlined v-model='comments' label="comments" required)
          .eo-flex.center(v-if="canSubmit" key="formBtns")
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
import {
  getISODay,
  formatDistance,
  parseISO,
  subDays,
  addDays,
  format
} from 'date-fns'
import { emailRules, nameRules, dateRules } from '~/assets/js/formRules'
export default {
  components: {},
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      loading: true,
      datepickerIsOpen: false,
      startMenu: false,
      endMenu: false,
      allowedHours: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      allowedMinutes: [0, 15, 30, 45],
      apptDay: null,
      apptStart: null,
      apptEnd: null,
      today: format(new Date(), 'yyyy-MM-dd'),
      dates: '',
      datesArr: [],
      comments: '',
      errorMsg: null,
      emailRules,
      nameRules,
      dateRules
    }
  },
  computed: {
    calStart() {
      const today = getISODay(new Date())
      const startDay = this.startDay
      const diff = today <= startDay ? startDay - today : startDay + 7 - today
      return diff > 4 // if still in first half of week...
        ? format(subDays(new Date(), diff), 'yyyy-MM-dd') // ...keep using this week
        : format(addDays(new Date(), diff), 'yyyy-MM-dd') // ...else use next week
    },
    scheduleLength() {
      return format(
        addDays(new Date(this.calStart), this.numOfDays),
        'yyyy-MM-dd'
      )
    },
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
    // this.$refs.calendar.scrollToTime('08:00')
    if (localStorage.formInfo) {
      const formData = JSON.parse(localStorage.formInfo)
      this.firstName = formData.firstName
      this.lastName = formData.lastName
      this.comments = formData.comments
      this.phone = formData.phone
      this.email = formData.email
      this.datesArr = this.getNewDates(formData.datesArr)
    }
    this.loading = false
  },
  methods: {
    checkAppt() {
      const D = this.apptDay
      const tS = this.apptStart
      const tE = this.apptEnd
      this.$refs.startMenu.save(tS)
      this.$refs.endMenu.save(tE)
      if (D && tS && tE) {
        this.datesArr.push(this.dateObj(D, tS, tE))
        setTimeout(() => {
          this.$refs.startMenu.save('')
          this.$refs.endMenu.save('')
          this.apptDay = null
          this.apptStart = ''
          this.apptEnd = ''
        }, 1000)
      }
    },
    getNewDates(arr) {
      const startDay = getISODay(new Date(this.calStart + 'T00:00')) // get the day
      // iterate over array
      return arr.map((item) => {
        const diff =
          startDay === item.day
            ? 0
            : startDay < item.day
            ? item.day - startDay
            : 7 + item.day - startDay
        const newDay = format(
          addDays(new Date(this.calStart + 'T00:00'), diff),
          'yyyy-MM-dd'
        )
        const start = newDay + ' ' + item.start.split(' ')[1]
        const end = newDay + ' ' + item.end.split(' ')[1]
        return {
          name: item.name,
          day: item.day,
          start,
          end
        }
      })
    },
    dateObj(dateISO, timeStart, timeEnd) {
      const start = parseISO(dateISO + 'T' + timeStart)
      const end = parseISO(dateISO + 'T' + timeEnd)
      const obj = {
        day: getISODay(new Date(start)), // numeric day of the week 1-7
        doW: format(start, 'ccc'), // Abbreviated Day of Week for Label Use
        iso: format(start, 'P'), // Locale formatted iso for label
        t1: format(start, 'p'), // formatted only for name label // 'h:maaaaa'<-shorter abbbrev
        t2: format(end, 'p'), // formatted for the name label
        duration: formatDistance(new Date(start), new Date(end))
      }
      return {
        name: `${obj.doW} ${obj.iso}: ${obj.t1} - ${obj.t2} (${obj.duration})`,
        day: obj.day, // save the numeric day of week, so we can fill form if the user comes back another week
        start: dateISO + ' ' + timeStart, // formatted for calendar/datepicker input
        end: dateISO + ' ' + timeEnd // formatted for calendar/datepicker input
      }
    },
    dateAdded(newVal) {
      // console.log(newVal)
    },
    submitForm() {
      const obj = {
        firstName: this.firstName,
        lastName: this.lastName,
        datesArr: this.datesArr,
        comments: this.comments,
        email: this.email,
        phone: this.phone
      }
      localStorage.setItem('formInfo', JSON.stringify(obj))
    },
    reset() {
      this.datesArr = []
      this.comments = ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
