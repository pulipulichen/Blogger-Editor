SummerNoteButtons = {
  build: function (contents, tooltip, click) {
    let ui = $.summernote.ui;

    // create button
    let button = ui.button({
      contents: contents,
      tooltip: tooltip,
      click: click
    });

    return button.render(); 
  },
  wrapNIWSF: function (text) {
    return `<span class="non-invasive-web-style-framework">${text}</span>`
  },
  copyCode: function (context) {
    let contents = this.wrapNIWSF(`<i class="code icon"></i>Code`)
    let tooltip = 'Copy Code'
    let click = () => {
      //let code = this.getPostSummerNote().summernote('code');
      let code = FieldPostBody.getText()
      CopyPasteHelper.copyPlainText(code)
    }
    return this.build(contents, tooltip, click)
  },
  imageReplacer: function (context) {
    let contents = this.wrapNIWSF(`<i class="image icon"></i>Images`)
    let tooltip = 'Replace Images with Blogger'
    let click = () => {
      $v.ImageReplacer.open()
    }
    return this.build(contents, tooltip, click)
  },
  removeImageTargetSize: function (target) {
    target = $(target)

    target.removeAttr('width')
    target.removeAttr('height')

    let link = target.attr('src')
    //console.log(link)
    if (BloggerImageHelper.isBloggerImageLink(link)) {
      if (BloggerImageHelper.isFullSizeLink(link) === false) {
        target.attr('src', BloggerImageHelper.getFullSize(link))
        //console.log('change src: ', target.attr('src'))
      } 
    }
    //console.log('@TODO Resize to original')
  },
  popoverImageSizeOriginal: function (context) {
    let contents = this.wrapNIWSF(`<i class="expand arrows icon"></i> Resize Original`)
    let tooltip = 'Resize to original'
    let click = () => {
      let target = FieldPostBody.getSelectTarget()
      this.removeImageTargetSize(target)
    }
    return this.build(contents, tooltip, click)
  },
  imageSizeOriginal: function (context) {
    let contents = this.wrapNIWSF(`<i class="expand arrows icon"></i> Resize Original`)
    let tooltip = 'Resize images to original'
    let click = () => {
      let postBody = FieldPostBody.getElement()
      postBody.find('img').each((i, img) => {
        this.removeImageTargetSize(img)
      })
    }
    return this.build(contents, tooltip, click)
  },
  setImageTargetSize: function (target, size) {
    target = $(target)

    let resize = BloggerImageHelper.calcResize(size, target)
    if (resize !== undefined) {
      target.attr('width', resize.width)
        .attr('height', resize.height)
    }

    let link = target.attr('src')
    //console.log(link)
    if (BloggerImageHelper.isBloggerImageLink(link)) {
      target.attr('src', BloggerImageHelper.getSize(link, size))
      //console.log('change src: ', target.attr('src'))
    }
  },
  popoverImageSizeDefault: function (context) {
    let contents = this.wrapNIWSF(`<i class="compress icon"></i> Resize Default`)
    let tooltip = 'Resize to default size'
    let click = () => {
      let target = FieldPostBody.getSelectTarget()
      let defaultSize = $v.EditorManager.imageSizeDefault
      this.setImageTargetSize(target, defaultSize)
    }
    return this.build(contents, tooltip, click)
  },
  imageSizeDefault: function (context) {
    let contents = this.wrapNIWSF(`<i class="compress icon"></i> Resize Default`)
    let tooltip = 'Resize to default size'
    let click = () => {
      let defaultSize = $v.EditorManager.imageSizeDefault
      let postBody = FieldPostBody.getElement()
      postBody.find('img').each((i, img) => {
        this.setImageTargetSize(img, defaultSize)
      })
    }
    return this.build(contents, tooltip, click)
  },
}