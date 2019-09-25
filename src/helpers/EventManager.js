let EventManager = {
  key: '_events',
  defaultEventType: '_default',
  init: function (obj) {
    if (typeof(obj) !== 'object') {
      throw 'EventManager\'s first argument should be an object.'
    }
    
    if (typeof(obj[this.key]) !== 'object') {
      obj[this.key] = {}
    }
    return obj
  },
  on: function (obj, eventType, event) {
    if (Array.isArray(eventType)) {
      eventType.forEach(et => {
        this.on(obj, et, event)
      })
      return this
    }
    
    this.init(obj)
    
    if (typeof(eventType) !== 'string') {
      eventType = this.defaultEventType
    }
    
    if (Array.isArray(obj[this.key][eventType]) === false) {
      obj[this.key][eventType] = []
    }
    
    obj[this.key][eventType].push(event)
    return obj
  },
  listen: function (obj, eventType, event) {
    return this.on(obj, eventType, event)
  },
  trigger: function (obj, eventType) {
    if (Array.isArray(eventType)) {
      eventType.forEach(et => {
        this.trigger(obj, et)
      })
      return this
    }
    
    this.init(obj)
    
    if (typeof(eventType) !== 'string') {
      eventType = this.defaultEventType
    }
    
    if (Array.isArray(obj[this.key][eventType]) === false) {
      obj[this.key][eventType] = []
    }
    
    obj[this.key][eventType].forEach(event => {
      if (typeof(event) === 'function') {
        event(obj)
      }
    })
    
    //obj[this.key][eventType] = []
    
    return obj
  },
  call: function (obj, eventType) {
    return this.trigger(obj, eventType)
  },
  clear: function (obj, eventType) {
    this.init(obj)
    
    if (typeof(eventType) !== 'string') {
      eventType = this.defaultEventType
    }
    
    obj[this.key][eventType] = []
    return obj
  }
}

window.EventManager = EventManager
export default EventManager