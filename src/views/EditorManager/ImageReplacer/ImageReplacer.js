/* global VueHelper, DayjsHelper, EventManager, FunctionHelper, BloggerImageHelper, FileSystemHelper, WindowHelper */

import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
//var FileSaver = require('file-saver');

import FieldPostBody from './../FieldPostBody.js'

import ImageReplacerRemapping from './ImageReplacerRemapping/ImageReplacerRemapping.vue'

var config = {
  //name: "main-content",
  data: function () {
    return {
      name: "ImageReplacer",
      ui: undefined,
      currentStep: 0,
      isCreatingImagePackage: false,
      imageHTML: '',
      disableReplaceImage: true,
      replacedImageCount: 0,
      filesystemImageCount: 0,
      disableUploadImageDraft: false,
      FieldPostBody: null,
      skipTutorial: true,
      debugEnableReplace: true,
      countdownSecond: 0,
      countdownMaxSecond: 25,
      countdownTimer: null,
      countdownSound: null,
      batchLimit: 6
    }
  },
  components: {
    ImageReplacerRemapping
  },
  mounted: function () {
    VueHelper.mountLocalStorageBoolean(this, 'skipTutorial')
  },
  computed: {
    countdownButton: function () {
      if (this.countdownSecond === 0) {
        return this.$t('Start countdown {sec} second', {
          sec: this.countdownMaxSecond
        })
      }
      else {
        let data = {
          sec: this.countdownSecond
        }
        if (this.countdownSecond > 1) {
          return this.$t('Remain {sec} seconds', data)
        }
        else {
          return this.$t('Remain {sec} second', data)
        }
      }
    }
  },
  created: function () {
    $v.ImageReplacer = this
    $(() => {
      this.validateHasFileSystemImage()
      //this.open()
      EventManager.on($v.EditorManager, 'disableUploadImageDraftChanged', (EditorManager) => {
        this.disableUploadImageDraft = EditorManager.disableUploadImageDraft
      })
    })
  },
  watch: {
    currentStep (currentStep) {
      // if (currentStep === 7) {
      //   console.log([currentStep, this.disableReplaceImage, FieldPostBody.getImageList()])
      // }
        
      if (currentStep === 7 && 
          this.disableReplaceImage === false && 
          FieldPostBody.getImageList().length === 1) {
        // setTimeout(() => {
          // this.currentStep++
        // }, 3000)
        let imageList = this.$refs.ImageReplacerRemapping.getImageList()
        if (Object.keys(imageList).length > 0) {
          this.replaceImage()
        }
      } 
    }
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = this.ui = $('.ImageReplacer.ui.modal')
        //this.ui.find('.ui.checkbox').checkbox()
      }
      return this.ui
    },
    open: function () {
      // check post img
      this.validateHasFileSystemImage()
      //this.disableUploadImageDraft = $v.EditorManager.disableUploadImageDraft
      this.disableUploadImageDraft = $v.PublishManager.disableOpenEditURL
      
      this.getUI().modal('show')
      this.getUI().find('.ui.checkbox').checkbox()
      this.downloadImagePackage()
    },
    validateHasFileSystemImage: function (callback) {
      if (FieldPostBody.hasFileSystemImage()) {
        this.filesystemImageCount = FieldPostBody.countFileSystemImage()
        EventManager.trigger(this, 'onFilesystemImageCountChange')
        //console.log(['ImageReplacer', this.filesystemImageCount])
        this.currentStep = 1
        FunctionHelper.triggerCallback(callback)
        return true
      }
      else {
        this.currentStep = 0
        FunctionHelper.triggerCallback(callback)
        return false
      }
    },
    validateImageHTML: function () {
      //console.log(this.imageHTML)
      if (this.imageHTML.trim() === "") {
        this.disableReplaceImage = true
        return this.disableReplaceImage
      }
      
      let html = $('<div>' + this.imageHTML + '</div>')
      this.disableReplaceImage = (html.find('a[href*=".com/"]:first').length === 0)
      return this.disableReplaceImage      
    },
    parseImageHTMLList: function () {
      let output = {}
      $('<div>' + this.imageHTML + '</div>').find('a[href]').each((i, aTag) => {
        let link = aTag.href
        /*
        if (link.startsWith('http://')) {
          link = link.slice(7)
        }
        if (link.startsWith('https://')) {
          link = link.slice(8)
        }
        */
        let name = BloggerImageHelper.getFilename(link)
        if (typeof(output[name]) === 'string') {
          console.log(['duplicate name', name, link])
        }
        else {
          output[name] = link
        }
        
        if (name.indexOf('__') > -1) {
          let nameCompact = name.replace(/__/g, '_')
          if (typeof(output[nameCompact]) === 'string') {
            console.log(['duplicate name', nameCompact, link])
          }
          else {
            output[nameCompact] = link
          }
        }
        
        if (name.indexOf('__1.jpg') > -1) {
          // 3._.jpg
          // 3.__1.jpg
          let nameCompact = name.replace('__1.jpg', '_.jpg')
          if (typeof(output[nameCompact]) === 'string') {
            console.log(['duplicate name', nameCompact, link])
          }
          else {
            output[nameCompact] = link
          }
        }
        else if (name.endsWith('_1.jpg')) {
          // 3._.jpg
          // 3.__1.jpg
          let nameCompact = name.replace('_1.jpg', '.jpg')
          if (typeof(output[nameCompact]) === 'string') {
            console.log(['duplicate name', nameCompact, link])
          }
          else {
            output[nameCompact] = link
          }
        }
      })
      //console.log(output)
      return output
    },
    replaceImage: function () {
      //let imageList = this.parseImageHTMLList()
      let imageList = this.$refs.ImageReplacerRemapping.getImageList()
      
      // 20220306-1259 Pulipuli Chen 看來應該是正確的
      //console.log(imageList)
      
      if (this.debugEnableReplace === true) {
        this.replacedImageCount = FieldPostBody.setImageList(imageList)
      }
      else {
        this.replacedImageCount = 0
      }
      this.filesystemImageCount = FieldPostBody.countFileSystemImage()
      EventManager.trigger(this, 'onFilesystemImageCountChange')
      
      //this.close()
      
      this.imageHTML = ''
      this.validateImageHTML()
      this.nextStep()
    },
    close: function () {
      this.isCreatingImagePackage = false
      this.getUI().modal('hide')
    },
    downloadImagePackage: function (callback) {
      this.isCreatingImagePackage = true
      let list = FieldPostBody.getImageList()
      //console.log(list)
      if (list.length > 1) {
        let folder
        let folderCounter = 0
        let folderFilesLimit = this.batchLimit
        $v.PostManager.getEditingPostId((id) => {
          let zip = new JSZip();
          let nowFormat = DayjsHelper.nowFormat()
          let baseFolderName = `images-${id}-${nowFormat}`
          //folder = zip.folder(folderName);

          let loop = (i) => {
            if (i < list.length) {
              if (list.length > folderFilesLimit) {
                if (i % folderFilesLimit === 0) {
                  folderCounter++
                  let folderName = `post-${id}-images-${nowFormat}-${folderCounter}`
                  folder = zip.folder(folderName);
                } 

                let path = list[i]
                let name = FileSystemHelper.getFileName(path)
                //console.log([name, path])
                JSZipUtils.getBinaryContent(path, (err, data) => {
                  //console.log(data)
                  name = decodeURIComponent(name)
                  folder.file(name, data)
                  i++
                  loop(i)
                })
              }
              else {
                let path = list[i]
                let name = FileSystemHelper.getFileName(path)
                //console.log([name, path])
                JSZipUtils.getBinaryContent(path, (err, data) => {
                  //console.log(data)
                  name = decodeURIComponent(name)
                  zip.file(name, data)
                  i++
                  loop(i)
                })
              }
            }
            else {
              zip.generateAsync({type: "blob"}).then((content) => {
                // see FileSaver.js
                  saveAs(content, `${baseFolderName}.zip`)
                  this.isCreatingImagePackage = false
                  FunctionHelper.triggerCallback(callback)
              })
            }
          }
          loop(0)
        })
        
        /*
        zip.file("smile.gif", imgData, {base64: true});

        zip.generateAsync({type:"blob"}).then(function(content) {
            // see FileSaver.js
            saveAs(content, "example.zip");
        });
        */

      }
      else if (list.length === 1) {
        let path = list[0]
        let name = FileSystemHelper.getFileName(path)
        saveAs(path, name)
      }
      else {
        this.isCreatingImagePackage = false
        FunctionHelper.triggerCallback(callback)
      }
    },
    downloadImagePackageAndBackPrevStep: function () {
      this.downloadImagePackage(() => {
        this.prevStep()
      })
    },
    prevStep: function () {
      if (this.skipTutorial === true && 
          this.currentStep === 6) {
        this.currentStep = 1
      }
      else {
        this.currentStep-- 
      }
    },
    nextStep: function () {
      if (this.skipTutorial === true && 
          this.currentStep === 1) {
        this.currentStep = 6
      }
      else {
        this.currentStep++
      }
    },
    openBloggerDraft: function () {
      //$v.EditorManager.openBloggerDraft()
      //$v.PublishManager.popup('editURL')
      
      if ($v.PublishManager.publicURL !== '') {
        WindowHelper.popup($v.EditorManager.ImageUploadDraft, 'image-upload-draft')
      }
      else {
        $v.PublishManager.popup('editURL')
      }
      
      return this
    },
    openBloggerDraftSetting: function () {
      //$v.EditorManager.open('#uploadImageDraft')
      this.close(() => {
        this.isCreatingImagePackage = false
        $v.PublishManager.open()
      })
      
      return this
    },
    persist() {
      VueHelper.persistLocalStorage(this, 'skipTutorial')
      return this
    },
    setDemoHTML() {
      this.imageHTML = `<a href="http://2.bp.blogspot.com/-B-4VIGgfDOY/XN1rwagJWaI/AAAAAAAEPtA/Nwa532uvs_E0otP908b1SW4XWPrOrfRfACK4BGAYYCw/s1600/1-Webpack%2B_%25282%2529.png" imageanchor="1"><img border="0" height="180" src="https://2.bp.blogspot.com/-B-4VIGgfDOY/XN1rwagJWaI/AAAAAAAEPtA/Nwa532uvs_E0otP908b1SW4XWPrOrfRfACK4BGAYYCw/s320/1-Webpack%2B_%25282%2529.png" width="320" /></a><a href="http://2.bp.blogspot.com/-Ycwe6jm8OyM/XN1rwXpRgRI/AAAAAAAEPs4/NRb5VFc5dfIM6BjlBJ4LnAnOY2NTcfRGwCK4BGAYYCw/s1600/1-Webpack_2.png" imageanchor="1"><img border="0" height="180" src="https://2.bp.blogspot.com/-Ycwe6jm8OyM/XN1rwXpRgRI/AAAAAAAEPs4/NRb5VFc5dfIM6BjlBJ4LnAnOY2NTcfRGwCK4BGAYYCw/s320/1-Webpack_2.png" width="320" /></a>`
      this.validateImageHTML()
    },
    startCountdown: function () {
      if (this.countdownSecond > 0) {
        clearTimeout(this.countdownTimer)
        this.countdownSecond = 0
        return undefined
      }
      
      this.countdownSecond = this.countdownMaxSecond
      
      let loop = () => {
        if (this.countdownSecond > 0) {
          this.countdownTimer = setTimeout(() => {
            this.countdownSecond--
            loop()
          }, 1000)
        }
        else {
          if (this.countdownSound === null) {
            this.countdownSound = new Audio('static/freesound/91926__tim-kahn__ding.ogg')
          }
          this.countdownSound.play()
        }
      }
      loop()
    }
  }
}

//window.EditorManager = EditorManager
export default config