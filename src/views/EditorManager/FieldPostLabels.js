import SummerNoteConfig from './SummerNoteConfig.js'

let FieldPostLabels = {
  ui: null,
  get: function () {
    if (this.ui === null
            || this.ui.length === 0) {
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
  },
  save: function () {
    let postLabels = this.getText()
    $v.PostManager.updateEditingPost('labels', postLabels)
  }
}

export default FieldPostLabels