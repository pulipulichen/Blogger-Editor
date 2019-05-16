import SummerNoteConfig from './SummerNote/SummerNoteConfig.js'

let FieldPostTitle = {
  ui: null,
  debug: {
    disableSummerNode: false
  },
  init: function (callback) {
    this.debug.disableSummerNode = ConfigHelper.get('debug').disableSummerNode
    
    if (this.debug.disableSummerNode === true) {
      FunctionHelper.triggerCallback(callback)
      return this
    }
    
    this.get().summernote(SummerNoteConfig.airConfig('title', 'No Title', callback))
    // 'labels', 'Labels'
    return this
  },
  reload: function (callback) {
    this.ui = null
    this.get().summernote(SummerNoteConfig.airConfig('title', 'No Title', callback))
    return this
  },
  get: function () {
    if (this.ui === null
            || this.ui.length === 0) {
      this.ui = $('#summernotePostTitle')
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
    let postTitle = this.getText()
    $v.PostManager.updateEditingPost('title', postTitle, callback)
    return this
  },
  titleLengthLimit: 30,
  updateDocumentTitle: function (title) {
    if (typeof(title) !== 'string' || title.trim() === '') {
      document.title = 'Blogger Editor'
      return
    }
    if (title.length > this.titleLengthLimit) {
      if (title.indexOf('/') > -1) {
        title = title.slice(0, title.indexOf('/')).trim()
      }
      if (title.length > this.titleLengthLimit) {
        title = title.slice(0, this.titleLengthLimit).trim() + '...'
      }
    }
    document.title = title.trim()
  }
}

export default FieldPostTitle