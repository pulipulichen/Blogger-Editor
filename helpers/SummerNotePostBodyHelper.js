var CopyHTML = function (context) {
  var ui = $.summernote.ui;

  // create button
  var button = ui.button({
    contents: '<i class="fas fa-file-import" /> Copy Code',
    tooltip: 'Copy Code',
    click: function () {
      // invoke insertText method with 'hello' on editor module.
      //context.invoke('editor.insertText', 'hello');
      let code = $summernote.summernote('code');
      //console.log(code)
      
      CopyPasteHelper.copyPlainText(code)
    }
  });

  return button.render();   // return button as jquery object
}

summernotePostBodyConfig = {
  //height: 'calc(100vh - 60px)',                 // set editor height
  //minHeight: 'calc(100vh - 60px)',             // set minimum height of editor
  //maxHeight: null,             // set maximum height of editor
  focus: true,                  // set focus to editable area after initializing summernote
  disableResizeEditor: true,
  //toolbar: [
    //['mybutton', ['hello']]
  //],
  
  placeholder: 'Post Body',
  toolbar: [
    // [groupName, [list of button]]
    ['style', ['style']],
    ['font', ['bold', 'underline', 'clear']],
    ['fontname', ['fontname']],
    ['color', ['color']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['table', ['table']],
    ['insert', ['link', 'picture', 'video']],
    ['view', ['fullscreen', 'codeview', 'help']],
    ['mybutton', ['copyHTML']]
  ],
  buttons: {
    copyHTML: CopyHTML
  },
  //disableDragAndDrop: false,
  callbacks: {
    onImageUpload: function(files) {
      // upload image to server and create imgNode...
      //$summernote.summernote('insertNode', imgNode);
      //console.log(files[0])
      FileSystemHelper.copy("/", files, function (urlList) {
        //console.log(urlList)
        urlList.forEach(imgUrl => {
          //let imgUrl = urlList[0]
          let name = FileSystemHelper.getFileName(imgUrl)
          let imgNode = $(`<a href="${imgUrl}">
              <img src="${imgUrl}" alt="${name}" title="${name}" />
            </a>`)[0]
          $summernote.summernote('insertNode', imgNode);
        })
      })
    },
    onDrop: function (files) {
      //console.log(files.length)
      
      let loop = (i) => {
        if (i < files.length) {
          let file = files[i];
          let type = file.type
          let name = file.name
          //console.log(imageFile)

          FileSystemHelper.copy("/", file, function (url) {
            let node
            if (type.startsWith('image')) {
              node = $(`<a href="${url}">
                  <img src="${url}" alt="${name}" title="${name}" />
                </a>`)[0]
            }
            else {
              node = $(`<a href="${url}">${name}</a>`)[0]
            }
            $summernote.summernote('insertNode', node);

            i++
            loop(i)
          })
        }
      }
      loop(0)
    },
    onPaste: function(e) {
      console.log('Called event paste');
      //console.log(e)
      var orgEvent = e.originalEvent;
      //console.log(orgEvent.clipboardData.items.length)
      for (var i = 0; i < orgEvent.clipboardData.items.length; i++) {
        //console.log([orgEvent.clipboardData.items[i].kind
        //  , orgEvent.clipboardData.items[i].type])
        if (orgEvent.clipboardData.items[i].kind === "file" 
                && orgEvent.clipboardData.items[i].type.startsWith('image/')) {
          var imageFile = orgEvent.clipboardData.items[i].getAsFile();
          //imageFile.name = 'test.png'
          //console.log(imageFile.name)
          FileSystemHelper.copy("/", imageFile, 'test.png', function (imgUrl) {
            let imgNode = $(`<img src="${imgUrl}" />`)[0]
            $summernote.summernote('insertNode', imgNode);
          })
          e.preventDefault();
          break;
        }
      }
    }
  }
}
