import SummerNoteImage from './../../EditorManager/SummerNote/SummerNoteImage.js'
import SummerNoteCode from './../../EditorManager/SummerNote/SummerNoteCode.js'

let NavBarMenu = {
  //name: "main-content",
  data: function () {
    return {
      name: 'NavBarMenu',
      ui: undefined,
      wordCount: 0,
      imageCount: 56,
      //timeSpent: 130320,
      timeSpent: 0,
      lastEditTimestamp: 0
      //timeSpent: 61
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
    },
    imageCountUnit: function () {
      if (this.wordCount > 1) {
        return this.$t('pictures')
      }
      else {
        return this.$t('picture')
      }
    },
    timeSpentDisplay: function () {
      return DayjsHelper.timeSpentDisplay(this.timeSpent)
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
    openGoogleDocsLinkBuilder: function () {
      //WindowHelper.forcePopup('https://blog.pulipuli.info/2016/09/google-google-drive-file-download-link.html#postcatagoogle-google-drive-file-download-link.html0_anchor2', 'googleDocsLinkBuilder')
      $v.GoogleDocLinkBuilder.open()
      this.hideNavBar()
    },
    openOneDriveLinkBuilder: function () {
      WindowHelper.forcePopup('https://blog.pulipuli.info/2019/02/onedrive-onedrive-file-download-link.html#postcataonedrive-onedrive-file-download-link.html0_anchor3', 'OneDriveDownload')
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
    reloadPage: function () {
      //console.log(1)
      DelayExecHelper.forceExec(() => {
        //console.log(2)
        location.reload()
      })
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
        
        this.imageCount = FieldPostBody.countImage()
        
        this.updateTimeSpent()
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
      this.lastEditTimestamp = (new Date()).getTime()
    },
    updateTimeSpent: function () {
      let currentEditTimestamp = (new Date()).getTime()
      
      let intervalSecond = Math.round((currentEditTimestamp - this.lastEditTimestamp) / 1000)
      if (intervalSecond > 60) {
        intervalSecond = 60
      }
      
      let post = $v.PostManager.getPost()
      post.timeSpentSecond = post.timeSpentSecond + intervalSecond
      this.timeSpent = post.timeSpentSecond
      $v.PostManager.updateEditingPost('timeSpentSecond', this.timeSpent)
      
      this.lastEditTimestamp = currentEditTimestamp
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
      //$v.NavBar.toggle()
      $v.NavBar.unpin()
    }
  },
}

export default NavBarMenu