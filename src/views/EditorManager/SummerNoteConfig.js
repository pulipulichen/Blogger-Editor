import SummerNoteButtons from './SummerNoteButtons.js'
import SummerNoteCallbacks from './SummerNoteCallbacks.js'

let SummerNoteConfig = {
  toolbar: function (loadDefault) {
    if (loadDefault === undefined) {
      loadDefault = true
    }
    
    let config = $v.EditorManager.summerNoteConfigToolbar.trim()
    
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
        ['view', ['codeview']],
        ['style', ['style']],
        ['font', ['undo', 'bold', 'underline', 'clear']],
        //['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['hr', 'link', 'picture', 'video', 'IframePrompt', 'FileUploader', 'CodeInserter']],
        ['imageResize', ['imageSizeOriginal', 'imageSizeDefault']],
        ['mybutton', ['ImageReplacer', 'CopyHTML']],
        ['help', [/*'fullscreen',*/ 'help']]
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
    
    let styleTags = ['p', 'code', 'h4', 'h5', 'h6', {
        tag: 'sub',
        title: 'ttt',
        style: 'font-weight: bold;',
        className: 'ttt'
    }]
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
      ['link', ['linkDialogShow', 'unlink']]
    ]
  },
  popoverAir: function () {
    return [
      ['color', ['color']],
      ['font', ['bold', 'underline', 'clear']],
      ['para', ['ul', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture']]
    ]
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
  fullConfig: function (callback) {
    let locale = I18nHelper.locale()
    let config = {
      lang: locale,
      focus: true, // set focus to editable area after initializing summernote
      disableResizeEditor: true,
      placeholder: 'Post Body',
      toolbar: this.toolbar(),
      styleTags: this.styleTags(),
      popover: {
        image: this.popoverImage(),
        table: this.popoverTable(),
        link: this.popoverLink(),
        //air: this.popoverAir()
      },
      buttons: SummerNoteButtons.config(),
      //disableDragAndDrop: false,
      callbacks: SummerNoteCallbacks.config(callback)
    }
    return config
  },
  airConfig: function (fieldName, placeholder, callback) {
    let config = {
      airMode: true,
      placeholder: placeholder,
      shortcuts: false,
      disableDragAndDrop: true,
      popover: {
        air: []
      },
      callbacks: {
        onChange: (contents) => {
          DelayExecHelper.exec(fieldName, 3, () => {
            $v.EditorManager.FieldPostDate.set()
            $v.PostManager.updateEditingPost(fieldName, contents)
          })
          //console.log(fieldName + ':', contents)
        },
        onInit: function() {
          FunctionHelper.triggerCallback(callback)
        }
      }
    }
    return config
  },
}

export default SummerNoteConfig