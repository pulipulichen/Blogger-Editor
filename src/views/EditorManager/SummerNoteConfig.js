SummerNoteConfig = {
  toolbar: function () {
    let toolbar = [
        ['view', ['codeview']],
        ['style', ['style']],
        ['font', ['undo', 'bold', 'underline', 'clear']],
        //['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['hr', 'link', 'picture', 'video']],
        ['imageResize', ['imageSizeOriginal', 'imageSizeDefault']],
        ['mybutton', ['copyHTML', 'imageReplacer']],
        ['help', [/*'fullscreen',*/ 'help']]
      ]

    return toolbar
  },
  styleTags: function () {
    let styleTags = ['p', 'code', 'h4', 'h5', 'h6']
    //let styleTags = [
    //  this.buildButtonCopyCode()
    //]

    return styleTags
  },
  popoverImage: function () {
    return [
      //['imagesize', ['copyHTML', 'imageSize100', 'imageSize50', 'imageSize25']],
      //['float', ['floatLeft', 'floatRight', 'floatNone']],
      ['imagesize', ['popoverImageSizeOriginal', 'popoverImageSizeDefault']],
      ['remove', ['removeMedia']]
    ]
  },
  
  fullConfig: function () {
    let config = {
      focus: true, // set focus to editable area after initializing summernote
      disableResizeEditor: true,
      placeholder: 'Post Body',
      toolbar: this.toolbar(),
      styleTags: this.getPostSummerNoteStyleTagsConfig(),
      popover: {
        image: this.getPostSummerNotePopoverImageConfig()
      },
      buttons: SummerNoteButtons.config(),
      //disableDragAndDrop: false,
      callbacks: SummerNoteCallbacks.config()
    }
    return config
  },
  airConfig: function (fieldName, placeholder) {
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
}