export default function (app) {
  if (!app.computed) {
    app.computed = {}
  }

  app.computed.wordCountUnit = function () {
    if (this.wordCount > 1) {
      return this.$t('words')
    }
    else {
      return this.$t('word')
    }
  }
  app.computed.imageCountUnit = function () {
    if (this.imageCount > 1) {
      return this.$t('pictures')
    }
    else {
      return this.$t('picture')
    }
  }

  app.computed.tableCountUnit = function () {
    if (this.tableCount > 1) {
      return this.$t('tables')
    } else {
      return this.$t('table')
    }
  }

  app.computed.iframeCountUnit = function () {
    if (this.iframeCount > 1) {
      return this.$t('iframes')
    } else {
      return this.$t('iframe')
    }
  }
  app.computed.timeSpentDisplay = function () {
    return DayjsHelper.timeSpentDisplay(this.timeSpentSecond)
  }
  app.computed.titleWordCount = function () {
    return this.wordCount + ' ' + this.wordCountUnit
  }

  app.computed.titleImageCount = function () {
    return this.imageCount + ' ' + this.imageCountUnit
  }

  app.computed.titleTableCount = function () {
    return this.tableCount + ' ' + this.tableCountUnit
  }
  
  app.computed.titleIframeCount = function () {
    return this.iframeCount + ' ' + this.iframeCountUnit
  }
  
  app.computed.timeSpentTitle = function () {
    let display = DayjsHelper.timeSpentDisplay(this.timeSpentSecond).split(':')
    
    let hour = parseInt(display[0], 10)
    let minute = parseInt(display[1], 10)
    let data = {
      'hour': hour,
      'minute': minute
    }
    let totalMinutes = hour * 60 + minute
    let key = 'Total spent time is {hour} hours and {minute} minutes'
    if (hour === 0) {
      if (minute > 1) {
        key = 'Total spent time is {minute} minutes'
      }
      else {
        key = 'Total spent time is {minute} minute'
      }
    }
    else {
      if (hour > 1) {
        if (minute > 1) {
          key = 'Total spent time is {hour} hours and {minute} minutes'
        }
        else {
          key = 'Total spent time is {hour} hours and {minute} minute'
        }
      }
      else {
        if (minute > 1) {
          key = 'Total spent time is {hour} hour and {minute} minutes'
        }
        else {
          key = 'Total spent time is {hour} hour and {minute} minute'
        }
      }
    }
    return this.$tc(key, totalMinutes, data)
  }
}