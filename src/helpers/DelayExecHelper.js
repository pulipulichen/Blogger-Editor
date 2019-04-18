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
    this.showIndicator()
    this.events[type] = event
    this.timers[type] = setTimeout(() => {
      this.events[type]()
      this.timers[type] = null
      
      if (this.isWaiting() === false) {
        this.hideIndicator()
      }
    }, delaySec * 1000)
  },
  forceExec: function () {
    for (let type in this.timers) {
      if (this.timers[type] !== null) {
        this.events[type]()
        clearTimeout(this.timers[type])
        this.timers[type] = null
      }
    }
  },
  clear: function () {
    for (let type in this.timers) {
      if (this.timers[type] !== null) {
        clearTimeout(this.timers[type])
        this.timers[type] = null
      }
    }
  },
  isWaiting: function (type) {
    if (type === undefined) {
      for (type in this.timers) {
        if (this.timers[type] !== null) {
          return true
        }
      }
      return false
    }
    else {
      return (this.timers[type] !== null)
    }
  },
  showIndicator: function () {
    if ($v.EditorManager.SaveIndicator !== null) {
      $v.EditorManager.SaveIndicator.open()
    }
  },
  hideIndicator: function () {
    if ($v.EditorManager.SaveIndicator !== null) {
      $v.EditorManager.SaveIndicator.close()
    }
  },
}