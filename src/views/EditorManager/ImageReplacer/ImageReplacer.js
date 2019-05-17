import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
//var FileSaver = require('file-saver');

import FieldPostBody from './../FieldPostBody.js'

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
      skipTutorial: false,
      debugEnableReplace: false
    }
  },
  mounted: function () {
    VueHelper.mountLocalStorageBoolean(this, 'skipTutorial')
  },
  created: function () {
    $v.ImageReplacer = this
    $(() => {
      this.validateHasFileSystemImage()
      //this.open()
    })
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
      this.disableUploadImageDraft = $v.EditorManager.disableUploadImageDraft
      
      this.getUI().modal('show')
      this.getUI().find('.ui.checkbox').checkbox()
    },
    validateHasFileSystemImage: function () {
      if (FieldPostBody.hasFileSystemImage()) {
        this.filesystemImageCount = FieldPostBody.countFileSystemImage()
        this.currentStep = 1
        return true
      }
      else {
        this.currentStep = 0
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
      this.disableReplaceImage = (html.find('a[href*="/s1600/"][imageanchor]:first').length === 0)
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
        output[name] = link
      })
      return output
    },
    replaceImage: function () {
      let imageList = this.parseImageHTMLList()
      if (this.debugEnableReplace === true) {
        this.replacedImageCount = FieldPostBody.setImageList(imageList)
      }
      else {
        this.replacedImageCount = 0
      }
      this.filesystemImageCount = FieldPostBody.countFileSystemImage()
      
      //this.close()
      
      this.imageHTML = ''
      this.validateImageHTML()
      this.nextStep()
    },
    close: function () {
      this.getUI().modal('hide')
    },
    downloadImagePackage: function (callback) {
      this.isCreatingImagePackage = true
      let list = FieldPostBody.getImageList()
      //console.log(list)
      if (list.length > 0) {
        
        $v.PostManager.getEditingPostId((id) => {
          let zip = new JSZip();
          let nowFormat = DayjsHelper.nowFormat()
          let folderName = `post-${id}-images-${nowFormat}`
          let folder = zip.folder(folderName);

          let loop = (i) => {
            if (i < list.length) {
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
              zip.generateAsync({type: "blob"}).then((content) => {
                // see FileSaver.js
                  saveAs(content, `${folderName}.zip`)
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
      if (this.skipTutorial === true 
              && this.currentStep === 6) {
        this.currentStep = 1
      }
      else {
        this.currentStep-- 
      }
    },
    nextStep: function () {
      if (this.skipTutorial === true 
              && this.currentStep === 1) {
        this.currentStep = 6
      }
      else {
        this.currentStep++
      }
    },
    openBloggerDraft: function () {
      $v.EditorManager.openBloggerDraft()
    },
    openBloggerDraftSetting: function () {
      $v.EditorManager.open('#uploadImageDraft')
    },
    persist() {
      VueHelper.persistLocalStorage(this, 'skipTutorial')
    },
    setDemoHTML() {
      this.imageHTML = `<a href="http://2.bp.blogspot.com/-B-4VIGgfDOY/XN1rwagJWaI/AAAAAAAEPtA/Nwa532uvs_E0otP908b1SW4XWPrOrfRfACK4BGAYYCw/s1600/1-Webpack%2B_%25282%2529.png" imageanchor="1"><img border="0" height="180" src="https://2.bp.blogspot.com/-B-4VIGgfDOY/XN1rwagJWaI/AAAAAAAEPtA/Nwa532uvs_E0otP908b1SW4XWPrOrfRfACK4BGAYYCw/s320/1-Webpack%2B_%25282%2529.png" width="320" /></a><a href="http://2.bp.blogspot.com/-Ycwe6jm8OyM/XN1rwXpRgRI/AAAAAAAEPs4/NRb5VFc5dfIM6BjlBJ4LnAnOY2NTcfRGwCK4BGAYYCw/s1600/1-Webpack_2.png" imageanchor="1"><img border="0" height="180" src="https://2.bp.blogspot.com/-Ycwe6jm8OyM/XN1rwXpRgRI/AAAAAAAEPs4/NRb5VFc5dfIM6BjlBJ4LnAnOY2NTcfRGwCK4BGAYYCw/s320/1-Webpack_2.png" width="320" /></a>`
      this.validateImageHTML()
    }
  }
}

//window.EditorManager = EditorManager
export default config