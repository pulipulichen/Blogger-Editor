
import SummerNoteImage from './../../EditorManager/SummerNote/SummerNoteImage.js'
import SummerNoteCode from './../../EditorManager/SummerNote/SummerNoteCode.js'


export default function (app) {
  if (!app.methods) {
    app.methods = {}
  }

  app.methods.getUI = function () {
    if (typeof(this.ui) === 'undefined') {
      //console.log('find ui')
      this.ui = $(this.$refs.modal)
    }
    return this.ui
  }

  app.methods.openPublishManager = function () {
    $v.PublishManager.open()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'openPublishManager')
    this.hideNavBar()
  }

  app.methods.openPostManager = function () {
    $v.PostManager.open()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'openPostManager')
    this.hideNavBar()
  }

  app.methods.openThemeManager = function () {
    $v.ThemeManager.open()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'openThemeManager')
    this.hideNavBar()
  }

  app.methods.openEditorManager = function () {
    $v.EditorManager.open()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'openEditorManager')
    this.hideNavBar()
  }

  app.methods.openConfigManager = function () {
    $v.ConfigManager.open()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'openConfigManager')
    this.hideNavBar()
  }
  
  // --------------------------------------
  
  app.methods.editorInsertMore = function () {
    SummerNoteCode.insertMoreClick()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorInsertMore')
    this.hideNavBar()
  }

  app.methods.editorInsertSnippet = function () {
    $v.SnippetInserter.open()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorInsertSnippet')
    this.hideNavBar()
  }

  app.methods.editorInsertIframe = function () {
    $v.IframePrompt.open()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorInsertIframe')
    this.hideNavBar()
  }

  app.methods.editorInsertFile = function () {
    $v.FileUploader.open()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorInsertFile')
    this.hideNavBar()
  }

  app.methods.editorInsertCode = function () {
    $v.CodeInserter.open()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorInsertCode')
    this.hideNavBar()
  }

  app.methods.editorImportMarkdown = function () {
    $v.MarkdownImporter.open()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorImportMarkdown')
    this.hideNavBar()
  }

  // -------------------------------
  app.methods.downloadImageTemplate = function () {
    SummerNoteImage.downloadImageTamplateClick()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'downloadImageTemplate')
    this.hideNavBar()
  }

  app.methods.openImageReaplcer = function () {
    $v.ImageReplacer.open()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'openImageReaplcer')
    this.hideNavBar()
  }

  app.methods.openGooglePhoto = function () {
    WindowHelper.forcePopup('https://photos.google.com/?hl=zh-TW', 'googlePhoto')
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'openGooglePhoto')
    this.hideNavBar()
  }

  app.methods.openGoogleDocsLinkBuilder = function () {
    //WindowHelper.forcePopup('https://blog.pulipuli.info/2016/09/google-google-drive-file-download-link.html#postcatagoogle-google-drive-file-download-link.html0_anchor2', 'googleDocsLinkBuilder')
    $v.GoogleDocLinkBuilder.open()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'openGoogleDocsLinkBuilder')
    this.hideNavBar()
  }

  app.methods.openOneDriveLinkBuilder = function () {
    WindowHelper.forcePopup('https://blog.pulipuli.info/2019/02/onedrive-onedrive-file-download-link.html#postcataonedrive-onedrive-file-download-link.html0_anchor3', 'OneDriveDownload')
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'openOneDriveLinkBuilder')
    this.hideNavBar()
  }

  app.methods.editorCleanCode = function () {
    SummerNoteCode.CleanCodeClick((message) => {
      return this.$t(message)
    })
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorCleanCode')
    this.hideNavBar()
  }

  app.methods.editorCopyCode = function () {
    SummerNoteCode.CopyCodeClick((message) => {
      return this.$t(message)
    })
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorCopyCode')
    this.hideNavBar()
  }

  app.methods.editorImageResizeOriginal = function () {
    SummerNoteImage.imageSizeOriginalClick()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorImageResizeOriginal')
    this.hideNavBar()
  }
  
  app.methods.editorImageResizeThumbnail = function () {
    SummerNoteImage.imageSizeThumbnailClick()
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorImageResizeThumbnail')
    this.hideNavBar()
  }

  app.methods.reloadPage = function () {
    //console.log(1)
    GoogleAnalyticsHelper.send('NavBarMenu.open', 'reloadPage')
    DelayExecHelper.forceExec(() => {
      //console.log(2)
      location.reload()
    })
  }
  
  // --------------------------------------
  
  app.methods.toggle = function () {
    this.getUI().toggleClass('call-fixed')
  }

  app.methods.init = function (callback) {
    EventManager.on($v.EditorManager.FieldPostBody, ['set', 'change'], (FieldPostBody) => {
      //console.log('aaa')
      //let text = FieldPostBody.getText()
      //text = text.replace(/[^\x20-\x7E]/gmi, "")
      //text = text.split(' ').join('')
      this.wordCount = FieldPostBody.getTextCount()
      //console.log(this.wordCount)
      //
      
      this.imageCount = FieldPostBody.countImage()
      
      this.tableCount = FieldPostBody.countTable()
      this.iframeCount = FieldPostBody.countIframe()
      
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
    
    if (ConfigHelper.get('showReload') === false) {
      $(this.$refs.reload).hide()
    }
  }

  /**
   * 只有顯示，沒有實質更新
   * @author Pulipuli Chen 20190721
   */
  app.methods.updateTimeSpent = function () {
    setTimeout(() => {
      let post = $v.PostManager.getPost()
      this.timeSpentSecond = post.timeSpentSecond
      return this
    }, 0)
    return this
  }

  app.methods.topbarDropdownItem = function (ele) {
    ele = $(ele)
    ele.removeClass('sub-menu-button')
    ele.addClass('simple').addClass('dropdown')
    ele.dropdown()
  }

  app.methods.sidebarToggleSubmenu = function (event) {
    let ele = $(event.target)
    //let submenu = $(ele).children('.menu')
    ele.toggleClass('open-submenu')
    
    ele.children('.menu').transition('slide down')
    //$(ele).children('.menu').toggle()
  }

  app.methods.hideNavBar = function () {
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

  app.methods.newPost = function () {
    // console.log($v.PostManager)
    $v.PostManager.newPost()
  }

  app.methods.previewPost = function () {
    // console.log($v.PostManager)
    $v.PostManager.previewPost()
  }

  app.methods.copyPostHTML = function () {
    SummerNoteCode.CopyCodeClick((message) => {
      return this.$t(message)
    })
    return this
  }
}