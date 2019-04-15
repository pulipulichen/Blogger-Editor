let SummerNoteButtons = {
  config: function () {
    return {
      CopyHTML: (c) => {
        return this.CopyCode(c)
      },
      ImageReplacer: (c) => {
        return this.ImageReplacer(c)
      },
      IframePrompt: (c) => {
        return this.IframePrompt(c)
      },
      FileUploader: (c) => {
        return this.FileUploader(c)
      },
      CodeInserter: (c) => {
        return this.CodeInserter(c)
      },
      OutlineNavigator: (c) => {
        return this.OutlineNavigator(c)
      },
      
      popoverImageSizeOriginal: (c) => {
        return this.popoverImageSizeOriginal(c)
      },
      popoverImageSizeDefault: (c) => {
        return this.popoverImageSizeDefault(c)
      },
      imageSizeOriginal: (c) => {
        return this.imageSizeOriginal(c)
      },
      imageSizeDefault: (c) => {
        return this.imageSizeDefault(c)
      },
      insertMore: (c) => {
        return this.insertMore(c)
      }
    }
  },
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
  
  // -------------------------
  // model buttons
  // -------------------------
  
  CopyCode: function (context) {
    let contents = this.wrapNIWSF(`<i class="code icon"></i>Copy Code`)
    let tooltip = 'Copy Code'
    let click = () => {
      //let code = this.getPostSummerNote().summernote('code');
      let code = $v.EditorManager.FieldPostBody.getHTML()
      CopyPasteHelper.copyPlainText(code)
    }
    return this.build(contents, tooltip, click)
  },
  ImageReplacer: function (context) {
    let contents = this.wrapNIWSF(`<i class="image icon"></i>Upload Images`)
    let tooltip = 'Replace Images with Blogger'
    let click = () => {
      $v.ImageReplacer.open()
    }
    return this.build(contents, tooltip, click)
  },
  IframePrompt: function (context) {
    let contents = this.wrapNIWSF(`<i class="plus square outline icon"></i> Iframe`)
    let tooltip = 'Insert iframe'
    let click = () => {
      $v.IframePrompt.open()
    }
    return this.build(contents, tooltip, click)
  },
  FileUploader: function (context) {
    let contents = this.wrapNIWSF(`<i class="upload icon"></i> Upload File`)
    let tooltip = 'Upload file and insert links'
    let click = () => {
      $v.FileUploader.open()
    }
    return this.build(contents, tooltip, click)
  },
  CodeInserter: function (context) {
    let contents = this.wrapNIWSF(`<i class="code icon"></i> Insert Code`)
    let tooltip = 'Insert code'
    let click = () => {
      $v.CodeInserter.open()
    }
    return this.build(contents, tooltip, click)
  },
  OutlineNavigator: function (context) {
    let contents = this.wrapNIWSF(`<i class="sitemap icon"></i> Outline`)
    let tooltip = 'Outline Navigation'
    let click = () => {
      $v.OutlineNavigator.toggle()
    }
    return this.build(contents, tooltip, click)
  },
  
  
  // -------------------------
  // image buttons
  // -------------------------
  
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
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      this.removeImageTargetSize(target)
    }
    return this.build(contents, tooltip, click)
  },
  imageSizeOriginal: function (context) {
    let contents = this.wrapNIWSF(`<i class="expand arrows icon"></i> Resize Original`)
    let tooltip = 'Resize images to original'
    let click = () => {
      let postBody = $v.EditorManager.FieldPostBody.getElement()
      postBody.find('img').each((i, img) => {
        this.removeImageTargetSize(img)
      })
    }
    return this.build(contents, tooltip, click)
  },
  insertMore: function (context) {
    let contents = this.wrapNIWSF(`<i class="ellipsis horizontal icon"></i> More`)
    let tooltip = 'Insert More'
    let click = () => {
      $v.EditorManager.FieldPostBody.insert('<a name="more"></a>')
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
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
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
      let postBody = $v.EditorManager.FieldPostBody.getElement()
      postBody.find('img').each((i, img) => {
        this.setImageTargetSize(img, defaultSize)
      })
    }
    return this.build(contents, tooltip, click)
  },
}

export default SummerNoteButtons