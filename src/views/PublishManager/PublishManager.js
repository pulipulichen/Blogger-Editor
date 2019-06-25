import SummerNoteCode from './../EditorManager/SummerNote/SummerNoteCode.js'

let config = {
  data: function () {
    return {
      name: 'PublishManager',
      ui: undefined,
      bloggerConsoleURL: "https://www.blogger.com",
      editURL: "",
      publicURL: "",
      postTitle: "",
      postLabels: "",
      filesystemImageCount: 0
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
        FunctionHelper.triggerCallback(callback)
        return
      }
      
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
      console.log([key, value])
      pm.updateEditingPost(key, value)
    },
    popup: function (name) {
      let url = this[name]
      WindowHelper.popup(url, name)
    },
    openImageReplacer: function () {
      $v.EditorManager.ImageReplacer.open()
    },
    downloadPostBackup: function () {
      $v.PostManager.backupPost()
    },
    changePostMetadata: function () {
      let fieldPostTitle = $v.EditorManager.FieldPostTitle
      fieldPostTitle.set(this.postTitle)
      
      let fieldPostLabels = $v.EditorManager.FieldPostLabels
      fieldPostLabels.set(this.postLabels)
    },
    copyInput: function (event) {
      //console.log(event)
      let button = event.target
      let text = $(button).parents('.ui.input:first').find('input').val()
      //console.log(text)
      CopyPasteHelper.copyPlainText(text)
    },
    copyHTML: function () {
      SummerNoteCode.CopyCodeClick()
    }
  }
}

export default config