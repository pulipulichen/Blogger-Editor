let SummerNoteImage = {
  imageSizeOriginal: function (context) {
    let contents = this.wrapNIWSF(`<i class="expand arrows icon"></i> Resize Original`)
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
  
  popoverImageSizeOriginal: function (context) {
    let contents = this.wrapNIWSF(`<i class="expand arrows icon"></i> Resize Original`)
    let tooltip = 'Resize to original'
    let click = () => {
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      this.removeImageTargetSize(target)
      target.addClass('original-size')
      
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
  popoverImageSave: function (context) {
    let contents = this.wrapNIWSF(`<i class="save icon"></i> Save`)
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
    let contents = this.wrapNIWSF(`<i class="share icon"></i> Open`)
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
  
}

export default SummerNoteImage