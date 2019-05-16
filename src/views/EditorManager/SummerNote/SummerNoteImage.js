import SummerNoteHelper from './SummerNoteHelper.js'

let SummerNoteImage = {
  ImageReplacer: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="image icon"></i>Upload Images`)
    let tooltip = 'Replace Images with Blogger'
    let click = () => {
      $v.ImageReplacer.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  
  imageSizeOriginal: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="expand arrows icon"></i> Resize Original`)
    let tooltip = 'Resize images to original'
    let click = () => {
      let postBody = $v.EditorManager.FieldPostBody.getElement()
      postBody.find('img').each((i, img) => {
        this.removeImageTargetSize(img)
        $(img).addClass('original-size')
      })
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  
  imageSizeDefault: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="compress icon"></i> Resize Default`)
    let tooltip = 'Resize to default size'
    let click = () => {
      let defaultSize = $v.EditorManager.imageSizeDefault
      let postBody = $v.EditorManager.FieldPostBody.getElement()
      postBody.find('img').each((i, img) => {
        this.setImageTargetSize(img, defaultSize)
        $(img).removeClass('original-size')
      })
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  
  
  
  downloadImageTamplate: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="object group outline icon"></i> Image Template`)
    let tooltip = 'Download image template'
    let click = () => {
      let path = './static/image-template.dps'
      //FileHelper.download(path)
      //let title = "test.dps"
      let title = $v.EditorManager.FieldPostTitle.getText().trim()
      if (title.indexOf('/') > -1) {
        title = title.slice(0, title.indexOf('/')).trim()
      }
      if (title.length > 30) {
        title = title.slice(0,30)
      }
      
      title = $v.PostManager.editingPostId + '-' + title.replace(/[^\x00-\x7F]+/, '_')
      
      title = title + '.dps'
      //$(`<a href="${path}" download="${title}"></a>`).click()
      
      FileHelper.download(path, title)
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  
  // ---------------------------------
  
  popoverImageSizeOriginal: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="expand arrows icon"></i> Resize Original`)
    let tooltip = 'Resize to original'
    let click = () => {
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      this.removeImageTargetSize(target)
      
      target = $(target)
      target.addClass('original-size')
      console.log(target.attr('className'))
      
      let link = target.attr('src')
      if (BloggerImageHelper.isBloggerImageLink(link)) {
        if (BloggerImageHelper.isFullSizeLink(link) === false) {
          target.attr('src', BloggerImageHelper.getFullSize(link))
          //console.log('change src: ', target.attr('src'))
        } 
      }
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  
  
  popoverImageSizeDefault: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="compress icon"></i> Resize Default`)
    let tooltip = 'Resize to default size'
    let click = () => {
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      let defaultSize = $v.EditorManager.imageSizeDefault
      this.setImageTargetSize(target, defaultSize)
      
      target = $(target)
      target.removeClass('original-size')
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  
  // ----------------------
  
  popoverImageSave: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="save icon"></i> Save`)
    let tooltip = 'Save image'
    let click = () => {
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      target = $(target)
      let link = target.attr('src')
      //console.log(link)
      let name = link.slice(link.lastIndexOf('/') + 1)
      name = decodeURIComponent(name)
      //console.log(name)
      //WindowHelper.popup(link, name)
      //window.open(link, name)
      FileHelper.download(link, name)
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  popoverImageOpen: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="share icon"></i> Open`)
    let tooltip = 'Open image in new tab'
    let click = () => {
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      target = $(target)
      let link = target.attr('src')
      //console.log(link)
      let name = link.slice(link.lastIndexOf('/') + 1)
      //console.log(name)
      //WindowHelper.popup(link, name)
      //window.open(link, name)
      //console.log([link, name])
      WindowHelper.popup(link, name)
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  
  // --------------------------
  // Utils
  // --------------------------
  
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
  
}

export default SummerNoteImage