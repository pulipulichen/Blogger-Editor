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
  props: ['mode'],
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
      $v.NavBarSidebar.close()
    },
    openPostManager: function () {
      $v.PostManager.open()
      $v.NavBarSidebar.close()
    },
    openThemeManager: function () {
      $v.ThemeManager.open()
      $v.NavBarSidebar.close()
    },
    openEditorManager: function () {
      $v.EditorManager.open()
      $v.NavBarSidebar.close()
    },
    openConfigManager: function () {
      $v.ConfigManager.open()
      $v.NavBarSidebar.close()
    },
    
    // --------------------------------------
    
    editorInsertMore: function () {
      SummerNoteCode.insertMoreClick()
    },
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
      
      if (this.mode === 'sidebar') {
        $(this.$refs.dropdownInsert).click((event) => {
          this.sidebarToggleSubmenu(event)
        })
        $(this.$refs.dropdownPublish).click((event) => {
          this.sidebarToggleSubmenu(event)
        })
      }
      else if (this.mode === 'topbar') {
        this.topbarDropdownItem(this.$refs.dropdownInsert)
        this.topbarDropdownItem(this.$refs.dropdownPublish)
      }
      //$(this.$refs.dropdownPublish).dropdown()
      //console.log($(this.$refs.dropdownPublish).length)
      
      // <div class="ui simple dropdown item" ref="dropdownPublish">
    },
    topbarDropdownItem: function (ele) {
      ele = $(ele)
      ele.removeClass('sub-menu-button')
      ele.addClass('simple').addClass('dropdown')
      ele.dropdown()
    },
    sidebarToggleSubmenu: function (event) {
      let ele = $(event.target)
      //let submenu = $(ele).children('.menu')
      ele.toggleClass('open-submenu')
      
      ele.children('.menu').transition('slide down')
      //$(ele).children('.menu').toggle()
    },
  },
}

export default NavBarMenu