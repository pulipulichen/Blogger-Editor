import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs-plugin-utc'
 
dayjs.extend(dayjsPluginUTC)
//const dayjs = require('dayjs')

let timezoneOffset = 480

let DayjsHelper = {
  nowFormat: function (format) {
    if (format === undefined) {
      format = 'YYYY-MMDD-HHmmss'
    }
    return dayjs(new Date()).utcOffset(timezoneOffset).format(format)
  },
  nowMMDDFormat: function (format) {
    if (format === undefined) {
      format = 'MMDD-HHmmss'
    }
    return dayjs(new Date()).utcOffset(timezoneOffset).format(format)
  },
  nowMMDDHHmmFormat: function (format) {
    if (format === undefined) {
      format = 'MMDD-HHmm'
    }
    return dayjs(new Date()).utcOffset(timezoneOffset).format(format)
  },
  nowHHMMSSFormat: function (format) {
    if (format === undefined) {
      format = 'HHmmss'
    }
    return dayjs(new Date()).utcOffset(timezoneOffset).format(format)
  },
  unix: function () {
    return dayjs(new Date()).utcOffset(timezoneOffset).unix()
  },
  postDate: function (unix) {
    if (unix === undefined) {
      unix = new Date()
    }
    else {
      unix = unix * 1000
    }
    
    return dayjs(unix).utcOffset(timezoneOffset).format('MM/DD HH:mm')
  },
  format: function (unix, format) {
    if (typeof(unix) === 'string') {
      format = unix
      unix = new Date()
    }
    else {
      unix = unix * 1000
    }
    return dayjs(unix).utcOffset(timezoneOffset).format(format)
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
