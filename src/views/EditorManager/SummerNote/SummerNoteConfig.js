import SummerNoteButtons from './SummerNoteButtons.js'
import SummerNoteCallbacks from './SummerNoteCallbacks.js'
import SummerNoteKeyMap from './SummerNoteKeyMap.js'

let SummerNoteConfig = {
  $t: null,
  toolbar: function ($t, loadDefault) {
    this.$t = $t
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
        } else {
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
        ['menu', ['toggleMenu', 'codeview', 'OutlineNavigator']],
        ['clear', ['undo', 'clear']],
        ['style', ['style', 'color']],
        //['formatBlockHeading1', ['formatH1']],
        ['formatBlockHeading2', ['formatH2', 'formatH3', 'formatH4']],
        //['formatBlockHeading3', [, 'formatH5']],
        ['formatBlock', ['formatPara', 'comment', 'htmlify', 'textify']],
        //['formatBlock', ['formatPara', 'formatCode']],
        //['styleTags', ['styleP', 'styleH1', 'styleH2', 'styleH3', 'styleH4', 'styleH5', 'styleH6']],
        ['font', ['bold', 'underline']],
        //['fontname', ['fontname']],
        ['para', ['ul', 'ol', 'paragraph']],
        //['table', []],
        ['insert', ['link', 'picture', 'table', /*'insertTable',*/  'CodeInserter', 'SaveSnippet']],
        ['insertOthers', [  'insertGroup']],
        // ['insertCode', ['SnippetInserter', 'IframePrompt', 'FileUploader', 'CodeInserter']],
        //['imageResize', ['imageSizeOriginal', 'imageSizeDefault']],
        //['publish', ['ImageReplacer', 'CleanCode', 'CopyHTML']],
        ['view', ['formatGroup', ]],
        ['help', [/*'fullscreen',*/ /*'transSelected',*/ 'help']]
      ]

    return toolbar
  },
  styleTags: function ($t, loadDefault) {
    this.$t = $t
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
          return this.defaultStyleTags($t, loadDefault)
        }
      }
      catch (e) {
        return this.defaultStyleTags($t, loadDefault)
      } 
    }
    return this.defaultStyleTags($t, loadDefault)
  },
  defaultStyleTags: function ($t, loadDefault) {
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
   
    if (typeof($t) !== 'function') {
      //console.trace('error')
      return
    }
  
    //let styleTags = ['p', 'blockquote', 'code', 'h2', 'h3', 'h4', 'h5', 'h6']
    let styleTags = [{
        tag: 'span',
        title: $t('red color & underline'),
        style: 'color: red; font-weight: bold; text-decoration: underline;'
      }, 
      { // 'italic', 
        tag: 'i',
        title: $t('italic')
      },
      { // 'sup', 
        tag: 'sup',
        title: $t('sup')
      },
      { // 'sub', 
        tag: 'sub',
        title:  $t('sub')
      },
      { // 'strikethrough', 
        tag: 'span',
        title: $t('strikethrough'),
        style: 'text-decoration: line-through;'
      },
      {
        tag: 'span',
        title: $t('comment'),
        className: 'note-editor-comment'
      },
      'blockquote', 
      'h1',
      {
        tag: 'h5',
        title: $t('Heading 5')
      },
      {
        tag: 'h6',
        title: $t('Heading 6')
      },
    ]
    
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
  postBodyConfig: function ($t, callback) {
    let locale = I18nHelper.locale()
    //console.log(locale)
    let config = {
      lang: locale,
      focus: true, // set focus to editable area after initializing summernote
      disableResizeEditor: true,
      placeholder: 'Post Body',
      toolbar: this.toolbar(),
      styleTags: this.styleTags($t),
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
      buttons: SummerNoteButtons.config($t),
      //disableDragAndDrop: false,
      callbacks: SummerNoteCallbacks.config(callback),
      keyMap: SummerNoteKeyMap
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
          $v.EditorManager.FieldPostTitle.onPostTitleChange(contents)
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
          $v.EditorManager.FieldPostLabels.onPostLabelsChange(contents)
        },
        onKeyup: (e) => {
          FunctionHelper.triggerCallback(keypressCallback, e)
        }
      },
      hint: $v.EditorManager.FieldPostLabels.getLabelsHintConfig()
    }
    return config
  },
  /*
  onPostTitleChange: function (contents) {
    $v.EditorManager.FieldPostTitle.onPostTitleChange(contents)
  },
  */
  /*
  onPostLabelsChange: function (contents) {
    $v.EditorManager.FieldPostLabels.onPostLabelsChange(contents)
  },
  */
  /*
  getLabelsHintConfig: function () {
    return $v.EditorManager.FieldPostLabels.getLabelsHintConfig()
  }
  */
}

export default SummerNoteConfig