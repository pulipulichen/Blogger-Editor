import SummerNoteButtons from './SummerNoteButtons.js'
import SummerNoteCallbacks from './SummerNoteCallbacks.js'

let SummerNoteConfig = {
  toolbar: function (loadDefault) {
    if (loadDefault === undefined) {
      loadDefault = true
    }
    
    let config
    if (typeof($v.EditorManager.summerNoteConfigToolbar) === 'string') {
      config = $v.EditorManager.summerNoteConfigToolbar.trim()
    }
    
    if (config !== undefined 
            && config !== '') {
      try {
        //let config = JSON.parse($v.EditorManager.summerNoteConfigToolbar.trim())
        //config = $v.EditorManager.summerNoteConfigToolbar.trim()
        eval(`config = ${config}`)
        if (config.length > 0) {
          return config
        }
        else {
          return this.defaultToolbar(loadDefault)
        }
      }
      catch (e) {
        return this.defaultToolbar(loadDefault)
      } 
    }
    return this.defaultToolbar(loadDefault)
  },
  defaultToolbar: function (loadDefault) {
    if (loadDefault === false) {
      return []
    }
    
    let toolbar = [
        ['color', ['color']],
        //['formatBlockHeading1', ['formatH1']],
        ['formatBlockHeading2', ['formatH2', 'formatH3']],
        ['formatBlockHeading3', ['formatH4', 'formatH5']],
        ['formatBlock', ['formatPara', 'CodeInserter']],
        //['formatBlock', ['formatPara', 'formatCode']],
        ['style', ['style', ]],
        //['styleTags', ['styleP', 'styleH1', 'styleH2', 'styleH3', 'styleH4', 'styleH5', 'styleH6']],
        ['font', ['undo', 'bold', 'underline', 'clear']],
        //['fontname', ['fontname']],
        ['para', ['ul', 'ol', 'paragraph']],
        //['table', []],
        ['insert', ['hr', 'link', 'table']],
        ['insertMultimedia', [ 'picture', 'video']],
        // ['insertCode', ['SnippetInserter', 'IframePrompt', 'FileUploader', 'CodeInserter']],
        //['imageResize', ['imageSizeOriginal', 'imageSizeDefault']],
        //['publish', ['ImageReplacer', 'CleanCode', 'CopyHTML']],
        ['view', ['codeview']],
        ['help', [/*'fullscreen',*/ 'transSelected', 'OutlineNavigator', 'help', 'toggleMenu']]
      ]

    return toolbar
  },
  styleTags: function (loadDefault) {
    if (loadDefault === undefined) {
      loadDefault = true
    }
    
    if ($v.EditorManager.summerNoteConfigStyleTags.trim() !== '') {
      try {
        //let config = JSON.parse($v.EditorManager.summerNoteConfigStyleTags.trim())
        let config = $v.EditorManager.summerNoteConfigStyleTags.trim()
        eval(`config = ${config}`)
        if (config.length > 0) {
          return config
        }
        else {
          return this.defaultStyleTags(loadDefault)
        }
      }
      catch (e) {
        return this.defaultStyleTags(loadDefault)
      } 
    }
    return this.defaultStyleTags(loadDefault)
  },
  defaultStyleTags: function (loadDefault) {
    if (loadDefault === false) {
      return []
    }
    
    /*
    let styleTags = ['p', 'code', 'h4', 'h5', 'h6', {
        tag: 'sub',
        title: 'ttt',
        style: 'font-weight: bold;',
        className: 'ttt'
    }]
    */
  
    //let styleTags = ['p', 'blockquote', 'code', 'h2', 'h3', 'h4', 'h5', 'h6']
    let styleTags = [{
        tag: 'span',
        title: 'red color & underline',
        style: 'color: red; font-weight: bold; text-decoration: underline;'
      }, 
      { // 'italic', 
        tag: 'i',
        title: 'italic'
      },
      { // 'strikethrough', 
        tag: 'span',
        title: 'strikethrough',
        style: 'text-decoration: line-through;'
      },
      {
        tag: 'span',
        title: 'comment',
        className: 'note-editor-comment'
      },
      'blockquote', 'h1', 'h6']
    
    //let styleTags = [
    //  this.buildButtonCopyCode()
    //]

    return styleTags
  },
  popoverImage: function () {
    return [
      //['imagesize', ['copyHTML', 'imageSize100', 'imageSize50', 'imageSize25']],
      //['float', ['floatLeft', 'floatRight', 'floatNone']],
      ['imagesize', ['popoverImageSizeOriginal', 'popoverImageSizeDefault']],
      ['imagesLink', ['openMedia', 'saveMedia', 'copyMediaLink']],
      ['remove', ['removeMedia']]
    ]
  },
  popoverTable: function () {
    return [
      ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
      ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
    ]
  },
  popoverLink: function () {
    return [
      ['link', ['linkDialogShow', 'unlink', 'copyLink']],
      ['remove', ['removeLink']]
    ]
  },
  popoverAir: function () {
    /*
    return [
      ['color', ['color']],
      ['font', ['bold', 'underline', 'clear']],
      ['para', ['ul', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture']]
    ]
    */
    return []
  },
  loadLocale: function (callback) {
    let locale = I18nHelper.locale()
    if (locale === 'auto' || locale.startsWith('en')) {
    //if (locale === 'auto') {
      FunctionHelper.triggerCallback(callback)
    }
    else {
      let path = `static/summernote/lang/summernote-${locale}.js`
      $.ajax({
        url: path,
        dataType: "script",
        complete: callback
      })
    }
  },
  postBodyConfig: function (callback) {
    let locale = I18nHelper.locale()
    //console.log(locale)
    let config = {
      lang: locale,
      focus: true, // set focus to editable area after initializing summernote
      disableResizeEditor: true,
      placeholder: 'Post Body',
      toolbar: this.toolbar(),
      styleTags: this.styleTags(),
      //clearEnterFormat: true,
      clearEnterFormat: true,
      showHeadingLabel: true,
      enableDropImage: false,
      enablePasteImage: false,
      popover: {
        image: this.popoverImage(),
        table: this.popoverTable(),
        link: this.popoverLink(),
        //air: this.popoverAir()
      },
      buttons: SummerNoteButtons.config(),
      //disableDragAndDrop: false,
      callbacks: SummerNoteCallbacks.config(callback),
    }
    return config
  },
  postTitleConfig: function (placeholder, callback) {
    let config = {
      airMode: true,
      placeholder: placeholder,
      shortcuts: false,
      disableDragAndDrop: true,
      allowEnter: false,
      enableDropImage: false,
      enablePasteImage: false,
      popover: {
        air: this.popoverAir()
      },
      callbacks: {
        onChange: (contents) => {
          this.onPostTitleChange(contents)
        },
        onInit: function() {
          FunctionHelper.triggerCallback(callback)
        },
        onKeypress: (e) => {
          if (e.keyCode === 13) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
      }
    }
    return config
  },
  postLabelsConfig: function (placeholder, initCallback, keypressCallback) {
    let config = {
      airMode: true,
      placeholder: placeholder,
      shortcuts: false,
      disableDragAndDrop: true,
      allowEnter: false,
      enableDropImage: false,
      enablePasteImage: false,
      popover: {
        air: this.popoverAir()
      },
      callbacks: {
        onInit: () => {
          FunctionHelper.triggerCallback(initCallback)
        },
        onChange: (contents) => {
          this.onPostLabelsChange(contents)
        },
        onKeyup: (e) => {
          FunctionHelper.triggerCallback(keypressCallback, e)
        }
      },
      hint: this.getLabelsHintConfig()
    }
    return config
  },
  onPostTitleChange: function (contents) {
    let fieldName = 'title'
    DelayExecHelper.exec(fieldName, 3, () => {
      $v.EditorManager.FieldPostDate.set()
      if (contents.startsWith('<') && contents.endsWith('>')) {
        contents = $(contents).text()
      }
      $v.EditorManager.FieldPostTitle.updateDocumentTitle(contents)
      $v.PostManager.updateEditingPost(fieldName, contents)
    })
    //console.log(fieldName + ':', contents)
  },
  onPostLabelsChange: function (contents) {
    let fieldName = 'labels'
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
    let FieldPostLabels = $v.EditorManager.FieldPostLabels
    
    let hint = {
      words: words,
      //match: /\b(\S{1,})$/,
      match: /([\u4E00-\u9FAF\u3040-\u3096\u30A1-\u30FA\uFF66-\uFF9D\u31F0-\u31FFA-Za-z]{1,})$/,
      search: function (keyword, callback) {
        //console.log(['search', keyword])
        callback($.grep(this.words, function (item) {
          return item.indexOf(keyword) > -1;
        }));
      },
      content: function (item) {
        //return '<span>' + item + ', </span>';
        //return item + ', '
        //console.log(item)
        //let labels = fieldPostLabels.summernote('text')
        //console.log(labels)
        //if (labels)
        setTimeout(() => {
          FieldPostLabels.addLabel(item)
        }, 0)
        return ''
      }
    }
    
    return hint
  }
}

export default SummerNoteConfig