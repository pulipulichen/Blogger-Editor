import dayjs from 'dayjs'

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
    //return
    //$(() => {
      
      //this.summerNoteInited = false
      
      this.validateUploadImageDrarfUrl()
      //return
      //this.open()
    //})   
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
    getPostSummerNoteToolbarConfig: function () {
      let toolbar = [
          ['view', ['codeview']],
          ['style', ['style']],
          ['font', ['undo', 'bold', 'underline', 'clear']],
          //['fontname', ['fontname']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']],
          ['insert', ['hr', 'link', 'picture', 'video']],
          ['mybutton', ['copyHTML', 'imageReplacer']],
          ['help', [/*'fullscreen',*/ 'help']]
        ]
        
      return toolbar
    },
    getPostSummerNoteStyleTagsConfig: function () {
      //let styleTags = ['p', 'code', 'h4', 'h5', 'h6']
      let styleTags = [
        this.buildButtonCopyCode()
      ]
        
      return styleTags
    },
    getPostSummerNotePopoverImageConfig: function () {
      return [
        //['imagesize', ['copyHTML', 'imageSize100', 'imageSize50', 'imageSize25']],
        //['float', ['floatLeft', 'floatRight', 'floatNone']],
        ['imagesize', ['imageSizeOriginal', 'imageSizeDefault']],
        ['remove', ['removeMedia']]
      ]
    },
    getPostSummerNote: function () {
      if (this.postSummerNote === undefined
              || this.postSummerNote === null
              || this.postSummerNote.length === 0) {
        this.postSummerNote = $('#summernotePostBody')
      }
      return this.postSummerNote
    },
    getTitleSummerNote: function () {
      if (this.titleSummerNote === undefined
              || this.titleSummerNote === null
              || this.titleSummerNote.length === 0) {
        this.titleSummerNote = $('#summernotePostTitle')
      }
      return this.titleSummerNote
    },
    getLabelsSummerNote: function () {
      if (this.labelsSummerNote === undefined
              || this.labelsSummerNote === null
              || this.labelsSummerNote.length === 0) {
        this.labelsSummerNote = $('#summernotePostLabels')
      }
      return this.labelsSummerNote
    },
    getDateContainer: function () {
      if (this.dateContainer === undefined
              || this.dateContainer === null
              || this.dateContainer.length === 0) {
        this.dateContainer = $('#summernotePostDate')
      }
      return this.dateContainer
    },
    buildButtonCopyCode: function (context) {
      let ui = $.summernote.ui;

      // create button
      let button = ui.button({
        contents: `<span class="non-invasive-web-style-framework">
          <i class="code icon"></i>
          Code
        </span>`,
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
    buildButtonImageReplacer: function (context) {
      let ui = $.summernote.ui;

      // create button
      let button = ui.button({
        contents: `<span class="non-invasive-web-style-framework">
          <i class="image icon"></i>
          Images
        </span>`,
        tooltip: 'Replace Images',
        click: () => {
          $v.ImageReplacer.open()
        }
      });

      return button.render();   // return button as jquery object
    },
    buildButtonImageSizeOriginal: function (context) {
      let ui = $.summernote.ui;

      // create button
      let button = ui.button({
        contents: `Original Size`,
        tooltip: 'Resize to original',
        click: () => {
          console.log('@TODO Resize to original')
        }
      });

      return button.render();   // return button as jquery object
    },
    buildButtonImageSizeDefault: function (context) {
      let ui = $.summernote.ui;

      // create button
      let button = ui.button({
        contents: `Default Size`,
        tooltip: 'Resize to default size',
        click: () => {
          console.log('@TODO Resize to default size')
        }
      });

      return button.render();   // return button as jquery object
    },
    getAssetDirPath: function (callback) {
      $v.PostManager.getEditingPostId((id) => {
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
            this.insertImageNode(imgUrl, name)
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
                this.insertImageNode(url, name)
              } else {
                node = $(`<a href="${url}">${name}</a>`)[0]
                this.getPostSummerNote().summernote('insertNode', node);
              }
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
            //console.log(path)
            //console.log(filename)
            FileSystemHelper.copy(path, imageFile, filename, (imgUrl) => {
              this.insertImageNode(imgUrl, filename)
            })
            e.preventDefault();
            break;
          }
        }
      })
    },
    insertImageNode: function (url, name) {
      let imgNode = $(`<a href="${url}">
        <img src="${url}" title="${name}" alt="${name}" onload="BloggerImageHelper.readyToResize(this)" />
      </a>`)[0]
      this.getPostSummerNote().summernote('insertNode', imgNode);
    },
    getPostSummerNoteConfig: function () {
      let config = {
        focus: true, // set focus to editable area after initializing summernote
        disableResizeEditor: true,
        placeholder: 'Post Body',
        toolbar: this.getPostSummerNoteToolbarConfig(),
        styleTags: this.getPostSummerNoteStyleTagsConfig(),
        popover: {
          image: this.getPostSummerNotePopoverImageConfig()
        },
        buttons: {
          copyHTML: () => {
            return this.buildButtonCopyCode()
          },
          imageReplacer: () => {
            return this.buildButtonImageReplacer()
          },
          imageSizeOriginal: () => {
            this.buildButtonImageSizeOriginal()
          },
          imageSizeDefault: () => {
            this.buildButtonImageSizeDefault()
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
            //console.log('post body onchange')
            DelayExecHelper.exec('postBody', 5, () => {
              $v.PostManager.updateEditingPostBody(contents)
            })
            //console.log('postBody:', contents);
          }
        }
      }
      return config
    },
    getSimpleSummerNoteConfig: function (fieldName, placeholder) {
      let config = {
        airMode: true,
        placeholder: placeholder,
        shortcuts: false,
        disableDragAndDrop: true,
        popover: {
          air: []
        },
        callbacks: {
          onChange: (contents) => {
            DelayExecHelper.exec(fieldName, 3, () => {
              $v.PostManager.updateEditingPost(fieldName, contents)
            })
            //console.log(fieldName + ':', contents)
          }
        }
      }
      return config
    },
    init: function (callback) {
      this.initSummerNote()
      this.setupPostData(callback)
    },
    initSummerNote: function () {
      if (this.summerNoteInited !== true) {
        this.getPostSummerNote().summernote(this.getPostSummerNoteConfig());

        this.getTitleSummerNote().summernote(this.getSimpleSummerNoteConfig('title', 'Post Title'));
        this.getLabelsSummerNote().summernote(this.getSimpleSummerNoteConfig('labels', 'Labels'));

        this.summerNoteInited = true
      }
    },
    setupPostData: function (callback) {
      
      $v.PostManager.getPost((post) => {
        //console.log(post.id)
        let postDate = $v.PostManager.displayDate(post.updateUnix)
        //console.log(postDate)
        // Setup title
        //let post = PostManager.methods.getPost()
        
        /*
        if (EditorManager.summerNoteInited === false) {
          $('#summernotePostTitle').html(post.title)
          $('#summernotePostLabels').html(post.labels)
          $('#summernotePostDate').html(postDate)
        }
        */
        this.setupPostTitle(post.title)
        this.setupPostLabels(post.labels)
        this.setupPostDate(postDate)

        $v.PostManager.getPostBody((postBody) => {
          //console.log(postBody)
          /*
          if (EditorManager.summerNoteInited === false) {
            $('#summernotePostBody').html(postBody)
          }
          */
          this.setupPostBody(postBody)
          FunctionHelper.triggerCallback(callback)
        })
      })
    },
    setupPostBody: function (value) {
      let summerNote = this.getPostSummerNote()
      if (this.summerNoteInited === false) {
        summerNote.html(value)
      }
      else {
        summerNote.summernote('code', value);
      }
    },
    setupPostTitle: function (value) {
      let summerNote = this.getTitleSummerNote()
      //console.log([this.summerNoteInited, value])
      if (this.summerNoteInited === undefined 
              || this.summerNoteInited === false) {
        summerNote.html(value)
      }
      else {
        summerNote.summernote('code', value);
      }
    },
    setupPostLabels: function (value) {
      let summerNote = this.getLabelsSummerNote()
      if (this.summerNoteInited === undefined 
              || this.summerNoteInited === false) {
        summerNote.html(value)
      }
      else {
        summerNote.summernote('code', value);
      }
    },
    setupPostDate: function (value) {
      this.getDateContainer().text(value)
    },
    getSummerNoteContetnObject: function (summerNote) {
      if (this.summerNoteInited === false) {
        return summerNote
      }
      else {
        //return summerNote.summernote('code');
        return summerNote.next().find('.note-editing-area .note-editable')
      }
    },
    getPostBody: function () {
      let summerNote = this.getPostSummerNote()
      return this.getSummerNoteContetnObject(summerNote)
    },
    getPostBodyText: function () {
      return this.getPostBody().html()
    },
    getImageList: function () {
      let postBody = this.getPostBody()
      let output = []
      postBody.find('img[src^="filesystem:"]').each((i, img) => {
        output.push(img.src)
      })
      return output
    },
    setImageList: function (imageList) {
      let postBody = this.getPostBody()
      let doSave = false
      let count = 0
      for (let name in imageList) {
        let link = imageList[name]
        //console.log([name, link])
        let fullsize = BloggerImageHelper.getFullSize(link)
        postBody.find('img[src^="filesystem:"][src$="' + name + '"]').each((i, imgTag) => {
          // we need to change the URL size to fit the image
          imgTag.src = BloggerImageHelper.getSize(link, imgTag)
          
          if (typeof(imgTag.title) !== 'string') {
            imgTag.title = name
          }
          doSave = true
          count++
        })
        postBody.find('a[href^="filesystem:"][href$="' + name + '"]').each((i, aTag) => {
          aTag.href = fullsize
          doSave = true
        })
      }
      
      if (doSave === true) {
        this.save(true)
        this.clearFileSystemAsset()
      }
      return count
    },
    getPostTitleText: function () {
      let summerNote = this.getTitleSummerNote()
      return this.getSummerNoteContetnObject(summerNote).html()
    },
    getPostLabelsText: function () {
      let summerNote = this.getLabelsSummerNote()
      return this.getSummerNoteContetnObject(summerNote).html()
    },
    save: function (force) {
      if (force === undefined) {
        force = false
      }
      
      if (force === false && DelayExecHelper.isWaiting()) {
        DelayExecHelper.forceExec()
        return
      }
      
      let postTitle = this.getPostTitleText()
      $v.PostManager.updateEditingPost('title', postTitle)
      
      let postLabels = this.getPostLabelsText()
      $v.PostManager.updateEditingPost('labels', postLabels)
      
      let postBody = this.getPostBody()
      $v.PostManager.updateEditingPostBody(postBody)
      
      DelayExecHelper.clear()
    },
    hasFileSystemImage: function () {
      let postBody = this.getPostBody()
      return (postBody.find('img[src^="filesystem:"]:first').length === 1)
    },
    getFileSystemImageCount: function () {
      let postBody = this.getPostBody()
      return postBody.find('img[src^="filesystem:"]').length
    },
    clearFileSystemAsset: function () {
      let id = $v.PostManager.editingPostId
      let path = `/${id}/assets`
      return FileSystemHelper.removeDir(path)
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