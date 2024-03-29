<template lang="pug">
#work-week-grid.work-week.grid.eo-flex.col
  .eo-flex.full-width.flex-grow-1.rows.legend.days
    .eo-flex.a-end.j-end.flex-grow-0.cols.rel.legend.time
    .eo-flex.center.flex-grow.cols.center-text.full-width(
      v-for='(col, i) in numOfDays',
      :title='getDate(i + 1)',
      :key='col'
    )
      button.full-width(@click='toggleDay(getDate(i + 1))') {{ daysOfWeek[(isoStart + i - 1) % 7] }}
  .draggable.pb-2
    .eo-flex.flex-grow-1.rows.full-width(
      v-for='(row, i) in timeSlots',
      :key='i',
      :class='"row-" + (i + 1)'
    )
      .eo-flex.a-end.j-end.flex-grow-0.cols.rel.legend.time
        small {{ getTime(getDate(0), i + 1, 12).end }}
      .flex-grow.cols(v-for='(j, ind) in numOfDays', :key='j')
        .cal-cell(
          :data-valid-time='slotValid(getDate(j), getTime(getDate(0), i + 1).start)',
          :data-day='getDate(ind + 1)',
          :class='{ valid: slotValid(getDate(j), getTime(getDate(0), i + 1).start) }',
          :data-start='getTime(getDate(0), i + 1).start',
          :data-end='getTime(getDate(0), i + 1).end'
        )
</template>

