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
}