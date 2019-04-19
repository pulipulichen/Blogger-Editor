import SummerNoteConfig from './SummerNoteConfig.js'

let FieldPostLabels = {
  ui: null,
  debug: {
    disableSummerNode: false
  },
  init: function (callback) {
    this.debug.disableSummerNode = ConfigHelper.get('debug').disableSummerNode
    
    if (ConfigHelper.get('debug').disableSummerNode === true) {
      FunctionHelper.triggerCallback(callback)
      return this
    }
    
    this.get().summernote(SummerNoteConfig.airConfig('labels', 'No Label', callback))
    // 'labels', 'Labels'
    return this
  },
  reload: function (callback) {
    this.ui = null
    this.get().summernote(SummerNoteConfig.labelsAirConfig('labels', 'No Label', callback))
    return this
  },
  get: function () {
    if (this.ui === null
            || this.ui.length === 0) {
      this.ui = $('#summernotePostLabels')
    }
    return this.ui
  },
  getElement: function () {
    if (this.debug.disableSummerNode === true) {
      return this.get()
    }
    
    return this.get().next().find('.note-editing-area .note-editable')
  },
  getText: function () {
    return this.getElement().text()
  },
  set: function (value) {
    if (this.debug.disableSummerNode === true) {
      this.get().html(value)
      return this
    }
    
    this.get().summernote('code', value)
    this.get().summernote('editor.commit')
    return this
  },
  save: function (callback) {
    let postLabels = this.getText()
    $v.PostManager.updateEditingPost('labels', postLabels, callback)
  }
}

export default FieldPostLabels