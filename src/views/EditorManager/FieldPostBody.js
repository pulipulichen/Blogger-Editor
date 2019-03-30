FieldPostBody = {
  ui: null,
  get: function () {
    if (this.ui === null) {
      this.ui = $('#summernotePostBody')
    }
    return this.ui
  },
  getText: function () {
    return this.get().summernote('code');
  },
  getSelectTarget: function () {
    return this.get().summernote('restoreTarget')
  },
  getElement: function () {
    return this.get().next().find('.note-editing-area .note-editable')
  }
}