<script>
import {
  getTime,
  addMinutes,
  parseISO,
  areIntervalsOverlapping,
  compareAsc,
  subMinutes,
  addDays,
  format,
  min,
  max,
} from 'date-fns'
export default {
  name: 'Scheduler',
  components: {},
  props: {
    calStart: {
      type: String,
      default: format(new Date(), 'yyyy-MM-dd'),
    },
    calEnd: {
      type: String,
      default: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    },
    dayStart: {
      type: String,
      default: '07:00',
    },
    dayEnd: {
      type: String,
      default: '17:00',
    },
    days: {
      type: Number,
      default: 7,
    },
    isoStart: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      selected: null,
      ds: null,
      slotMins: 30, // how many minutes each slot should contain
      today: format(new Date(), 'yyyy-MM-dd'),
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
    },
  },
  mounted() {
    /* eslint-disable no-undef */
    setTimeout(() => {
      this.ds = new DragSelect({
        selectables: document.querySelectorAll('[data-valid-time="true"]'),
        area: document.querySelector('.draggable'),
        //   multiSelectKeys: 'shiftKey',
        multiSelectMode: true,
      })
      this.ds.subscribe('callback', ({items})=>this.getSelected(items))
    }, 500)
  },
  methods: {
    reset() {
      this.ds.clearSelection()
      this.selected = []
      this.$emit('change', [])
    },
    getDate(isoDay) {
      return format(addDays(new Date(this.calStart), isoDay), 'yyyy-MM-dd')
    },
    getTime(date, n, hours = 24) {
      hours = hours === 24 ? 'HH:mm' : 'h:mm'
      const end = addMinutes(
        parseISO(date + 'T' + this.dayStart),
        this.slotMins * n
      )
      const start = subMinutes(end, this.slotMins)
      return {
        start: format(start, hours),
        end: format(end, hours),
      }
    },
    formatTime(time, timeFormat) {
      return format(new Date(this.today + 'T' + time), timeFormat)
    },
    slotValid(date, time) {
      const slotDate = new Date(date + 'T' + time)
      const dateNow = new Date()
      return compareAsc(slotDate, dateNow) > 0
    },
    setSelected(e) {
      const nodes = []
      e.forEach((d) => {
        const date = Object.keys(d)[0]
        const times = d[date]
        times.forEach((time) => {
          const sel = `.valid[data-day="${date}"][data-start="${time.start}"]`
          // if (sel) {
          nodes.push(sel)
          // }
        })
      })
      this.ds.addSelection(document.querySelectorAll(nodes.join(',')))
      this.getSelected(this.ds.getSelection())
    },
    getSelected(e) {
      const arr = e.map((x) => ({
        start: x.dataset.start,
        end: x.dataset.end,
        date: x.dataset.day,
      }))
      const that = this
      const data = this.groupBy(arr, 'date')
      this.selected = this.dateSort(
        Object.keys(data).map((key) => ({
          [key]: that.timeSort(data[key], that.today),
        }))
      )
      this.$emit('change', this.selected)
    },
    toggleDay(day) {
      const selection = this.ds.getSelection()
      const hasDay = selection.map((x) => x.dataset.day).includes(day)
      if (hasDay) {
        const nodes = selection.filter((x) => x.dataset.day === day)
        this.ds.removeSelection(nodes)
      } else {
        const nodes = document.querySelectorAll(`.valid[data-day="${day}"]`)
        this.ds.addSelection(nodes)
      }
      this.getSelected(this.ds.getSelection())
    },
    isOverlapping(int1, int2) {
      return areIntervalsOverlapping(
        {
          start: new Date(this.today + 'T' + int2.start),
          end: new Date(this.today + 'T' + int2.end),
        },
        {
          start: new Date(this.today + 'T' + int1.start),
          end: new Date(this.today + 'T' + int1.end),
        },
        { inclusive: true }
      )
    },
    dateSort: (arr) =>
      arr.sort(function (a, b) {
        return compareAsc(
          new Date(Object.keys(a)[0] + 'T00:00'),
          new Date(Object.keys(b)[0] + 'T00:00')
        )
      }),
    timeSort: (arr, date) =>
      arr.sort(function (a, b) {
        return compareAsc(
          new Date(date + 'T' + a.start),
          new Date(date + 'T' + b.start)
        )
      }),
    groupBy(objectArray, property) {
      const newObj = objectArray.reduce(function (acc, obj) {
        const key = obj[property]
        if (!acc[key]) {
          acc[key] = []
        }
        delete obj[property]
        acc[key].push(obj)
        return acc
      }, {})
      return newObj
    },
    concatTime(arr) {
      const that = this
      const newArr = arr.reduce((intervalArray, currentInterval) => {
        let isSibling = false
        const combinedIntervals = intervalArray.map((itemInterval) => {
          const itemStart = new Date(that.today + 'T' + itemInterval.start)
          const itemEnd = new Date(that.today + 'T' + itemInterval.end)
          const currStart = new Date(that.today + 'T' + currentInterval.start)
          const currEnd = new Date(that.today + 'T' + currentInterval.end)
          isSibling = areIntervalsOverlapping(
            {
              start: currStart,
              end: currEnd,
            },
            {
              start: itemStart,
              end: itemEnd,
            },
            { inclusive: true }
          )
          const times = [itemStart, itemEnd, currStart, currEnd]
          return isSibling
            ? {
                start: format(min(times), 'HH:mm'),
                end: format(max(times), 'HH:mm'),
              }
            : itemInterval
        })
        if (isSibling) {
          // if current interval is next to another interval combine them
          return combinedIntervals
        } else {
          // else push the interval seperately
          intervalArray.push(currentInterval)
          return intervalArray
        }
      }, [])
      return newArr
    },
  },
}
</script>

<style lang="scss">
.legend {
  &.days {
    padding-right: 0;
  }
  &.time {
    span,
    small {
      transform: translate(-10px, 50%);
    }
  }
}
.work-week.grid {
  // max-height: 500px;
  .draggable {
    overflow: auto;
  }
  .rows {
    margin: 2px 0;
    height: 20px;
  }
  .cols {
    &.legend.time {
      width: 60px;
      max-width: 60px;
      min-width: 60px;
    }
    // max-width: calc(100% / 8);
  }
  .cal-cell {
    margin: 0 2px;
    height: 100%;
    position: relative;
    .theme--dark & {
      &::before {
        background: rgba(white, 1);
      }
      &.valid::before {
        background: rgba($quadrary, 1);
      }
    }
    .theme--light & {
      &::before {
        background: rgba(0, 0, 0, 0.87);
      }
      &.ds-selected {
      }
      &.valid::before {
        background: rgba($quadrary, 0.87);
      }
    }
    &::before {
      position: absolute;
      left: 0px;
      top: 0px;
      bottom: 0px;
      right: 0px;
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
  }
}
</style>
