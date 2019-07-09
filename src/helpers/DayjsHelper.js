import dayjs from 'dayjs'
//const dayjs = require('dayjs')

let DayjsHelper = {
  nowFormat: function (format) {
    if (format === undefined) {
      format = 'YYYY-MMDD-hhmmss'
    }
    return dayjs(new Date()).format(format)
  },
  nowMMDDFormat: function (format) {
    if (format === undefined) {
      format = 'MMDD-hhmmss'
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
    let min = Math.round(seconds / 60)
    let hour = 0
    if (min >= 60) {
      hour = Math.round(min / 60)
      min = min % 60
    }
    
    //alert([hour, min])
    let display = min
    if (min < 10) {
      display = '0' + min 
    }
    display = hour + ':' + display
    return display
  }
}

window.DayjsHelper = DayjsHelper
export default DayjsHelper
