let FieldPostDate = {
  ui: null,
  get: function () {
    if (this.ui === null 
            || this.ui.length === 0) {
      this.ui = $('#summernotePostDate')
    }
    return this.ui
  },
  set: function (text) {
    if (typeof(text) === 'number') {
      text = DayjsHelper.postDate(text)
    }
    
    this.get().html(text)
    return this
  },
  reset: function () {
    this.ui = null
  }
}

export default FieldPostDate