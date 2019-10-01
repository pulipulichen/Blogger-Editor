/* global VueHelper, EventManager, FunctionHelper, ConfigHelper, WindowHelper, CopyPasteHelper */

import SummerNoteCode from './../EditorManager/SummerNote/SummerNoteCode.js'

let config = {
  data: function () {
    return {
      name: 'PublishManager',
      ui: undefined,
      bloggerConsoleURL: "https://www.blogger.com",
      editURL: "",
      publicURL: "",
      postId: null,
      postTitle: "",
      postLabels: "",
      filesystemImageCount: 0,
    }
  },
  mounted: function () {
    VueHelper.mountLocalStorage(this, 'bloggerConsoleURL')
  },
  computed: {
    disableOpenBloggerConsole: function () {
      if (this.bloggerConsoleURL === 'https://www.blogger.com'
            || this.bloggerConsoleURL.startsWith('https://www.blogger.com/blogger.g?blogID=')) {
        return false
      }
      else {
        return true
      }
    },
    disableOpenEditURL: function () {
      if (this.editURL.startsWith('https://www.blogger.com/blogger.g?blogID=')
              && this.editURL.indexOf('postID=') > -1) {
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
        return
      }
      
      this.postId = post.id
      this.editURL = post.editURL
      this.publicURL = post.publicURL
      
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
      SummerNoteCode.CopyCodeClick()
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
      
      this.postTitle = post.title
      this.postLabels = post.labels
      this.editURL = post.editURL
      this.publicURL = post.publicURL
      this.resetUploadInput()
      this.close()
      return this
    },
    resetUploadInput: function () {
      this.getUI().find('input:file[name="uploadPosts"]').val('')
    },
  }
}

export default config