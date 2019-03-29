DelayExecHelper = {
  timers: {},
  events: {},
  exec: function (type, delaySec, event) {
    //delaySec = 0
    if (typeof(event) !== 'function') {
      return
    }
    
    if (typeof(this.timers[type]) !== 'undefined' 
            && this.timers[type] !== null) {
      clearTimeout(this.timers[type])
    }
    //console.log(type, delaySec)
    this.events[type] = event
    this.timers[type] = setTimeout(() => {
      this.events[type]()
      this.timers[type] = null
    }, delaySec * 1000)
  },
  forceExec: function () {
    for (type in this.timers) {
      if (this.timers[type] !== null) {
        this.events[type]()
        clearTimeout(this.timers[type])
      }
    }
  }
}