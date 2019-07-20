import SummerNoteConfig from './SummerNote/SummerNoteConfig.js'

let FieldPostTitle = {
  ui: null,
  $t: null,
  debug: {
    disableSummerNode: false
  },
  init: function ($t, callback) {
    this.$t = $t
    this.debug.disableSummerNode = ConfigHelper.get('debug').disableSummerNode
    
    if (this.debug.disableSummerNode === true) {
      FunctionHelper.triggerCallback(callback)
      return this
    }
    
    this.get().summernote(SummerNoteConfig.postTitleConfig(this.$t('No Title'), callback))
    // 'labels', 'Labels'
    
    return this
  },
  reload: function (callback) {
    this.ui = null
    this.get().summernote(SummerNoteConfig.postTitleConfig('No Title', callback))
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
    let text = this.getElement().text().trim()
    while (text.endsWith('&nbsp;')) {
      text = text.slice(0, -6)
    }
    
    if (typeof(text) === 'string') {
      text = $(`<span>${text}</span>`).text().trim()
    }
    return text
  },
  set: function (value) {
    if (this.debug.disableSummerNode === true) {
      this.get().html(value)
      return this
    }
    
    this.get().summernote('code', value)
    this.get().summernote('editor.commit')
    this.updateDocumentTitle()
    return this
  },
  save: function (callback) {
    let postTitle = this.getText()
    $v.PostManager.updateEditingPost('title', postTitle, callback)
    return this
  },
  titleLengthLimit: 30,
  updateDocumentTitle: function (title) {
    if (title === undefined) {
      title = this.getText()
    }
    
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
  },
  onPostTitleChange: function (contents) {
    let fieldName = 'title'
    
    contents = this.getText()
    while (contents.endsWith('&nbsp;')) {
      contents = contents.slice(0, -6).trim()
    }
    
    DelayExecHelper.exec(fieldName, 3, () => {
      $v.EditorManager.FieldPostDate.set()
      if (contents.startsWith('<') && contents.endsWith('>')) {
        contents = $(contents).text()
      }
      
      contents = contents + ' - ' + this.$t('Blogger Editor')
      this.updateDocumentTitle(contents)
      $v.PostManager.updateEditingPost(fieldName, contents)
    })
    //console.log(fieldName + ':', contents)
  },
}

export default FieldPostTitle