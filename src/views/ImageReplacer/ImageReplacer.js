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
      isCreatingImagePackage: false
    }
  },
  created: function () {
    $v.ImageReplacer = this
    $(() => {
      this.open()
    })
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
      //console.log(this.data)
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    },
    downloadImagePackage: function (callback) {
      this.isCreatingImagePackage = true
      let list = $v.EditorManager.getImageList()
      //console.log(list)
      if (list.length > 0) {
        
        let zip = new JSZip();
        
        let loop = (i) => {
          if (i < list.length) {
            let path = list[i]
            let name = FileSystemHelper.getFileName(path)
            //console.log([name, path])
            JSZipUtils.getBinaryContent(path, (err, data) => {
              //console.log(data)
              zip.file(name, data)
              i++
              loop(i)
            })
          }
          else {
            zip.generateAsync({type: "blob"}).then((content) => {
              // see FileSaver.js
              $v.PostManager.getEditingPostId((id) => {
                saveAs(content, `post-${id}-images.zip`)
                this.isCreatingImagePackage = false
                FunctionHelper.triggerCallback(callback)
              })
            });
          }
        }
        loop(0)
        
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
      
    },
    nextStep: function () {
      
    }
  }
}

//window.EditorManager = EditorManager
export default config