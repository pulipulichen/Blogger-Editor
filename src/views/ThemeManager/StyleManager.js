let StyleManager = {
  path: '/style.css',
  triggerUpload: function (e) {
    //console.log(this)
    $(e.target).parent().children('input:file:first').click()
  },
  upload: function (e) {
    //console.log('StyleManager.upload')
    //console.log(e)
    let files = e.target.files
    StyleManager.uploadFiles(files)
  },
  uploadFiles: function (files, callback) {
    if (files.length === 0) {
      return this
    }
    
    // do we need to vaildate style?
    StyleManager.validate(files, (result) => {
      if (result === false) {
        window.alert('Invalid style file')
        return
      }
      
      FileSystemHelper.readEventFilesText(files[0], (style) => {
        style = style.trim()
        if (style === '') {
          StyleManager.reset()
          return
        }
        
        $v.ThemeManager.customStyle = style
        $v.ThemeManager.useCustomStyle = true
        $v.ThemeManager.onCloseReload = true
        
        FunctionHelper.triggerCallback(callback)
      })
    })
  },
  reset: function () {
    //FileSystemHelper.remove(StyleManager.path)
    $v.ThemeManager.customStyle = ''
    $v.ThemeManager.useCustomStyle = false
    $v.ThemeManager.onCloseReload = true
  },
  open: function () {
    FileSystemHelper.isExists(StyleManager.path, (isExists) => {
      let url = StyleManager.getDefaultPath()
      if (isExists === true) {
        url = FileSystemHelper.getFileSystemUrl(StyleManager.path)
      }
      console.log(url)
      WindowHelper.popup(url, 'customeStyle')
    })
    return this
  },
  download: function () {
    FileSystemHelper.isExists(StyleManager.path, (isExists) => {
      let url = StyleManager.getDefaultPath()
      if (isExists === true) {
        url = FileSystemHelper.getFileSystemUrl(StyleManager.path)
      }
      FileHelper.download(url, 'style.css')
    })
    return this
  },
  getCustom: function (callback) {
    let path = this.path
    FileSystemHelper.read(path, callback)
    return this
  },
  hasCustomStyle: function (callback) {
    FileSystemHelper.isExists(this.path, callback)
    return this
  },
  getDefaultPath: function () {
    let defaultTheme = ConfigHelper.get('defaultTheme')
    return './themes/' + defaultTheme + '/style.css'
  },
  load: function (callback) {
    let path = this.path
    FileSystemHelper.read(path, (content) => {
      if (content === undefined) {
        path = this.getDefaultPath()
      }
      else {
        path = FileSystemHelper.getFileSystemUrl(this.path)
      }
      
      let linkTag = $('link#StyleManager')
      
      if (linkTag.length === 0) {
        linkTag = $(`<link href="${path}" rel="stylesheet" type="text/css" id="StyleManager" />`)
              .appendTo('head')
      }
      else {
        linkTag.attr('href', path)
      }
      
      //$(`<link href="${path}" rel="stylesheet" type="text/css" id="StyleManager" />`)
      //        .appendTo('head')
      FunctionHelper.triggerCallback(callback)
    })
    return this
  },
  dragenter: function (e) {
    //console.log('dragenter')
    $(e.target).addClass('dragover')
  },
  //dragover: function (e) {
  //  console.log('dragover')
  //},
  dragleave: function (e) {
    //console.log('dragleave')
    $(e.target).removeClass('dragover')
  },
  drop: function (e) {
    //e.preventDefault()
    //e.stopPropagation()
    //console.log(e.dataTransfer.items.length)
    //console.log('drop')
    
    let files = e.dataTransfer.files
    StyleManager.uploadFiles(files)
    return false
  },
  validate: function (files, callback) {
    //console.log(files)
    if (files.length !== 1 || files[0].type !== 'text/css') {
      FunctionHelper.triggerCallback(callback, false)
      return this
    }
    else {
      FunctionHelper.triggerCallback(callback, true)
      return this
    }
  },
  setSave: function (e) {
    $v.ThemeManager.onCloseReload = true
  },
  getStyle: function (callback) {
    FileSystemHelper.read(this.path, (style) => {
      if (style === undefined) {
        style = ''
      }
      FunctionHelper.triggerCallback(callback, style)
    })
  },
  saveStyle: function (style, callback) {
    if (style === '') {
      this.reset()
      FileSystemHelper.remove(this.path, callback)
    }
    else {
      FileSystemHelper.writeFromString(this.path, style, callback)
    }
    return this
  },
  set: function (content, callback) {
    if (content === undefined 
            || content.trim() === '') {
      this.reset()
      FunctionHelper.triggerCallback(callback)
    }
    else {
      FileSystemHelper.writeFromString(content, this.path, callback)
    }
  },
  getConfig: function (callback) {
    this.hasCustomStyle((isExists) => {
      if (isExists === false) {
        FunctionHelper.triggerCallback(callback)
        return
      }
      else {
        FileSystemHelper.read(this.path, callback)
      }
    })
  },
  setConfig: function (content, callback) {
    if (content === undefined) {
      FunctionHelper.triggerCallback(callback)
      return
    }
    FileSystemHelper.writeFromString(this.path, content, callback)
  }
}

export default StyleManager