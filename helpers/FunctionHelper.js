FunctionHelper = {
  triggerCallback: function (callback, ...args) {
    if (typeof(callback) === 'function') {
      callback.apply(this, args)
    }
  }
}