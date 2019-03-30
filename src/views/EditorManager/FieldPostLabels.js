FieldPostLabels = {
  ui: null,
  get: function () {
    if (this.ui === null) {
      this.ui = $('#summernotePostLabels')
    }
    return this.ui
  },
}