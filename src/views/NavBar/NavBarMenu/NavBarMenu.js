import SummerNoteImage from './../../EditorManager/SummerNote/SummerNoteImage.js'
import SummerNoteCode from './../../EditorManager/SummerNote/SummerNoteCode.js'

let NavBarMenu = {
  //name: "main-content",
  data: function () {
    return {
      name: 'NavBarMenu',
      ui: undefined,
      wordCount: 0
    }
  },
  mounted: function () {
    this.init()
  },
  computed: {
    wordCountUnit: function () {
      if (this.wordCount > 1) {
        return this.$t('words')
      }
      else {
        return this.$t('word')
      }
    }
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    },
    openPublishManager: function () {
      $v.PublishManager.open()
    },
    openPostManager: function () {
      $v.PostManager.open()
    },
    openThemeManager: function () {
      $v.ThemeManager.open()
    },
    openEditorManager: function () {
      $v.EditorManager.open()
    },
    openConfigManager: function () {
      $v.ConfigManager.open()
    },
    
    // --------------------------------------
    
    editorInsertSnippet: function () {
      $v.SnippetInserter.open()
    },
    editorInsertIframe: function () {
      $v.IframePrompt.open()
    },
    editorInsertFile: function () {
      $v.FileUploader.open()
    },
    editorInsertCode: function () {
      $v.CodeInserter.open()
    },
    
    // -------------------------------
    downloadImageTemplate: function () {
      SummerNoteImage.downloadImageTamplateClick()
    },
    openImageReaplcer: function () {
      $v.ImageReplacer.open()
    },
    openGooglePhoto: function () {
      WindowHelper.forcePopup('https://photos.google.com/?hl=zh-TW', 'googlePhoto')
    },
    editorCleanCode: function () {
      //console.log('editorCleanCode 還沒完成')
      SummerNoteCode.CleanCodeClick()
    },
    editorCopyCode: function () {
      //console.log('editorCopyCode 還沒完成')
      SummerNoteCode.CopyCodeClick()
    },
    editorImageResizeOriginal: function () {
      SummerNoteImage.imageSizeOriginalClick()
    },
    editorImageResizeThumbnail: function () {
      SummerNoteImage.imageSizeThumbnailClick()
    },
    
    // --------------------------------------
    
    toggle: function () {
      this.getUI().toggleClass('call-fixed')
    },
    init: function (callback) {
      EventManager.on($v.EditorManager.FieldPostBody, ['set', 'change'], (FieldPostBody) => {
        //console.log('aaa')
        let text = FieldPostBody.getText()
        text = text.replace(/[^\x20-\x7E]/gmi, "")
        text = text.split(' ').join('')
        this.wordCount = text.length
        //console.log(this.wordCount)
        //
      })
      
      FunctionHelper.triggerCallback(callback)
      
      $(this.$refs.dropdownInsert).dropdown()
      $(this.$refs.dropdownPublish).dropdown()
      //console.log($(this.$refs.dropdownPublish).length)
    },
  }
}

export default NavBarMenu