FieldPostTitle = {
  ui: null,
  get: function () {
    if (this.ui === null) {
      this.ui = $('#summernotePostTitle')
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
    this.get().summernote(SummerNoteConfig.airConfig('title', 'Post Title'))
    // 'labels', 'Labels'
    return this
  },
  set: function (value) {
    this.get().summernote('code', value);
    return this
  }
}