/* global ConfigHelper, FunctionHelper, DelayExecHelper */

import SummerNoteConfig from './SummerNote/SummerNoteConfig.js'

let FieldPostLabels = {
  ui: null,
  uiNew: null,
  uiAdd: null,
  $t: null,
  debug: {
    disableSummerNode: false
  },
  init: function ($t, callback) {
    this.$t = $t
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
    let config = SummerNoteConfig.postLabelsConfig(this.$t('No Label'), () => {
      this.initSummerNoteNew(callback)
    })
    
    this.get().summernote(config)
  },
  initSummerNoteNew: function (callback) {
    let config = SummerNoteConfig.postLabelsConfig(this.$t('Add a new label...'), 
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
    let ui = this.get()
    if (this.debug.disableSummerNode === true) {
      ui.html(value)
      return this
    }
    ui.summernote('code', value)
    ui.summernote('editor.commit')
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
        return false
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
  },
  addSummernoteItem: function (item) {
    this.ui.summernote('hintPopover.addItem', item)
    this.uiNew.summernote('hintPopover.addItem', item)
  },
  onPostLabelsChange: function (contents) {
    let fieldName = 'labels'
    
    //console.log(contents)
    if (Array.isArray(contents)) {
      contents = contents.join(', ')
    }
    
    contents = contents.trim()
    while (contents.endsWith('&nbsp;')) {
      contents = contents.slice(0, -6).trim()
    }
    
    DelayExecHelper.exec(fieldName, 3, () => {
      $v.EditorManager.FieldPostDate.set()
      if (contents.startsWith('<') && contents.endsWith('>')) {
        contents = $(contents).text()
      }
      $v.PostManager.updateEditingPost(fieldName, contents)
    })
  },
  getLabelsHintConfig: function () {
    //let config = this.airConfig(fieldName, placeholder, callback)
    let words = $v.EditorManager.labelsList
    //let FieldPostLabels = this
    
    let hint = {
      words: words,
      //match: /\b(\S{1,})$/,
      match: /([\u4E00-\u9FAF\u3040-\u3096\u30A1-\u30FA\uFF66-\uFF9D\u31F0-\u31FFA-Za-z]{1,})$/,
      search: function (keyword, callback) {
        //console.log(['search', keyword])
        callback($.grep(this.words, (item) => {
          return item.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
        }));
      },
      content: (item) => {
        //return '<span>' + item + ', </span>';
        //return item + ', '
        //console.log(item)
        //let labels = fieldPostLabels.summernote('text')
        //console.log(labels)
        //if (labels)
        setTimeout(() => {
          this.addLabel(item)
        }, 0)
        return ''
      }
    }
    
    return hint
  }
}

export default FieldPostLabels