import SummerNoteConfig from './SummerNote/SummerNoteConfig.js'

let FieldPostLabels = {
  ui: null,
  uiNew: null,
  uiAdd: null,
  debug: {
    disableSummerNode: false
  },
  init: function (callback) {
    this.debug.disableSummerNode = ConfigHelper.get('debug').disableSummerNode
    
    if (ConfigHelper.get('debug').disableSummerNode === true) {
      FunctionHelper.triggerCallback(callback)
      return this
    }
    
    this.initSummerNote(callback)
    this.initAddButton()
    // 'labels', 'Labels'
    return this
  },
  reload: function (callback) {
    this.ui = null
    this.uiNew = null
    this.uiAdd = null
    this.initSummerNote(callback)
    this.initAddButton()
    return this
  },
  initSummerNote: function (callback) {
    this.get().summernote(SummerNoteConfig.postLabelsConfig('No Label', () => {
      this.uiNew.summernote(SummerNoteConfig.postLabelsConfig('Add a new label...', callback))
    }))
  },
  get: function () {
    if (this.ui === null
            || this.ui.length === 0) {
      this.ui = $('#summernotePostLabels')
    }
    if (this.uiNew === null
            || this.uiNew.length === 0) {
      this.uiNew = $('#summernotePostLabelsNew')
    }
    if (this.uiAdd === null
            || this.uiAdd.length === 0) {
      this.uiAdd = $('#summernotePostLabelsAdd')
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
  },
  initAddButton: function () {
    this.uiAdd.click(() => {
      let label = this.uiNew.summernote('text')
      
      if (label.trim() !== '') {
        let labels = this.ui.summernote('text')
        
        if (labels.trim() !== '') {
          labels = labels + ', ' + label
        }
        else {
          labels = label
        }
        
        this.ui.summernote('text', labels)
        this.uiNew.summernote('text', '')
      }
      
      
      //label = $(label).text().trim()
      
      //console.log(this.uiNew.summernote('insert', 'AAA'))
      //console.log(this.uiNew.summernote('text'))
      //console.log(this.uiNew.summernote('text', 'QQQ'))
      //let labels = this.ui.summernote('text')
      //this.ui.summernote('insertText', ', ' + label)
    })
  }
}

export default FieldPostLabels