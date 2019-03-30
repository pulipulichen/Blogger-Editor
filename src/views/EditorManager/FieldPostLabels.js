FieldPostLabels = {
  ui: null,
  get: function () {
    if (this.ui === null) {
      this.ui = $('#summernotePostLabels')
    }
    return this.ui
  },
  getElement: function () {
    return this.get().next().find('.note-editing-area .note-editable')
  },
  getText: function () {
    return this.getElement().text()
  },
  init: function () {
    this.get().summernote(SummerNoteConfig.airConfig('labels', 'Labels'))
    // 'labels', 'Labels'
    return this
  },
  set: function (value) {
    this.get().summernote('code', value);
    return this
  }
}