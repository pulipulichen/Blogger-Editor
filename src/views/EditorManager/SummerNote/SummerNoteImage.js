/* global SemanticUIHelper, FileHelper, FileSystemHelper */

import SummerNoteHelper from './SummerNoteHelper.js'
import SummerNoteImageOCR from './SummerNoteImageOCR.js'

let SummerNoteImage = {
  ImageReplacer: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="image icon"></i>` + $t(`Upload Images`))
    let tooltip = $t('Replace Images with Blogger')
    let click = () => {
      $v.ImageReplacer.open()
    }
    return SummerNoteHelper.buildButton('ImageReplacer', contents, tooltip, click, doRender)
  },
  
  imageSizeOriginal: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="expand arrows icon"></i>` + $t(`Resize Original`))
    let tooltip = $t('Resize images to original')
    let click = () => {
      this.imageSizeOriginalClick()
    }
    return SummerNoteHelper.buildButton('imageSizeOriginal', contents, tooltip, click, doRender)
  },
  
  imageSizeOriginalClick: function () {
    let postBody = $v.EditorManager.FieldPostBody.getElement()
    postBody.find('img').each((i, img) => {
      this.removeImageTargetSize(img)
      $(img).addClass('original-size')
    })
  },
  
  imageSizeThumbnail: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="compress icon"></i>` + $t(`Resize Thumbnail`))
    let tooltip = $t('Resize to thumbnail size')
    let click = () => {
      this.imageSizeThumbnailClick()
    }
    return SummerNoteHelper.buildButton('imageSizeThumbnail', contents, tooltip, click, doRender)
  },
  
  imageSizeThumbnailClick: function () {
    let defaultSize = $v.EditorManager.imageSizeDefault
    let postBody = $v.EditorManager.FieldPostBody.getElement()
    postBody.find('img').each((i, img) => {
      this.setImageTargetSize(img, defaultSize)
      $(img).removeClass('original-size')
    })
  },
  
  downloadImageTamplate: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="object group outline icon"></i>` + $t('Image Template'))
    let tooltip = $t('Download image template')
    let click = () => {
      this.downloadImageTamplateClick()
    }
    return SummerNoteHelper.buildButton('downloadImageTamplate', contents, tooltip, click, doRender)
  },
  
  downloadImageTamplateClick: function () {
    let path = './static/ImageTemplate/image-template.dps'
    //FileHelper.download(path)
    //let title = "test.dps"
    let title = $v.EditorManager.FieldPostTitle.getText().trim()
    
    /*
    console.log(['downloadImageTamplateClick', title.indexOf('/')])
    if (title.indexOf('/') > -1) {
      title = title.slice(0, title.indexOf('/')).trim()
    }
    if (title.length > 30) {
      title = title.slice(0,30).trim()
    }
    */
    
    /**
    var string = "border-radius:10px 20px 30px 40px";
    string.match(/[A-Za-z\d]+/g).map((m) => {return m}).join('_')
    var numbers = string.match(/[A-Za-z\d]+/g).map((m) => {return m});
    console.log(numbers)
     */
    
    //console.log([title, title.replace(/[\u4E00-\u9FAF\u3040-\u3096\u30A1-\u30FA\uFF66-\uFF9D\u31F0-\u31FFA-Za-z\?]+/g, '_')])
    //console.log([title.replace(/[\u4E00-\u9FAF\u3040-\u3096\u30A1-\u30FA\uFF66-\uFF9D\u31F0-\u31FFA-Za-z??]+/g, '_')])
    //console.log([title.replace(/[\u4E00-\u9FAF\u3040-\u3096\u30A1-\u30FA\uFF66-\uFF9D\u31F0-\u31FFA-Za-z？]+/g, '_')])

    //title = $v.PostManager.editingPostId + '-' + title.replace(/[^\x00-\x7F]+/, '_')
    //title = $v.PostManager.editingPostId + '-' + title.replace(/[\u4E00-\u9FAF\u3040-\u3096\u30A1-\u30FA\uFF66-\uFF9D\u31F0-\u31FFA-Za-z\?]+/g, '_')

    let titleList = title.match(/[A-Za-z\d]+/g).map((m) => {return m})
    title = ''
    for (let i = 0; i < titleList.length; i++) {
      if (title !== '') {
        title = title + '_'
      }
      title = title + titleList[i]
      if (title.length > 30) {
        break
      }
    }
    
    title = $v.PostManager.editingPostId + '-cover-' + title

    title = title + '.dps'
    //$(`<a href="${path}" download="${title}"></a>`).click()

    FileHelper.download(path, title)
  },
  
  downloadAnnotationTamplate: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="object group outline icon"></i>` + $t('Annotation Template'))
    let tooltip = $t('Download annotation template')
    let click = () => {
      this.downloadAnnotationTamplateClick()
    }
    return SummerNoteHelper.buildButton('downloadAnnotationTamplate', contents, tooltip, click, doRender)
  },
  
  downloadAnnotationTamplateClick: function () {
    let path = './static/ImageTemplate/annotation-template.wps'
    //FileHelper.download(path)
    //let title = "test.dps"
    let title = $v.EditorManager.FieldPostTitle.getText().trim()
    
    let titleList = title.match(/[A-Za-z\d]+/g).map((m) => {return m})
    title = ''
    for (let i = 0; i < titleList.length; i++) {
      if (title !== '') {
        title = title + '_'
      }
      title = title + titleList[i]
      if (title.length > 30) {
        break
      }
    }
    
    title = $v.PostManager.editingPostId + '-annotation-' + title

    title = title + '.dps'
    //$(`<a href="${path}" download="${title}"></a>`).click()

    FileHelper.download(path, title)
  },
  
  // ---------------------------------
  
  popoverImageSizeOriginal: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="expand arrows icon"></i>` + $t(`Resize Original`))
    let tooltip = $t('Resize to original')
    let click = () => {
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      this.removeImageTargetSize(target)
      
      target = $(target)
      target.addClass('original-size')
      //console.log(target.attr('className'))
      
      let link = target.attr('src')
      if (BloggerImageHelper.isBloggerImageLink(link)) {
        if (BloggerImageHelper.isFullSizeLink(link) === false) {
          target.attr('src', BloggerImageHelper.getFullSize(link))
          //console.log('change src: ', target.attr('src'))
        } 
      }
    }
    return SummerNoteHelper.buildButton('popoverImageSizeOriginal', contents, tooltip, click, doRender)
  },
  
  
  popoverImageSizeDefault: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="compress icon"></i>` + $t(`Resize Thumbnail`))
    let tooltip = $t('Resize to thumbnail size')
    let click = () => {
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      let defaultSize = $v.EditorManager.imageSizeDefault
      this.setImageTargetSize(target, defaultSize)
      
      target = $(target)
      target.removeClass('original-size')
    }
    return SummerNoteHelper.buildButton('popoverImageSizeDefault', contents, tooltip, click, doRender)
  },
  
  // ----------------------
  
  popoverImageSave: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="save icon"></i>` + $t(`Save`))
    let tooltip = $t('Save image')
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
    return SummerNoteHelper.buildButton('popoverImageSave', contents, tooltip, click, doRender)
  },
  popoverImageOpen: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="share icon"></i>` + $t(`Open`))
    let tooltip = $t('Open image in new tab')
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
    return SummerNoteHelper.buildButton('popoverImageOpen', contents, tooltip, click, doRender)
  },
  popoverImageOCR: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="crosshairs icon"></i>` + $t(`OCR`))
    let tooltip = $t('Recognize text and append on image')
    let click = () => {
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      let src = target.src
      if (src.startsWith('filesystem:') === false) {
        return
      }
      let name = target.getAttribute('data-filename')
      SummerNoteImageOCR.ocrImage(name)
    }
    return SummerNoteHelper.buildButton('popoverImageOCR', contents, tooltip, click, doRender)
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
  insertFromButton: function (files) {
    let path = this.getAssetDirPath()
    //TesseractHelper.recognize(files)
    
    FileSystemHelper.writeFromFile(path, files, (urlList) => {
      urlList.forEach(imgUrl => {
        let name = FileSystemHelper.getFileName(imgUrl)
        this.insertImageNode(imgUrl, name)
      })
    })
  },
  getAssetDirPath: function () {
    //$v.PostManager.getEditingPostId((id) => {
    //  let path = `/${id}/assets/`
    //  FunctionHelper.triggerCallback(callback, path)
    //})
    let id = $v.PostManager.editingPostId
    return `/${id}/assets/`
  },
  /**
   * @author Pulipuli Chen 20190713 
   * @param {String} path
   * @param {Object} imageFile
   * @returns {SummerNoteImage}
   */
  insertImageFromPaste: function (imageFile) {
    let path = this.getAssetDirPath()
    let name = DayjsHelper.nowFormat() + '.png'
    FileSystemHelper.writeFromFile(path, imageFile, name, (url) => {
      this.insertImageNode(url, name)
    })
    return this
  },
  insertImageFromDrop: function (file, callback) {
    //TesseractHelper.recognize(file)
    let path = this.getAssetDirPath()

    let type = file.type
    /*
    if (type.startsWith('image') === false) {
      FunctionHelper.triggerCallback(callback)
      return this
    } 
    */
    let name = file.name
    name = FileHelper.extractSafeFilename(name)
    //console.log(imageFile)

    FileSystemHelper.writeFromFile(path, file, (url) => {
      let node
      if (type.startsWith('image')) {
        this.insertImageNode(url, name)
      } else {
        node = $(`<a href="${url}" class="file">${name}</a>`)[0]
        $v.EditorManager.FieldPostBody.insert(node)
      }
      FunctionHelper.triggerCallback(callback)
    })
  },
  /**
   * 插入圖片似乎最後都會走到這裡
   * @param {String} url
   * @param {String} name
   * @returns {SummerNoteImage}
   */
  insertImageNode: function (url, name) {
    let imgNode = $(`<a href="${url}" data-filename="${name}">
      <img src="${url}" title="${name}" alt="${name}" data-filename="${name}" onload="BloggerImageHelper.readyToResize(this)" />
    </a>`)[0]
    //this.getPostSummerNote().summernote('insertNode', imgNode);
    $v.EditorManager.FieldPostBody.insert(imgNode)
    
    setTimeout(() => {
      SummerNoteImageOCR.ocrImage(name)
    }, 0)
    
    GoogleAnalyticsHelper.send('SummerNoteImage.insertImageNode', {
      'name': name
    })
    
    //console.log(name)
    return this
  },
}

export default SummerNoteImage