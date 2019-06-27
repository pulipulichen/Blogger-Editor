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
      this.hideNavBar()
    },
    openPostManager: function () {
      $v.PostManager.open()
      this.hideNavBar()
    },
    openThemeManager: function () {
      $v.ThemeManager.open()
      this.hideNavBar()
    },
    openEditorManager: function () {
      $v.EditorManager.open()
      this.hideNavBar()
    },
    openConfigManager: function () {
      $v.ConfigManager.open()
      this.hideNavBar()
    },
    
    // --------------------------------------
    
    editorInsertMore: function () {
      SummerNoteCode.insertMoreClick()
      this.hideNavBar()
    },
    editorInsertSnippet: function () {
      $v.SnippetInserter.open()
      this.hideNavBar()
    },
    editorInsertIframe: function () {
      $v.IframePrompt.open()
      this.hideNavBar()
    },
    editorInsertFile: function () {
      $v.FileUploader.open()
      this.hideNavBar()
    },
    editorInsertCode: function () {
      $v.CodeInserter.open()
      this.hideNavBar()
    },
    
    // -------------------------------
    downloadImageTemplate: function () {
      SummerNoteImage.downloadImageTamplateClick()
      this.hideNavBar()
    },
    openImageReaplcer: function () {
      $v.ImageReplacer.open()
      this.hideNavBar()
    },
    openGooglePhoto: function () {
      WindowHelper.forcePopup('https://photos.google.com/?hl=zh-TW', 'googlePhoto')
      this.hideNavBar()
    },
    editorCleanCode: function () {
      SummerNoteCode.CleanCodeClick()
      this.hideNavBar()
    },
    editorCopyCode: function () {
      SummerNoteCode.CopyCodeClick()
      this.hideNavBar()
    },
    editorImageResizeOriginal: function () {
      SummerNoteImage.imageSizeOriginalClick()
      this.hideNavBar()
    },
    editorImageResizeThumbnail: function () {
      SummerNoteImage.imageSizeThumbnailClick()
      this.hideNavBar()
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
    hideNavBar: function () {
      //let ui = event.target
      //console.log(ui.parents('.ui.top.inverted.menu.call-fixed').length)
      //console.log(ui.prop('className'))
      /*
      if (ui.parents('.ui.top.inverted.menu.call-fixed').length === 1) {
        ui.parents('.ui.top.inverted.menu.call-fixed').removeClass('call-fixed')
      }
      */
      $v.NavBar.toggle()
      $v.NavBarSidebar.close()
    }
  },
}

export default NavBarMenu