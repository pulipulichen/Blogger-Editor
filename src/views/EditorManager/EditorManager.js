/*
require('./views/EditorManager/FieldPostBody.js')
require('./views/EditorManager/FieldPostLabels.js')
require('./views/EditorManager/FieldPostTitle.js')
require('./views/EditorManager/FieldPostDate.js')
require('./views/EditorManager/SummerNoteButtons.js')
require('./views/EditorManager/SummerNoteCallbacks.js')
require('./views/EditorManager/SummerNoteConfig.js')
*/
import FieldPostBody from './FieldPostBody.js'
import FieldPostLabels from './FieldPostLabels.js'
import FieldPostTitle from './FieldPostTitle.js'
import FieldPostDate from './FieldPostDate.js'

import ImageReplacerSfc from './ImageReplacer/ImageReplacer.vue'

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
      imageSizeDefault: 450,
      FieldPostBody: FieldPostBody,
      FieldPostLabels: FieldPostLabels,
      FieldPostTitle: FieldPostTitle,
      FieldPostDate: FieldPostDate,
      ImageReplacer: null
    }
  },
  mounted() {
    VueHelper.mountLocalStorage(this, 'uploadImageDraft')
    VueHelper.mountLocalStorage(this, 'imageSizeDefault')
  },
  created: function () {
    $v.EditorManager = this
    
    VueHelper.init(ImageReplacerSfc, (vue) => {
      this.ImageReplacer = vue
      this.validateUploadImageDrarfUrl()
    })
    
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
      
      FieldPostBody.init()
      FieldPostTitle.init()
      FieldPostLabels.init()
      
      this.setupPostData(callback)
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
      
      FieldPostTitle.save()
      FieldPostLabels.save()
      FieldPostBody.save()
      
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