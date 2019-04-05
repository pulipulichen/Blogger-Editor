let StyleManager = {
  path: '/style.css',
  i18n: {
    needReload: 'We need reload webpage to active the change. Do you want to reload now?'
  },
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
    
    if ($v.ThemeManager.useCustomStyle === true) {
      FileSystemHelper.remove(StyleManager.path, () => {
        //console.log('deleted')
        $v.ThemeManager.useCustomStyle = false
        StyleManager.uploadFiles(files, callback)
      })
      return this
    }
    
    // do we need to vaildate template?
    StyleManager.validate(files, (result) => {
      if (result === false) {
        window.alert('Invalid template file')
        return
      }
      
      FileSystemHelper.copy('/', files, 'template.html', () => {
        console.log(`template uploaded.`)
        console.log(FileSystemHelper.getFileSystemUrl('/template.html'))
        $v.ThemeManager.useCustomStyle = true
        
        //WindowHelper.confirm(StyleManager.i18n.needReload, () => {
        //  $v.PageLoader.open()
        //  $v.EditorManager.save(() => {
        //    location.reload()
        //  })
        //})
        $v.ThemeManager.onCloseReload = true
      })
    })
  },
  reset: function () {
    FileSystemHelper.remove(StyleManager.path)
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
      FileHelper.download(url, 'template.html')
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
    FileSystemHelper.read(path, (template) => {
      if (template === undefined) {
        path = this.getDefaultPath()
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
      FunctionHelper.triggerCallback(callback, template)
    })
    return this
  },
  replacePlaceholder: function (template) {
    //console.log(template)
    //let titleEditor = `<input type="text" name="postTitle" id="postTitle" />`
    let titleEditor = `<div class="summernotePostTitle-wrapper air-mode">
      <div id="summernotePostTitle"</div>
    </div>`
    template = template.replace('${postTitle}', titleEditor)

    let dataContainer = `<span class="summernotePostDate-wrapper">
      <span id="summernotePostDate" class="summernotePostDate"></span>
    </span>`
    template = template.replace('${postDate}', dataContainer)

    let labelEditor = `<span class="summernotePostLabels-wrapper air-mode">
      <span id="summernotePostLabels" class="summernotePostLabels"></span>
    </span>`
    template = template.replace('${postLabels}', labelEditor)

    //let postEditor = `<div id="summernotePostBody"><p>HelloAAAA</p><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><p>Summernote</p></div>`
    let postEditor = `<div class="summernotePostBody-wrapper">
      <div id="summernotePostBody"></div>
    </div>`
    template = template.replace('${postBody}', postEditor)

    return template
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
  }
}

export default StyleManager