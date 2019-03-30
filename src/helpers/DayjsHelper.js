//import dayjs from 'dayjs'
const dayjs = require('dayjs')

DayjsHelper = {
  nowFormat: function () {
    return dayjs(new Date()).format('YYYY-MMDD-hhmmss')
  },
  unix: function () {
    return dayjs(new Date()).unix()
  },
  postDate: function (unix) {
    return dayjs(unix * 1000).format('MM/DD hh:mm')
  }
}