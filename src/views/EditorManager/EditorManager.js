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

import SummerNoteConfig from './SummerNoteConfig.js'

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
      SummerNoteConfig: SummerNoteConfig,
      summerNoteConfigToolbar: '',
      summerNoteConfigStyleTags: '',
      ImageReplacer: null,
      onCloseReload: false
    }
  },
  mounted() {
    VueHelper.mountLocalStorage(this, 'uploadImageDraft')
    VueHelper.mountLocalStorage(this, 'imageSizeDefault')
    
    VueHelper.mountLocalStorage(this, 'summerNoteConfigToolbar')
    VueHelper.mountLocalStorage(this, 'summerNoteConfigStyleTags')
    
  },
  created: function () {
    $v.EditorManager = this
    
    this.validateUploadImageDrarfUrl()
    
    if (ConfigHelper.get('debug').disableImageReplacer === false) {
      VueHelper.init(ImageReplacerSfc, (vue) => {
        this.ImageReplacer = vue
      })
    }
    
    //this.open()
  },
  computed: {
    toolbarJSON: function () {
      let config = SummerNoteConfig.defaultToolbar()
      return JSON.stringify(config)
    },
    styleTagsJSON: function () {
      let config = SummerNoteConfig.defaultStyleTags()
      return JSON.stringify(config)
    },
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
      this.onCloseReload = false
    },
    close: function () {
      //this.getUI().modal('hide')
      
      if (this.onCloseReload === true) {
        this.onCloseReload = false
        InitHelper.reload(() => {
          this.getUI().modal('hide')
        })
      }
      else {
        this.getUI().modal('hide')
      }
      
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
      
      VueHelper.persistLocalStorage(this, 'summerNoteConfigToolbar')
      VueHelper.persistLocalStorage(this, 'summerNoteConfigStyleTags')
    },
    init: function (callback) {
      if (ConfigHelper.get('debug').disableEditorManager === true) {
        return FunctionHelper.triggerCallback(callback)
      }
      
      FieldPostTitle.init(() => {
        FieldPostBody.init(() => {
          FieldPostLabels.init(() => {
            this.setupPostData(callback)
          })
        })
      })
    },
    reload: function (callback) {
      FieldPostDate.reset()
      FieldPostTitle.reload(() => {
        FieldPostBody.reload(() => {
          FieldPostLabels.reload(() => {
            this.setupPostData(callback)
          })
        })
      })
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
    save: function (force, callback) {
      if (typeof(force) === 'function') {
        callback = force
        force = false
      }
      
      if (force === undefined) {
        force = false
      }
      
      if (force === false && DelayExecHelper.isWaiting()) {
        DelayExecHelper.forceExec()
        FunctionHelper.triggerCallback(callback)
        return
      }
      
      //console.log('title save')
      FieldPostTitle.save(() => {
        //console.log('labels save')
        FieldPostLabels.save(() => {
          //console.log('body save')
          FieldPostBody.save(() => {
            DelayExecHelper.clear()
            FunctionHelper.triggerCallback(callback)
          })
        })
      })
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
    },
    openImageReplacer: function () {
      this.ImageReplacer.open()
    },
    openTab: function (e) {
      SemanticUIHelper.openTab(e)
    },
    configDownload: function () {
      //console.log('configDownload')
      
      let config = {
        image: {
          uploadImageDraft: this.uploadImageDraft,
          imageSizeDefault: this.imageSizeDefault
        },
        toolbar: {
          toolbar: this.SummerNoteConfig.toolbar(false),
          styleTags: this.SummerNoteConfig.styleTags(false),
        }
      }
      
      config = JSON.stringify(config)
      FileHelper.save(config, 'editorConfig.json')
    },
    triggerConfigUpload: function (e) {
      $(e.target).parent().children('input:file:first').click()
    },
    configUpload: function (e) {
      let files = e.target.files
      this.readConfig(files)
    },
    configDrop: function (e) {
      //console.log('configDrop')
      let files = e.dataTransfer.files
      this.readConfig(files)
    },
    readConfig: function (files) {
      if (files.length !== 1 
              || files[0].type !== 'application/json') {
        return
      }
      //console.log(files[0])
      
      FileSystemHelper.readEventFilesText(files[0], (config) => {
        //console.log(config)
        config = JSON.parse(config)
        if (typeof(config.image) === 'object') {
          let image = config.image
          if (typeof(image.uploadImageDraft) === 'string') {
            this.uploadImageDraft = image.uploadImageDraft
          }
          if (typeof(image.imageSizeDefault) === 'number') {
            this.imageSizeDefault = image.imageSizeDefault
          }
        }
        if (typeof(config.toolbar) === 'object') {
          let toolbar = config.toolbar
          if (Array.isArray(toolbar.toolbar)) {
            this.summerNoteConfigToolbar = JSON.stringify(toolbar.toolbar)
            if (this.summerNoteConfigToolbar === '[]') {
              this.summerNoteConfigToolbar = ''
            }
          }
          if (Array.isArray(toolbar.styleTags)) {
            this.summerNoteConfigStyleTags = JSON.stringify(toolbar.styleTags)
            if (this.summerNoteConfigStyleTags === '[]') {
              this.summerNoteConfigStyleTags = ''
            }
          }
        }
        WindowHelper.alert('Config uploaded')
      })
    },
    setChanged: function () {
      this.onCloseReload = true
    }
  }
}

//window.EditorManager = EditorManager
export default EditorManager