let DelayExecHelper = {
  timers: {},
  limitTimers: {},
  events: {},
  forceWaiting: [],
  exec: function (type, delaySec, maxLimitSec, event) {
    //console.log('delay')
    return this.foreExec(type, delaySec, maxLimitSec, event)
  },
  foreExec: function (type, delaySec, maxLimitSec, event) {
    // 先確認現在的狀態是否ok
    if (InitHelper.ready === false) {
      return
    }
    
    //console.log(type, delaySec)
    this.showIndicator()
    
    this.backExec(type, delaySec, maxLimitSec, event)
  },
  backExec: function (type, delaySec, maxLimitSec, event) {
    // 先確認現在的狀態是否ok
    if (InitHelper.ready === false) {
      return
    }
    
    //delaySec = 0
    if (event === undefined && typeof(maxLimitSec) === 'function') {
      event = maxLimitSec
      maxLimitSec = undefined
    }
    
    if (typeof(event) !== 'function') {
      return
    }
    
    if (typeof(this.timers[type]) !== 'undefined' 
            && this.timers[type] !== null) {
      clearTimeout(this.timers[type])
    }
    this.events[type] = event
    
    this.timers[type] = setTimeout(() => {
      this.doEvent(type)
    }, delaySec * 1000)
    
    if (typeof(maxLimitSec) === 'number' && this.limitTimers[type] === null) {
      this.limitTimers[type] = setTimeout(() => {
        this.doEvent(type)
      }, maxLimitSec * 1000)
    }
  },
  doEvent: function (type) {
    this.events[type]()
    clearTimeout(this.timers[type])
    this.timers[type] = null
    clearTimeout(this.limitTimers[type])
    this.limitTimers[type] = null
    
    //console.log(type)

    if (this.isWaiting() === false) {
      this.hideIndicator()
    }
  },
  forceExec: function (callback) {
    for (let type in this.timers) {
      if (this.timers[type] !== null) {
        this.events[type]()
        clearTimeout(this.timers[type])
        this.timers[type] = null
      }
    }
    this.hideIndicator()
    
    
    if (typeof(callback) === 'function') {
      let wait = () => {
        setTimeout(() => {
          if (this.isWaiting()) {
            wait()
          }
          else {
            callback()
          }
        }, 1000)
      }
      wait()
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
    if (this.forceWaiting.length > 0) {
      return true
    }
    
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
  init: function () {
    window.addEventListener('blur', () => {
      this.forceExec()
    })
  },
  addForceWaiting: function (id) {
    if (this.forceWaiting.indexOf(id) === -1) {
      this.forceWaiting.push(id)
    }
    if (this.forceWaiting.length > 0) {
      this.showIndicator()
    }
    return this
  },
  removeForceWaiting: function (id) {
    if (this.forceWaiting.indexOf(id) > -1) {
      this.forceWaiting = this.forceWaiting.filter((i) => {return (i !== id)})
    }
    if (this.forceWaiting.length === 0) {
      this.hideIndicator()
    }
  }
}

window.DelayExecHelper = DelayExecHelper
export default DelayExecHelper