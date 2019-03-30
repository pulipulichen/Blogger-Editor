FieldPostTitle = {
  ui: null,
  get: function () {
    if (this.ui === null) {
      this.ui = $('#summernotePostTitle')
    }
    return this.ui
  },
}