/*
require('./views/EditorManager/FieldPostBody.js')
require('./views/EditorManager/FieldPostLabels.js')
require('./views/EditorManager/FieldPostTitle.js')
require('./views/EditorManager/FieldPostDate.js')
require('./views/EditorManager/SummerNoteButtons.js')
require('./views/EditorManager/SummerNoteCallbacks.js')
require('./views/EditorManager/SummerNoteConfig.js')
*/
/* global ConfigHelper, VueHelper, FunctionHelper, EventManager, DelayExecHelper, InitHelper, WindowHelper, SemanticUIHelper */

import FieldPostBody from './FieldPostBody.js'
import FieldPostLabels from './FieldPostLabels.js'
import FieldPostTitle from './FieldPostTitle.js'
import FieldPostDate from './FieldPostDate.js'

import SummerNoteConfig from './SummerNote/SummerNoteConfig.js'
import SummerNoteSpeak from './SummerNote/SummerNoteSpeak.js'

//import EditorManagerCache from './EditorManagerCache.js'
import EditorManagerConfig from './EditorManagerConfig.js'

import ImageReplacerSfc from './ImageReplacer/ImageReplacer.vue'
import IframePromptSfc from './IframePrompt/IframePrompt.vue'
import FileUploaderSfc from './FileUploader/FileUploader.vue'
import CodeInserterSfc from './CodeInserter/CodeInserter.vue'
import OutlineNavigatorSfc from './OutlineNavigator/OutlineNavigator.vue'
import SnippetInserterSfc from './SnippetInserter/SnippetInserter.vue'
import SaveIndicatorSfc from './SaveIndicator/SaveIndicator.vue'
import GoogleDocLinkBuilderSfc from './GoogleDocLinkBuilder/GoogleDocLinkBuilder.vue'

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
      summerNoteConfigToolbar: '',
      summerNoteConfigStyleTags: '',
      summerNoteConfigLabels: '',
      $summerNoteConfigLabelsSearch: null,
      enableOCRImageFilename: true,
      enableOCRImageAlt: false,
      OCRImageLang: 'chi_tra+eng',
      onCloseReload: false,
      enableTypeWriterSoundEffect: true,
      speakRate: 1.5,
      ImageUploadDraft: 'https://www.blogger.com/blog/post/edit/16607461/8994542276547065',
      PhotoRepository: '',
      CommentAnchor: '#comment-form-iframe',
      
      FieldPostBody: FieldPostBody,
      FieldPostLabels: FieldPostLabels,
      FieldPostTitle: FieldPostTitle,
      FieldPostDate: FieldPostDate,
      SummerNoteConfig: SummerNoteConfig,
      
      //EditorManagerCache: EditorManagerCache,
      EditorManagerConfig: EditorManagerConfig,
      
      ImageReplacer: null,
      IframePrompt: null,
      FileUploader: null,
      CodeInserter: null,
      OutlineNavigator: null,
      SnippetInserter: null,
      SaveIndicator: null,
      GoogleDocLinkBuilder: null,
    }
  },
  mounted() {
    VueHelper.mountLocalStorageBoolean(this, 'enableOCRImageFilename')
    VueHelper.mountLocalStorageBoolean(this, 'enableOCRImageAlt')
    VueHelper.mountLocalStorage(this, 'uploadImageDraft')
    VueHelper.mountLocalStorage(this, 'PhotoRepository')
    VueHelper.mountLocalStorage(this, 'CommentAnchor')
    
    VueHelper.mountLocalStorage(this, 'OCRImageLang')
    VueHelper.mountLocalStorageInt(this, 'imageSizeDefault')
    
    VueHelper.mountLocalStorage(this, 'summerNoteConfigToolbar')
    VueHelper.mountLocalStorage(this, 'summerNoteConfigStyleTags')
    VueHelper.mountLocalStorage(this, 'summerNoteConfigLabels')
    
    VueHelper.mountLocalStorageBoolean(this, 'enableTypeWriterSoundEffect')
    
    VueHelper.mountLocalStorageNumber(this, 'speakRate')
    
    //console.log(this.enableTypewriterSoundEffect)
    
    this.initLabelsSearch()
    this.checkOCRThreshold()
    this.initKeyBinds()
  },
  created: function () {
    $v.EditorManager = this
    
    this.validateUploadImageDrarfUrl()
    
    if (ConfigHelper.get('debug').disableImageReplacer === false) {
      VueHelper.init(ImageReplacerSfc, (vue) => {
        this.ImageReplacer = vue
      })
    }
    
    if (ConfigHelper.get('debug').disableIframePrompt === false) {
      VueHelper.init(IframePromptSfc, (vue) => {
        this.IframePrompt = vue
      })
    }
    
    if (ConfigHelper.get('debug').disableFileUploader === false) {
      VueHelper.init(FileUploaderSfc, (vue) => {
        this.FileUploader = vue
      })
    }
    
    if (ConfigHelper.get('debug').disableCodeInserter === false) {
      VueHelper.init(CodeInserterSfc, (vue) => {
        this.CodeInserter = vue
      })
    }
    
    if (ConfigHelper.get('debug').disableOutlineNavigator === false) {
      VueHelper.init(OutlineNavigatorSfc, (vue) => {
        this.OutlineNavigator = vue
      })
    }
    
    if (ConfigHelper.get('debug').disableSnippetInserter === false) {
      VueHelper.init(SnippetInserterSfc, (vue) => {
        this.SnippetInserter = vue
      })
    }
    
    if (ConfigHelper.get('debug').disableSaveIndicator === false) {
      VueHelper.init(SaveIndicatorSfc, (vue) => {
        this.SaveIndicator = vue
      })
    }
    
    if (ConfigHelper.get('debug').disableGoogleDocLinkBuilder === false) {
      VueHelper.init(GoogleDocLinkBuilderSfc, (vue) => {
        this.GoogleDocLinkBuilder = vue
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
    labelsList: function () {
      let list = []
      this.summerNoteConfigLabels.trim().split('\n').forEach((label) => {
        label = label.trim()
        if (label !== '') {
          list.push(label)
        }
      })
      return list
    },
    summernote () {
      return $('#summernotePostBody')
    },
    isImageUploadDraftValid () {
      if (typeof(this.ImageUploadDraft) !== 'string'
        && !this.ImageUploadDraft.startsWith('https://www.blogger.com/blog/post/edit/')
        && this.ImageUploadDraft.split('/').length !== 8) {
        return false
      }
      return true
    },
    isPhotoRepositoryValid () {
      if (typeof(this.PhotoRepository) === 'string') {
        try {
          new URL(this.PhotoRepository)
          return true
        }
        catch (e) {
          return false
        }
      }
      return false
    }
  },
  watch: {
    uploadImageDraft: function (value) {
      this.validateUploadImageDrarfUrl()
      
      EventManager.trigger(this, 'disableUploadImageDraftChanged')
    },
    OCRImageLang: function (value) {
      EventManager.trigger(this, 'OCRImageLangChanged')
    },
    enableTypeWriterSoundEffect () {
      this.setEnableTypeWriterSoundEffect()
    },
    speakRate () {
      let label = SummerNoteSpeak.getRateLabel()
      if (!label) {
        return false
      }
      //console.log(label, this.speakRate)
      label.html(this.speakRate + this.$t('x'))
    }
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $('.EditorManager.ui.modal')
        this.ui.find('.ui.checkbox').checkbox()
      }
      return this.ui
    },
    open: function (focusSelector) {
      //console.log(this.data)
      this.getUI().modal('show')
      if (typeof(focusSelector) === 'string') {
        $(() => {
          $(focusSelector).focus()
        })
      }
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
    validateUploadImageDrarfUrl: function (url) {
      if (typeof(url) === 'string') {
        url = url.trim()
        //return !url.startsWith('https://www.blogger.com/blogger.g?blogID=')
        return !url.startsWith('https://www.blogger.com/blog/posts/')
      }
      else {
        //this.disableUploadImageDraft = !this.uploadImageDraft.startsWith('https://www.blogger.com/blogger.g?blogID=')
        this.disableUploadImageDraft = !this.uploadImageDraft.startsWith('https://www.blogger.com/blog/posts/')
        //console.log(this.disableUploadImageDraft)
        return this.disableUploadImageDraft
      }
    },
    persist() {
      //localStorage.uploadImageDraft = this.uploadImageDraft;
      //console.log('now pretend I did more stuff...');
      
      VueHelper.persistLocalStorage(this, 'enableOCRImageFilename')
      VueHelper.persistLocalStorage(this, 'enableOCRImageAlt')
      VueHelper.persistLocalStorage(this, 'OCRImageLang')
      VueHelper.persistLocalStorage(this, 'uploadImageDraft')
      VueHelper.persistLocalStorage(this, 'PhotoRepository')
      VueHelper.persistLocalStorage(this, 'CommentAnchor')
      
      VueHelper.persistLocalStorage(this, 'imageSizeDefault')
      
      VueHelper.persistLocalStorage(this, 'summerNoteConfigToolbar')
      VueHelper.persistLocalStorage(this, 'summerNoteConfigStyleTags')
      VueHelper.persistLocalStorage(this, 'summerNoteConfigLabels')
      
      VueHelper.persistLocalStorage(this, 'enableTypeWriterSoundEffect')
      VueHelper.persistLocalStorage(this, 'speakRate')
    },
    init: function (callback) {
      if (ConfigHelper.get('debug').disableEditorManager === true) {
        return FunctionHelper.triggerCallback(callback)
      }
      
      /*
      if (this.OutlineNavigator !== null) {
        this.OutlineNavigator.init()
      }
      */
      
      this.EditorManagerConfig.init(this)
      
      EventManager.on($v.PostManager, 'open', () => {
        this.save()
      })
      
      $(window).bind('beforeunload', (event) => {
        if (DelayExecHelper.isWaiting()) {
          DelayExecHelper.forceExec()
          //event.returnValue = 'OK'
          //return 'OK'
          return false
        }
      })
      
      let t = (key) => {
        return this.$t(key)
      }
      
      FieldPostTitle.init(t, () => {
        FieldPostLabels.init(t, () => {
          FieldPostBody.init(t, () => {
            this.setupPostData(callback)
          })
        })
      })
    },
    reload: function (callback) {
      FieldPostDate.reset()
      //console.log('FieldPostTitle.reload')
      FieldPostTitle.reload(() => {
        //console.log('FieldPostBody.reload')
        FieldPostBody.reload(() => {
          //console.log('FieldPostLabels.reload')
          FieldPostLabels.reload(() => {
            //console.log('EditorManager.reload()')
            //console.log(callback)
            this.setupPostData(callback)
          })
        })
      })
    },
    setupPostData: function (callback) {
      $v.PostManager.getPost((post) => {
        if (post !== undefined) {
          FieldPostTitle.set(post.title)
          FieldPostLabels.set(post.labels)
          FieldPostDate.set(post.updateUnix)
        }
        
        $v.PostManager.getPostBody((postBody) => {
          if (postBody !== undefined) {
            FieldPostBody.set(postBody)
          }
          
          this.setEnableTypeWriterSoundEffect()
          
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
      
      if (force === false) {
        DelayExecHelper.forceExec()
        FunctionHelper.triggerCallback(callback)
        return undefined
      }
      
      //console.log('title save')
      FieldPostDate.set()
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
    openImageUploadDraft () {
      WindowHelper.popup(this.ImageUploadDraft, 'image-upload-draft')
    },
    openPhotoRepository () {
      WindowHelper.popup(this.PhotoRepository, 'photo-repository-draft')
    },
    openImageReplacer: function () {
      this.ImageReplacer.open()
    },
    openTab: function (e) {
      SemanticUIHelper.openTab(e)
    },
    configDownload: function () {
      return this.EditorManagerConfig.configDownload()
    },
    triggerConfigUpload: function (e) {
      $(e.target).parent().children('input:file:first').click()
    },
    configUpload: function (e) {
      return this.EditorManagerConfig.configUpload(e)
    },
    configDrop: function (e) {
      return this.EditorManagerConfig.configDrop(e)
    },
    setChanged: function () {
      this.onCloseReload = true
    },
    setLabelsChanged: function () {
      this.initLabelsSearch()
      this.setChanged()
    },
    initLabelsSearch: function () {
      let content = []
      this.labelsList.forEach((label) => {
        content.push({
          title: label
        })
      })
      /*
      var content = [
  { title: 'Andorra' },
  { title: 'United Arab Emirates' },
  { title: 'Afghanistan' },
  { title: 'Antigua' },
  { title: 'Anguilla' },
  { title: 'Albania' },
  { title: 'Armenia' }]
      $('#summerNoteConfigLabelsSearch')
  .search({
    source: content
  })
  */
      
      if (this.$summerNoteConfigLabelsSearch === undefined 
              || this.$summerNoteConfigLabelsSearch === null) {
        this.$summerNoteConfigLabelsSearch = $(this.$refs.summerNoteConfigLabelsSearch)
      }
      //console.log(content)
      this.$summerNoteConfigLabelsSearch.search({
        source: content
      })
    },
    addLabel: function (label) {
      if (typeof(label) !== 'string') {
        return this
      }
      else {
        label = label.trim()
      }
      let labelsList = this.labelsList
      if (labelsList.indexOf(label) === -1) {
        labelsList.push(label)
        labelsList.sort()
        this.summerNoteConfigLabels = labelsList.join('\n')
        this.persist()
      }
      
      $v.EditorManager.FieldPostLabels.addSummernoteItem(label)
    },
    checkOCRThreshold: function () {
      //console.log('checkOCRThreshold')
      
      let thresholdMB = ConfigHelper.get('enableOCRMemoryThresholdMB')
      let threshold = thresholdMB * 1024 * 1024
      if (window.performance.memory.totalJSHeapSize < threshold) {
        this.enableOCRImageFilename = false
        this.enableOCRImageAlt = false
        console.log('disable OCR')
      }
      
      return this
    },
    setEnableTypeWriterSoundEffect () {
      //console.log('設定', this.enableTypeWriterSoundEffect)
      this.FieldPostBody.get().summernote('setOption', {
        enableTypeWriterSoundEffect: this.enableTypeWriterSoundEffect
      })
    }
  }
}

import EditorManagerMethodsKeyBindings from './EditorManagerMethodsKeyBindings.js'
EditorManagerMethodsKeyBindings(EditorManager)

//window.EditorManager = EditorManager
export default EditorManager
