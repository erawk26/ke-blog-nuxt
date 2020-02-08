<template lang="pug">
  article.scheduling()
    h1.uc {{title}}
    div(v-html="$md.render(body)")
    v-form(ref='availability' netlify)
      transition-group(name="accordion-fade")
        //- v-calendar(ref="calendar" :now="today" :min="today" :max="tenDays" v-show="datesArr.length" :value="today" key="calendar" :events="datesArr" color="primary" type="month")
        .eo-flex.center(v-if="!loading" key="clientInfo")
          v-text-field(outlined v-model="firstName" label="First Name")
          v-text-field(outlined v-model="lastName" label="Last Name")
        v-menu(v-model='datepickerIsOpen' key="datepicker" v-if="!loading" :close-on-content-click='true' transition='scale-transition' offset-y min-width='290px')
          template(v-slot:activator='{ on }')
            v-text-field(outlined v-model='apptDay' label='Day of Availability' append-icon='event' readonly v-on='on')
          v-date-picker(v-model='apptDay' :min="today" :max="tenDays" @input='dateAdded')
        .eo-flex.center(v-if="apptDay" key="timepicker")
          v-menu(ref='startMenu' v-model='startMenu' :close-on-content-click='false' :nudge-right='40' :return-value.sync='apptStart' transition='scale-transition' offset-y='' max-width='290px' min-width='290px')
            template(v-slot:activator='{ on }')
              v-text-field(v-model='apptStart' label='Start of Availability' prepend-icon='access_time' readonly='' v-on='on')
            v-time-picker(v-if='startMenu' v-model="apptStart" :max="apptEnd" full-width='' @click:minute='checkAppt("start")' ampm-in-title format="24hr" :allowed-hours="allowedHours" :allowed-minutes="allowedMinutes")
          v-menu(ref='endMenu' v-model='endMenu' :close-on-content-click='false' :nudge-right='40' :return-value.sync='apptEnd' transition='scale-transition' offset-y='' max-width='290px' min-width='290px')
            template(v-slot:activator='{ on }')
              v-text-field(v-model='apptEnd' label='End of Availability' prepend-icon='access_time' readonly='' v-on='on')
            v-time-picker(v-if='endMenu' v-model="apptEnd" :min="apptStart" full-width='' @click:minute='checkAppt("end")' ampm-in-title format="24hr" :allowed-hours="allowedHours" :allowed-minutes="allowedMinutes")
        v-combobox(outlined deletable-chips v-model="datesArr" key="schedulepicker" v-if="datesArr.length" :items="datesArr" item-text="name" label="Your Times" multiple chips)
        v-textarea(v-if="firstName.length>=2" key="comments" outlined v-model='comments' label="body" required)
        .eo-flex.center(v-if="canSubmit" key="formBtns")
          v-btn.mr-4.bold(outlined color='success' @click='submitForm')
            | Send
          v-btn.mr-4.bold(outlined color='error' @click='reset')
            | Clear
        .warning(v-if="!canSubmit" key="warning")
          template(v-if="firstName.length<2") Please fill out your Name
          template(v-if="datesArr.length===0") Please add your availability in the form

</template>

<script>
import { formatDistance, parseISO, addDays, format } from 'date-fns'

export default {
  components: {},
  data() {
    return {
      firstName: '',
      lastName: '',
      loading: true,
      datepickerIsOpen: false,
      startMenu: false,
      endMenu: false,
      allowedHours: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      allowedMinutes: [0, 15, 30, 45],
      apptDay: null,
      apptStart: null,
      apptEnd: null,
      dates: '',
      datesArr: [],
      comments: '',
      events: [
        {
          name: 'Weekly Meeting',
          start: '2019-01-07 09:00',
          end: '2019-01-07 10:00'
        },
        {
          name: "Thomas' Birthday",
          start: '2019-01-10'
        },
        {
          name: 'Mash Potatoes',
          start: '2019-01-09 12:30',
          end: '2019-01-09 15:30'
        }
      ]
    }
  },
  computed: {
    today: () => format(new Date(), 'yyyy-MM-dd'),
    tenDays: () => format(addDays(new Date(), 10), 'yyyy-MM-dd'),
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
    this.$refs.calendar.scrollToTime('08:00')
    if (localStorage.formInfo) {
      const formData = JSON.parse(localStorage.formInfo)
      this.firstName = formData.firstName
      this.lastName = formData.lastName
      // TODO try to convert users past dates to this current week
      // this.datesArr = formData.datesArr
    }
    setTimeout(() => {
      this.loading = false
    }, 2000)
  },
  methods: {
    checkAppt(evt) {
      const D = this.apptDay
      const tS = this.apptStart
      const tE = this.apptEnd
      const start = parseISO(D + 'T' + tS)
      const end = parseISO(D + 'T' + tE)
      this.$refs.startMenu.save(tS)
      this.$refs.endMenu.save(tE)
      if (D && tS && tE) {
        this.datesArr.push({
          name: `${format(start, 'ccc')}: ${formatDistance(
            new Date(start),
            new Date(end)
          )}`,
          start: D + ' ' + tS,
          end: D + ' ' + tE
        })
        setTimeout(() => {
          this.$refs.startMenu.save('')
          this.$refs.endMenu.save('')
          this.apptDay = null
          this.apptStart = ''
          this.apptEnd = ''
        }, 1000)
      }
    },
    dateAdded(newVal) {
      // this.datesArr.push(newVal)

      // eslint-disable-next-line no-console
      console.log(newVal)
    },
    submitForm() {
      const obj = {
        firstName: this.firstName,
        lastName: this.lastName,
        datesArr: this.datesArr
      }
      localStorage.setItem('formInfo', JSON.stringify(obj))
    },
    reset() {}
  }
}
</script>

<style lang="scss" scoped></style>
