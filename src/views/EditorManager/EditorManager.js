var EditorManager = {
  //name: "main-content",
  data: function () {
    return {
      ui: undefined,
      uploadImageDraft: ConfigHelper.get('uploadImageDraft'),
      disableUploadImageDraft: true,
      postSummerNote: null,
      titleSummerNote: null,
      labelsSUmmerNote: null,
      dateContainer: null,
      summerNoteInited: false,
      imageSizeDefault: 450
    }
  },
  mounted() {
    VueHelper.mountLocalStorage(this, 'uploadImageDraft')
    VueHelper.mountLocalStorage(this, 'imageSizeDefault')
  },
  created: function () {
    $v.EditorManager = this
    this.validateUploadImageDrarfUrl()
    //this.open()
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = this.ui = $('.EditorManager.ui.modal')
      }
      return this.ui
    },
    open: function (focusSelector) {
      //console.log(this.data)
      this.getUI().modal('show')
      $(() => {
        $(focusSelector).focus()
      })
    },
    close: function () {
      this.getUI().modal('hide')
    },
    validateUploadImageDrarfUrl: function () {
      this.disableUploadImageDraft = !this.uploadImageDraft.startsWith('https://www.blogger.com/blogger.g?blogID=')
      //console.log(this.disableUploadImageDraft)
      return this.disableUploadImageDraft
    },
    persist() {
      //localStorage.uploadImageDraft = this.uploadImageDraft;
      //console.log('now pretend I did more stuff...');
      VueHelper.persistLocalStorage(this, 'uploadImageDraft')
      VueHelper.persistLocalStorage(this, 'imageSizeDefault')
    },
    init: function (callback) {
      this.initSummerNote()
      this.setupPostData(callback)
    },
    initSummerNote: function () {
      FieldPostBody.init()
      FieldPostTitle.init()
      FieldPostLabels.init()
    },
    setupPostData: function (callback) {
      $v.PostManager.getPost((post) => {
        FieldPostTitle.set(post.title)
        FieldPostLabels.set(post.labels)
        FieldPostDate.set(post.updateUnix)
        
        $v.PostManager.getPostBody((postBody) => {
          FieldPostBody.set(postBody)
          FunctionHelper.triggerCallback(callback)
        })
      })
    },
    save: function (force) {
      if (force === undefined) {
        force = false
      }
      
      if (force === false && DelayExecHelper.isWaiting()) {
        DelayExecHelper.forceExec()
        return
      }
      
      let postTitle = FieldPostTitle.getText()
      $v.PostManager.updateEditingPost('title', postTitle)
      
      let postLabels = FieldPostLabels.getText()
      $v.PostManager.updateEditingPost('labels', postLabels)
      
      let postBody = FieldPostBody.getHTML()
      $v.PostManager.updateEditingPostBody(postBody)
      
      DelayExecHelper.clear()
    },
    openBloggerDraft: function () {
      let url = this.uploadImageDraft
      let name = 'uploadImageDraftWindow'
      WindowHelper.popup(url, name, 900)
    },
    openBloggerConsole: function () {
      let url = 'https://www.blogger.com'
      let name = 'bloggerConsole'
      WindowHelper.popup(url, name)
    }
  }
}

//window.EditorManager = EditorManager
export default EditorManager