<template lang="pug">
    #work-week-grid.work-week.grid.eo-flex.col
        .eo-flex.full-width.flex-grow-1.rows.legend.days
            .flex-grow.full-width
            .eo-flex.center.flex-grow.cols.center-text.full-width(v-for="(col,i) in numOfDays" :key="i") {{daysOfWeek[i]}}
        .draggable
            .eo-flex.flex-grow-1.rows.full-width(v-for="(row,i) in timeSlots" :key="i" :class="'row-' + (i + 1)")
                .eo-flex.a-end.j-end.flex-grow-1.cols.rel.legend.time
                    span {{getTime(getDate(0),i+1).end}}
                .flex-grow.cols(v-for="j in numOfDays" :key="j")
                    .cal-cell.pa-5.ma-1(:data-day="getDate(j)" :data-start="getTime(getDate(0),i+1).start" :data-end="getTime(getDate(0),i+1).end")
                        //small {{getTime(getDate(0),i+1).start}} to {{getTime(getDate(0),i+1).end}}
        pre {{selected}}                
</template>

<script>
import {
  getTime,
  addMinutes,
  parseISO,
  areIntervalsOverlapping,
  //   subDays,
  subMinutes,
  addDays,
  format,
  min,
  max
} from 'date-fns'
export default {
  components: {},
  props: {
    calStart: {
      type: String,
      default: format(new Date(), 'yyyy-MM-dd')
    },
    calEnd: {
      type: String,
      default: format(addDays(new Date(), 7), 'yyyy-MM-dd')
    },
    dayStart: {
      type: String,
      default: '07:00'
    },
    dayEnd: {
      type: String,
      default: '17:00'
    },
    days: {
      type: Number,
      default: 7
    }
  },
  data() {
    return {
      combined: null,
      selected: null,
      ds: null,
      slotMins: 60, // how many minutes each slot should contain
      today: format(new Date(), 'yyyy-MM-dd'),
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  },
  computed: {
    numOfDays() {
      return this.days
    },
    timeSlots(mins) {
      // this calculated how many rows each day will need
      const i = 60 / this.slotMins
      const hours =
        (getTime(new Date(this.today + 'T' + this.dayEnd)) -
          getTime(new Date(this.today + 'T' + this.dayStart))) /
        3600000
      return hours * i
    }
  },
  watch: {
    selected(newVal) {
      this.concatAppts(newVal)
    }
  },
  mounted() {
    /* eslint-disable no-undef */
    this.ds = new DragSelect({
      selectables: document.querySelectorAll('.cal-cell'),
      area: document.querySelector('.draggable'),
      //   multiSelectKeys: 'shiftKey',
      multiSelectMode: true,
      callback: this.getSelected
    })
  },
  methods: {
    getDate(isoDay) {
      return format(addDays(new Date(this.calStart), isoDay), 'yyyy-MM-dd')
    },
    getTime(date, n) {
      const end = addMinutes(
        parseISO(date + 'T' + this.dayStart),
        this.slotMins * n
      )
      const start = subMinutes(end, this.slotMins)
      // console.log(start, end)
      return { start: format(start, 'HH:mm'), end: format(end, 'HH:mm') }
    },
    getSelected(e) {
      const arr = e.map((x) => ({
        start: x.dataset.start,
        end: x.dataset.end,
        date: x.dataset.day
      }))
      this.selected = this.groupBy(arr, 'date')
    },
    isOverlapping(int1, int2) {
      // console.log(int1, int2, this.today + 'T' + int1.start)
      return areIntervalsOverlapping(
        {
          start: new Date(this.today + 'T' + int2.start),
          end: new Date(this.today + 'T' + int2.end)
        },
        {
          start: new Date(this.today + 'T' + int1.start),
          end: new Date(this.today + 'T' + int1.end)
        },
        { inclusive: true }
      )
    },
    groupBy(objectArray, property) {
      return objectArray.reduce(function(acc, obj) {
        const key = obj[property]
        if (!acc[key]) {
          acc[key] = []
        }
        delete obj[property]
        acc[key].push(obj)
        return acc
      }, {})
    },
    concatAppts(obj) {
      const dates = Object.keys(obj)
      dates.forEach(function(date) {
        const newArr = obj[date].reduce((intervalArray, currentInterval) => {
          let isSibling = false
          const mutatedArray = intervalArray.map((itemInterval) => {
            const itemStart = new Date(date + 'T' + itemInterval.start)
            const itemEnd = new Date(date + 'T' + itemInterval.end)
            const currStart = new Date(date + 'T' + currentInterval.start)
            const currEnd = new Date(date + 'T' + currentInterval.end)
            isSibling = areIntervalsOverlapping(
              {
                start: currStart,
                end: currEnd
              },
              {
                start: itemStart,
                end: itemEnd
              },
              { inclusive: true }
            )
            const times = [itemStart, itemEnd, currStart, currEnd]
            return isSibling
              ? {
                  start: format(min(times), 'HH:mm'),
                  end: format(max(times), 'HH:mm')
                }
              : itemInterval
          })
          if (isSibling) {
            // if current appt is next to another appt concat them
            return mutatedArray
          } else {
            // else push the appt seperately
            intervalArray.push(currentInterval)
            return intervalArray
          }
        }, [])
        obj[date] = newArr
      })
      return obj
    }
  }
}
</script>

<style lang="scss">
.legend {
  &.days {
    padding-right: 17px;
  }
  &.time {
    span {
      transform: translate(-10px, 50%);
    }
  }
}
.work-week.grid {
  // max-height: 500px;
  .draggable {
    overflow: auto;
  }
  .cols {
    // max-width: calc(100% / 8);
  }
  .cal-cell {
    position: relative;
    .theme--dark & {
      &::before {
        background: rgba(white, 1);
      }
    }
    .theme--light & {
      &::before {
        background: rgba(black, 0.87);
      }
    }
    &::before {
      position: absolute;
      left: 1px;
      top: 1px;
      bottom: 1px;
      right: 1px;
      width: 100%;
      height: 100%;
      content: '';
      opacity: 0.35;
    }

    &.ds-selected {
      border-color: red;
      &::before {
        opacity: 0.7;
      }
    }
    margin: 1px;
  }
}
</style>
