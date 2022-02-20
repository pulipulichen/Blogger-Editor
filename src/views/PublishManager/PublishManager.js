/* global VueHelper, EventManager, FunctionHelper, ConfigHelper, WindowHelper, CopyPasteHelper, DayjsHelper */

import SummerNoteCode from './../EditorManager/SummerNote/SummerNoteCode.js'

import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'

let config = {
  data: function () {
    this.$i18n.locale = 'auto'
    return {
      name: 'PublishManager',
      ui: undefined,
      bloggerConsoleURL: "https://www.blogger.com/",
      editURL: "",
      publicURL: "",
      postId: null,
      postTitle: "",
      postLabels: "",
      postSEOLink: "",
      editNote: "",
      filesystemImageCount: 0,
    }
  },
  mounted: function () {
    VueHelper.mountLocalStorage(this, 'bloggerConsoleURL')
  },
  computed: {
    disableOpenBloggerConsole: function () {
      if (this.bloggerConsoleURL === 'https://www.blogger.com'
            //|| this.bloggerConsoleURL.startsWith('https://www.blogger.com/blogger.g?blogID=')) {
            || this.bloggerConsoleURL.startsWith('https://www.blogger.com/')) {
        return false
      }
      else {
        return true
      }
    },
    disableOpenEditURL: function () {
      //if (this.editURL.startsWith('https://www.blogger.com/blogger.g?blogID=')
      if (this.editURL.startsWith('https://www.blogger.com/blog/post/edit/')
              || this.editURL.startsWith('https://www.blogger.com/blog/page/edit/')) {
        return false
      }
      else {
        return true
      }
    },
    disableOpenPublicURL: function () {
      if (this.publicURL.startsWith('http')
              || this.publicURL.startsWith('//')) {
        return false
      }
      else {
        return true
      }
    },
    enableImageUpload: function () {
      return (this.filesystemImageCount > 0 && this.disableOpenEditURL === false)
    },
    postTitleSafe () {
      let title = this.postTitle
      
      if (title.indexOf('/') > -1) {
        title = title.slice(0, title.indexOf('/')).trim()
      }
      
      if (title.length > 20) {
        title = title.slice(0, 20).trim()
      }
      
      return title
    },
    googleTransLink () {
      let postTitle = this.postTitle
      
      let slashPos = postTitle.indexOf(' / ')
      if (slashPos > -1) {
        postTitle = postTitle.slice(0, slashPos).trim()
      }
      
      postTitle = postTitle.trim()
      postTitle = encodeURIComponent(postTitle)
      
      return `https://translate.google.com.tw/?hl=zh-TW&sl=zh-CN&tl=en&text=${postTitle}&op=translate`
    }
  },
  created: function () {
    $v[this.name] = this
      
    // 監聽ImageReplacer的改變事件
    EventManager.on($v.ImageReplacer, 'onFilesystemImageCountChange', (ImageReplacer) => {
      this.filesystemImageCount = ImageReplacer.filesystemImageCount
      //console.log(this.filesystemImageCount)
    })
  },
  methods: {
    // ---------------------
    // Methods of Modal
    // ---------------------
    
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    },
    open: function () {
      
      this.loadPostData(() => {
        $v.ImageReplacer.validateHasFileSystemImage()
        //console.log(this.filesystemImageCount)
        this.getUI().modal('show')
      })
    },
    close: function () {
      this.getUI().modal('hide')
    },
    loadPostData: function(callback) {
      if (ConfigHelper.get('debug').disablePublishManager !== false) {
        return FunctionHelper.triggerCallback(callback)
      }
      
      let post = $v.PostManager.getPost()
      if (post === undefined) {
        console.error('post is not found')
        FunctionHelper.triggerCallback(callback)
        return false
      }
      
      this.postId = post.id
      this.editURL = post.editURL
      this.publicURL = post.publicURL
      this.editNote = post.editNote
      
      let fieldPostTitle = $v.EditorManager.FieldPostTitle
      this.postTitle = fieldPostTitle.getText()
      
      let fieldPostLabels = $v.EditorManager.FieldPostLabels
      this.postLabels = fieldPostLabels.getText()
      
      FunctionHelper.triggerCallback(callback)
    },
    persist: function () {
      VueHelper.persistLocalStorage(this, 'bloggerConsoleURL')
    },
    persistPost: function (key) {
      let pm = $v.PostManager
      let value = this[key]
      //console.log([key, value])
      pm.updateEditingPost(key, value)
    },
    popup: function (name) {
      let url = this[name]
      WindowHelper.popup(url, name)
    },
    openImageReplacer: function () {
      $v.EditorManager.ImageReplacer.open()
      return this
    },
    downloadPostBackup: function () {
      $v.PostManager.backupPost()
      //this.close()
      return this
    },
    changePostMetadata: function () {
      let fieldPostTitle = $v.EditorManager.FieldPostTitle
      fieldPostTitle.set(this.postTitle)
      
      let fieldPostLabels = $v.EditorManager.FieldPostLabels
      fieldPostLabels.set(this.postLabels)
      return this
    },
    copyInput: function (event) {
      //console.log(event)
      let button = event.target
      let text = $(button).parents('.ui.input:first').find('input').val()
      //console.log(text)
      CopyPasteHelper.copyPlainText(text)
      return this
    },
    copyHTML: function () {
      SummerNoteCode.CopyCodeClick((message) => {
        return this.$t(message)
      })
      return this
    },
    saveOneFileHTML () {
      let html = SummerNoteCode.GetOneFileHTML((message) => {
        return this.$t(message)
      })
      
      let htmlTemplate = `<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>${this.postTitle}</title>

</head>

<body>

<h1>${this.postTitle}</h1>
${html}

</body>
</html>`
      
      let blob = new Blob([htmlTemplate], {type: "text/html;charset=utf-8"});
      saveAs(blob, DayjsHelper.nowMMDDHHmmFormat() + ` ${this.postTitleSafe}.html`)
      
      return this
    },
    saveOneFileHTMLtoDOC () {
      let html = SummerNoteCode.GetOneFileHTML((message) => {
        return this.$t(message)
      })
      
      let htmlTemplate = `<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>${this.postTitle}</title>

</head>

<body>

<h1>${this.postTitle}</h1>
${html}

</body>
</html>`
      
      let zip = new JSZip()
      let filename = DayjsHelper.nowMMDDHHmmFormat() + ` ${this.postTitleSafe}.rtf`
      zip.file(filename, htmlTemplate)
      zip.generateAsync({type: "blob"}).then((content) => {
        // see FileSaver.js
        saveAs(content, filename + `.zip`)
        //$v.PageLoader.close()
        //FunctionHelper.triggerCallback(callback, content)
      })
      
      return this
    },
    openBackupPage: function () {
      let config = $v.ConfigManager
      if (config.enableBackupPageButton === false
              || config.backupPageURL === 'https://drive.google.com/drive/u/0/my-drive') {
        config.open('backup')
      }
      else {
        config.openBackupPageURL()
      }
    },
    triggerUploadPostBackup: function (e) {
      this.getUI().find('input:file[name="uploadPosts"]').click()
      return this
    },
    uploadPosts: function (e) {
      $v.PostManager.uploadPosts(e, this.postId, (post) => {
        this.afterUploadPost(post)
      })
      return this
    },
    dropPosts: function (e) {
      $v.PostManager.dropPosts(e, this.postId, (post) => {
        this.afterUploadPost(post)
      })
      return this
    },
    afterUploadPost: function (post) {
      //console.log('afterUploadPost')
      //console.log(post)
      
      if (typeof(post) !== 'object') {
        console.log('This is not a valided post data.')
        return false
      }
      
      if (typeof(post.title) === 'string') {
        this.postTitle = post.title
      }
      else {
        this.postTitle = ''
      }
      
      if (typeof(post.labels) === 'string') {
        this.postLabels = post.labels
      }
      else if (Array.isArray(post.labels)) {
        this.postLabels = post.labels.join(', ')
      }
      else {
        this.postLabels = ''
      }
      
      if (typeof(post.editURL) === 'string') {
        this.editURL = post.editURL
      }
      else {
        this.editURL = ''
      }
      
      if (typeof(post.publicURL) === 'string') {
        this.publicURL = post.publicURL
      }
      else {
        this.publicURL = ''
      }
      
      
      if (typeof(post.editNote) === 'string') {
        this.editNote = post.editNote
      }
      else {
        this.editNote = ''
      }
      
      this.resetUploadInput()
      this.close()
      return this
    },
    resetUploadInput: function () {
      this.getUI().find('input:file[name="uploadPosts"]').val('')
    },
    generateSEOLink () {
      let postTitle = this.postTitle
      
      let slashPos = postTitle.indexOf(' / ')
      if (slashPos > -1) {
        postTitle = postTitle.slice(slashPos + 3).trim()
      }
      
      this.convertPostTitleToSEOLink(postTitle)
    },
    fixSEOLink () {
      let link = this.postSEOLink
      
      if (link.indexOf(' ') === -1
              && (new RegExp('[^\x00-\x7F]', 'g')).test(link) === false
              && (new RegExp('[A-Z]', 'g')).test(link) === false) {
        return false
      }
      
      this.convertPostTitleToSEOLink(link)
    },
    convertPostTitleToSEOLink (link) {
      let seoLink = link.toLowerCase().trim()
      seoLink = seoLink.replace(/[^a-zA-Z ]/g, "")
      seoLink = seoLink.replace(/[^\x00-\x7F]/g, "-")
      seoLink = seoLink.split(' ').join('-')
      seoLink = seoLink.split(':').join('-')
      
      
      while (seoLink.indexOf('--') > -1) {
        seoLink = seoLink.split('--').join('-')
      }
      
      while (seoLink.startsWith('-')) {
        seoLink = seoLink.slice(1)
      }
      while (seoLink.endsWith('-')) {
        seoLink = seoLink.slice(0, -1)
      }
      
      if (seoLink === '-' 
              || seoLink === '') {
        return false
      }
      
      
      this.postSEOLink = seoLink
    }
  }
}

export default config