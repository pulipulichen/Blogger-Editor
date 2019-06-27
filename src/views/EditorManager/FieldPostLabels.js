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
    let config = SummerNoteConfig.postLabelsConfig('No Label', () => {
      this.initSummerNoteNew(callback)
    })
    
    this.get().summernote(config)
  },
  initSummerNoteNew: function (callback) {
    let config = SummerNoteConfig.postLabelsConfig('Add a new label...', 
      callback, 
      (e) => {
        //console.log(this.uiNew.summernote('text'))
        if (this.uiNew.summernote('text').trim() !== '') {
          this.uiAdd.show()
        }
        else {
          this.uiAdd.hide()
        }
    })
            
    this.uiNew.summernote(config)
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
    let text = this.getElement().text()
    if (text.indexOf(',  ') > -1) {
      text = text.split(',  ').join(', ')
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
        //let labels = this.ui.summernote('text')
        
        this.addLabel(label)
        
        this.uiNew.summernote('text', '')
        $v.EditorManager.addLabel(label)
      }
    })
  },
  addLabel: function (label) {
    
    if (label.trim() !== '') {
      let labels = this.ui.summernote('text')

      let labelsList = labels.trim().split(',')
      let doAdd = true
      for (let i = 0; i < labelsList.length; i++) {
        if (labelsList[i].trim() === label) {
          doAdd = false
          break
        }
      }
      
      if (doAdd === false) {
        return
      }

      if (labels.trim() !== '') {
        if (!labels.trim().endsWith(',')) {
          labels = labels + ', '
        }
        labels = labels + label + ','
      }
      else {
        labels = label + ','
      }
      //console.log(`[${labels}]`)
      this.ui.summernote('text', labels)
      this.ui.summernote('focus')
      this.ui.summernote('moveCursor')
      this.ui.summernote('insertText', ' ')
    }
  }
}

export default FieldPostLabels