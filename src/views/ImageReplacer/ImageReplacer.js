import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
//var FileSaver = require('file-saver');

var config = {
  //name: "main-content",
  data: function () {
    return {
      ui: undefined,
      currentStep: 0,
      isCreatingImagePackage: false,
      imageHTML: '',
      disableReplaceImage: true,
      replacedImageCount: 0,
      filesystemImageCount: 0,
      disableUploadImageDraft: false,
      FieldPostBody: null
    }
  },
  created: function () {
    $v.ImageReplacer = this
    $(() => {
      this.validateHasFileSystemImage()
      //this.open()
    })
    this.FieldPostBody = $v.EditorManager.FieldPostBody
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = this.ui = $('.ImageReplacer.ui.modal')
      }
      return this.ui
    },
    open: function () {
      // check post img
      this.validateHasFileSystemImage()
      this.disableUploadImageDraft = $v.EditorManager.disableUploadImageDraft
      
      this.getUI().modal('show')
    },
    validateHasFileSystemImage: function () {
      if (FieldPostBody.hasFileSystemImage()) {
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
        let name = BloggerImageHelper.getFilename(link)
        output[name] = link
      })
      return output
    },
    replaceImage: function () {
      let imageList = this.parseImageHTMLList()
      this.replacedImageCount = FieldPostBody.setImageList(imageList)
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
          let folderName = `post-${id}-images`
          let folder = zip.folder(folderName);

          let loop = (i) => {
            if (i < list.length) {
              let path = list[i]
              let name = FileSystemHelper.getFileName(path)
              //console.log([name, path])
              JSZipUtils.getBinaryContent(path, (err, data) => {
                //console.log(data)
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
    prevStep: function () {
      this.currentStep--
    },
    nextStep: function () {
      this.currentStep++
    },
    openBloggerDraft: function () {
      $v.EditorManager.openBloggerDraft()
    },
    openBloggerDraftSetting: function () {
      $v.EditorManager.open('#uploadImageDraft')
    }
  }
}

//window.EditorManager = EditorManager
export default config