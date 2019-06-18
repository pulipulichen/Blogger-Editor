import dayjs from 'dayjs'
//const dayjs = require('dayjs')

DayjsHelper = {
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
  }
}

export default DayjsHelper