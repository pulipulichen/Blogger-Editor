/* global DayjsHelper, GoogleAnalyticsHelper, DelayExecHelper, EventManager, WindowHelper */

import SummerNoteImage from './../../EditorManager/SummerNote/SummerNoteImage.js'
import SummerNoteCode from './../../EditorManager/SummerNote/SummerNoteCode.js'

let NavBarMenu = {
  //name: "main-content",
  data: function () {
    return {
      name: 'NavBarMenu',
      ui: undefined,
      wordCount: 0,
      imageCount: 0,
      tableCount: 0,
      iframeCount: 0,
      //timeSpent: 130320,
      timeSpentSecond: 0,
      lastEditTimestamp: 0,
      //timeSpent: 61,
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
      if (this.imageCount > 1) {
        return this.$t('pictures')
      }
      else {
        return this.$t('picture')
      }
    },
    tableCountUnit: function () {
      if (this.tableCount > 1) {
        return this.$t('tables')
      } else {
        return this.$t('table')
      }
    },
    iframeCountUnit: function () {
      if (this.iframeCount > 1) {
        return this.$t('iframes')
      } else {
        return this.$t('iframe')
      }
    },
    timeSpentDisplay: function () {
      return DayjsHelper.timeSpentDisplay(this.timeSpentSecond)
    },
    titleWordCount: function () {
      return this.wordCount + ' ' + this.wordCountUnit
    },
    titleImageCount: function () {
      return this.imageCount + ' ' + this.imageCountUnit
    },
    titleTableCount: function () {
      return this.tableCount + ' ' + this.tableCountUnit
    },
    titleIframeCount: function () {
      return this.iframeCount + ' ' + this.iframeCountUnit
    },
    timeSpentTitle: function () {
      let display = DayjsHelper.timeSpentDisplay(this.timeSpentSecond).split(':')
      
      let hour = parseInt(display[0], 10)
      let minute = parseInt(display[1], 10)
      let data = {
        'hour': hour,
        'minute': minute
      }
      let totalMinutes = hour * 60 + minute
      let key = 'Total spent time is {hour} hours and {minute} minutes'
      if (hour === 0) {
        if (minute > 1) {
          key = 'Total spent time is {minute} minutes'
        }
        else {
          key = 'Total spent time is {minute} minute'
        }
      }
      else {
        if (hour > 1) {
          if (minute > 1) {
            key = 'Total spent time is {hour} hours and {minute} minutes'
          }
          else {
            key = 'Total spent time is {hour} hours and {minute} minute'
          }
        }
        else {
          if (minute > 1) {
            key = 'Total spent time is {hour} hour and {minute} minutes'
          }
          else {
            key = 'Total spent time is {hour} hour and {minute} minute'
          }
        }
      }
      return this.$tc(key, totalMinutes, data)
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
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'openPublishManager')
      this.hideNavBar()
    },
    openPostManager: function () {
      $v.PostManager.open()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'openPostManager')
      this.hideNavBar()
    },
    openThemeManager: function () {
      $v.ThemeManager.open()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'openThemeManager')
      this.hideNavBar()
    },
    openEditorManager: function () {
      $v.EditorManager.open()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'openEditorManager')
      this.hideNavBar()
    },
    openConfigManager: function () {
      $v.ConfigManager.open()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'openConfigManager')
      this.hideNavBar()
    },
    
    // --------------------------------------
    
    editorInsertMore: function () {
      SummerNoteCode.insertMoreClick()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorInsertMore')
      this.hideNavBar()
    },
    editorInsertSnippet: function () {
      $v.SnippetInserter.open()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorInsertSnippet')
      this.hideNavBar()
    },
    editorInsertIframe: function () {
      $v.IframePrompt.open()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorInsertIframe')
      this.hideNavBar()
    },
    editorInsertFile: function () {
      $v.FileUploader.open()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorInsertFile')
      this.hideNavBar()
    },
    editorInsertCode: function () {
      $v.CodeInserter.open()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorInsertCode')
      this.hideNavBar()
    },
    editorImportMarkdown: function () {
      $v.MarkdownImporter.open()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorImportMarkdown')
      this.hideNavBar()
    },

    // -------------------------------
    downloadImageTemplate: function () {
      SummerNoteImage.downloadImageTamplateClick()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'downloadImageTemplate')
      this.hideNavBar()
    },
    openImageReaplcer: function () {
      $v.ImageReplacer.open()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'openImageReaplcer')
      this.hideNavBar()
    },
    openGooglePhoto: function () {
      WindowHelper.forcePopup('https://photos.google.com/?hl=zh-TW', 'googlePhoto')
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'openGooglePhoto')
      this.hideNavBar()
    },
    openGoogleDocsLinkBuilder: function () {
      //WindowHelper.forcePopup('https://blog.pulipuli.info/2016/09/google-google-drive-file-download-link.html#postcatagoogle-google-drive-file-download-link.html0_anchor2', 'googleDocsLinkBuilder')
      $v.GoogleDocLinkBuilder.open()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'openGoogleDocsLinkBuilder')
      this.hideNavBar()
    },
    openOneDriveLinkBuilder: function () {
      WindowHelper.forcePopup('https://blog.pulipuli.info/2019/02/onedrive-onedrive-file-download-link.html#postcataonedrive-onedrive-file-download-link.html0_anchor3', 'OneDriveDownload')
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'openOneDriveLinkBuilder')
      this.hideNavBar()
      
    },
    editorCleanCode: function () {
      SummerNoteCode.CleanCodeClick((message) => {
        return this.$t(message)
      })
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorCleanCode')
      this.hideNavBar()
    },
    editorCopyCode: function () {
      SummerNoteCode.CopyCodeClick((message) => {
        return this.$t(message)
      })
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorCopyCode')
      this.hideNavBar()
    },
    editorImageResizeOriginal: function () {
      SummerNoteImage.imageSizeOriginalClick()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorImageResizeOriginal')
      this.hideNavBar()
    },
    editorImageResizeThumbnail: function () {
      SummerNoteImage.imageSizeThumbnailClick()
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'editorImageResizeThumbnail')
      this.hideNavBar()
    },
    reloadPage: function () {
      //console.log(1)
      GoogleAnalyticsHelper.send('NavBarMenu.open', 'reloadPage')
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
    },
    /**
     * 只有顯示，沒有實質更新
     * @author Pulipuli Chen 20190721
     */
    updateTimeSpent: function () {
      setTimeout(() => {
        let post = $v.PostManager.getPost()
        this.timeSpentSecond = post.timeSpentSecond
        return this
      }, 0)
      return this
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
    },
    newPost () {
      // console.log($v.PostManager)
      $v.PostManager.newPost()
    }
  },
}

export default NavBarMenu