<template lang="pug">
    #work-week-grid.work-week.grid.eo-flex.col
        .eo-flex.flex-grow-1.rows.full-width(v-for="(row,i) in timeSlots" :key="i" :class="'row-' + (i + 1)")
            .flex-grow-1.cols(v-for="(item, j) in numOfDays" :key="item")
                .cal-cell.pa-5(:data-item="(j + 1)+(i*numOfDays)")     
</template>

<script>
import {
  //   getISODay,
  getTime,
  //   addMinutes,
  //   parseISO,
  //   subDays,
  addDays,
  format
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
      selected: null,
      ds: null,
      slotMins: 15, // how many minutes each slot should contain
      today: format(new Date(), 'yyyy-MM-dd')
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
  mounted() {
    /* eslint-disable no-undef */
    this.ds = new DragSelect({
      selectables: document.querySelectorAll('.cal-cell'),
      multiSelectKeys: 'shiftKey',
      callback: (e) => {
        console.log(e)
        this.selected = e.map((x) => Number(x.dataset.item))
      }
    })
  },
  methods: {
    getClasses(item, selectedItems) {
      this.selected = selectedItems.map((it) => it.dataset.item)
      const isActive = !!selectedItems.find((selectedItem) => {
        return parseInt(selectedItem.dataset.item, 10) === item
      })
      return {
        item: true,
        active: isActive
      }
    }
  }
}
</script>

<style lang="scss">
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
</style>
