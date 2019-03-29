import dayjs from 'dayjs'
/*
EditorManager = {
  template: `
  <div class="form-group">
    <label for="uploadImageDraft">Upload Image Draft</label>
    <input name="uploadImageDraft" type="text" 
      data-persist="garlic"
      class="form-control" 
      id="uploadImageDraft" aria-describedby="emailHelp" 
      placeholder="https://www.blogger.com/blogger.g?blogID=..." />
    <a href="https://www.blogger.com" target="bloggerManager">
      <small class="form-text text-muted">Open Blogger console</small>
    </a>
  </div>`,
  init: function () {
    $(() => {
      $('#editorManagerModal .modal-body').html(this.template)
    })
  }
}

EditorManager.init()
*/

var EditorManager = {
  //name: "main-content",
  data: function () {
    return {
      ui: undefined,
      uploadImageDraft: '',
      disableUploadImageDraft: true,
      postSummerNote: null,
      titleSummerNote: null,
      labelSUmmerNote: null
    }
  },
  mounted() {
    if (localStorage.getItem('uploadImageDraft')) {
      try {
        this.uploadImageDraft = localStorage.getItem('uploadImageDraft');
      } catch(e) {
        localStorage.removeItem('uploadImageDraft');
      }
    }
  },
  created: function () {
    //return
    $(() => {
      this.getUI().find('.close.icon:first').click(() => {
        //console.log(1)
        this.close()
      })
      
      return
      this.open()
    })   
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        console.log('find ui')
        this.ui = this.ui = $('.EditorManager.ui.modal')
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
    validateUploadImageDrarfUrl: function () {
      this.disableUploadImageDraft = !this.uploadImageDraft.startsWith('https://www.blogger.com/blogger.g?blogID=')
      //console.log(this.disableUploadImageDraft)
    },
    persist() {
      localStorage.uploadImageDraft = this.uploadImageDraft;
      //console.log('now pretend I did more stuff...');
    },
    getPostSummerNoteToolbarConfig: function () {
      let toolbar = [
          ['style', ['style']],
          ['font', ['bold', 'underline', 'clear']],
          ['fontname', ['fontname']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'video']],
          ['view', ['fullscreen', 'codeview', 'help']],
          ['mybutton', ['copyHTML']]
        ]
        
      return toolbar
    },
    getPostSummerNote: function () {
      if (this.postSummerNote === undefined
              || this.postSummerNote === null
              || this.postSummerNote.length === 0) {
        this.postSummerNote = $('#summernotePostBody')
      }
      return this.postSummerNote
    },
    copyCode: function (context) {
      var ui = $.summernote.ui;

      // create button
      var button = ui.button({
        contents: '<i class="code icon"></i> Code',
        tooltip: 'Copy Code',
        click: () => {
          // invoke insertText method with 'hello' on editor module.
          //context.invoke('editor.insertText', 'hello');
          let code = this.getPostSummerNote().summernote('code');
          //console.log(code)

          CopyPasteHelper.copyPlainText(code)
        }
      });

      return button.render();   // return button as jquery object
    },
    getAssetDirPath: function (callback) {
      PostManager.methods.getEditingPostId((id) => {
        let path = `/${id}/assets/`
        FunctionHelper.triggerCallback(callback, path)
      })
    },
    onImageUpload: function (files) {
      // upload image to server and create imgNode...
      //$summernote.summernote('insertNode', imgNode);
      //console.log(files[0])
      this.getAssetDirPath((path) => {
        FileSystemHelper.copy(path, files, (urlList) => {
          //console.log(urlList)
          urlList.forEach(imgUrl => {
            //let imgUrl = urlList[0]
            let name = FileSystemHelper.getFileName(imgUrl)
            let imgNode = $(`<a href="${imgUrl}">
          <img src="${imgUrl}" alt="${name}" title="${name}" />
        </a>`)[0]
            this.getPostSummerNote().summernote('insertNode', imgNode);
          })
        })
      })
    },
    onDrop: function (files) {
      //console.log(files.length)
      
      this.getAssetDirPath((path) => {
        let loop = (i) => {
          if (i < files.length) {
            let file = files[i];
            let type = file.type
            let name = file.name
            //console.log(imageFile)

            FileSystemHelper.copy(path, file, (url) => {
              let node
              if (type.startsWith('image')) {
                node = $(`<a href="${url}">
              <img src="${url}" alt="${name}" title="${name}" />
            </a>`)[0]
              } else {
                node = $(`<a href="${url}">${name}</a>`)[0]
              }
              this.getPostSummerNote().summernote('insertNode', node);

              i++
              loop(i)
            })
          }
        }

        loop(0)
      })
    },
    onPaste: function (e) {
      //console.log('Called event paste');
      //console.log(e)
      var orgEvent = e.originalEvent;
      //console.log(orgEvent.clipboardData.items.length)
      
      this.getAssetDirPath((path) => {
        for (var i = 0; i < orgEvent.clipboardData.items.length; i++) {
          //console.log([orgEvent.clipboardData.items[i].kind
          //  , orgEvent.clipboardData.items[i].type])
          if (orgEvent.clipboardData.items[i].kind === "file"
                  && orgEvent.clipboardData.items[i].type.startsWith('image/')) {
            var imageFile = orgEvent.clipboardData.items[i].getAsFile();
            //imageFile.name = 'test.png'
            //console.log(imageFile.name)
            let filename = dayjs(new Date()).format('YYYY-MMDD-hhmmss') + '.png'
            console.log(path)
            console.log(filename)
            FileSystemHelper.copy(path, imageFile, filename, (imgUrl) => {
              let imgNode = $(`<img src="${imgUrl}" />`)[0]
              this.getPostSummerNote().summernote('insertNode', imgNode);
            })
            e.preventDefault();
            break;
          }
        }
      })
    },
    getPostSummerNoteConfig: function () {
      let config = {
        focus: true, // set focus to editable area after initializing summernote
        disableResizeEditor: true,
        placeholder: 'Post Body',
        toolbar: this.getPostSummerNoteToolbarConfig(),
        buttons: {
          copyHTML: () => {
            this.copyCode()
          }
        },
        //disableDragAndDrop: false,
        callbacks: {
          onImageUpload: (files) => {
            this.onImageUpload(files)
          },
          onDrop: (files) => {
            this.onDrop(files)
          },
          onPaste: (e) => {
            this.onPaste(e)
          },
          onChange: (contents) => {
            DelayExecHelper.exec('postBody', 5, () => {
              PostManager.methods.updateEditingPostBody(contents)
            })
            //console.log('postBody:', contents);
          }
        }
      }
      return config
    },
    getSimpleSummerNoteConfig: function (fieldName) {
      let config = {
        airMode: true,
        placeholder: 'Post Title',
        shortcuts: false,
        disableDragAndDrop: true,
        popover: {
          air: []
        },
        callbacks: {
          onChange: (contents) => {
            DelayExecHelper.exec(fieldName, 3, () => {
              PostManager.methods.updateEditingPost(fieldName, contents)
            })
            //console.log(fieldName + ':', contents);
          }
        }
      }
      return config
    },
    initSummerNote: function () {
      this.getPostSummerNote().summernote(this.getPostSummerNoteConfig());
    
      $('#summernotePostTitle').summernote(this.getSimpleSummerNoteConfig('title'));
      $('#summernotePostLabels').summernote(this.getSimpleSummerNoteConfig('labels'));
    }
  }
}

window.EditorManager = EditorManager
export default EditorManager