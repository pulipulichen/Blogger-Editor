import dayjs from 'dayjs'
//const dayjs = require('dayjs')

let DayjsHelper = {
  nowFormat: function (format) {
    if (format === undefined) {
      format = 'YYYY-MMDD-hhmmss'
    }
    return dayjs(new Date()).format(format)
  },
  unix: function () {
    return dayjs(new Date()).unix()
  },
  postDate: function (unix) {
    if (unix === undefined) {
      unix = new Date()
    }
    else {
      unix = unix * 1000
    }
    
    return dayjs(unix).format('MM/DD hh:mm')
  },
  timeSpentDisplay: function (seconds) {
    let min = Math.ceil(seconds / 60)
    let hour = 0
    if (min >= 60) {
      hour = Math.ceil(min / 60)
      min = min % 60
    }
    
    let display = min
    if (hour > 0) {
      display = hour + ':' + min
    }
    return display
  }
}

window.DayjsHelper = DayjsHelper
export default DayjsHelper
