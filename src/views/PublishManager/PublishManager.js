let config = {
  data: function () {
    return {
      name: 'PublishManager',
      ui: undefined,
      bloggerConsoleURL: "https://www.blogger.com",
      editURL: "",
      publicURL: ""
    }
  },
  mounted: function () {
    VueHelper.mountLocalStorage(this, 'bloggerConsoleURL')
  },
  computed: {
    enableOpenBloggerConsole: function () {
      if (this.bloggerConsoleURL === 'https://www.blogger.com'
            || this.bloggerConsoleURL.startsWith('https://www.blogger.com/blogger.g?blogID=')) {
        return ''
      }
      else {
        return 'disabled'
      }
    },
    enableOpenEditURL: function () {
      if (this.editURL.startsWith('https://www.blogger.com/blogger.g?blogID=')
              && this.editURL.indexOf('postID=') > -1) {
        return ''
      }
      else {
        return 'disabled'
      }
    },
    enableOpenPublicURL: function () {
      if (this.publicURL.startsWith('http')
              || this.publicURL.startsWith('//')) {
        return ''
      }
      else {
        return 'disabled'
      }
    }
  },
  created: function () {
    $v[this.name] = this
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
      this.init(() => {
        this.getUI().modal('show')
      })
    },
    close: function () {
      this.getUI().modal('hide')
    },
    init: function(callback) {
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
    }
  }
}

export default config