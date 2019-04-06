let TemplateManager = {
  selector: '#template',
  path: '/template.html',
  triggerUpload: function (e) {
    //console.log(this)
    $(e.target).parent().children('input:file:first').click()
  },
  upload: function (e) {
    //console.log('TemplateManager.upload')
    //console.log(e)
    let files = e.target.files
    TemplateManager.uploadFiles(files)
  },
  uploadFiles: function (files, callback) {
    if (files.length === 0) {
      return this
    }
    
    if ($v.ThemeManager.useCustomTemplate === true) {
      FileSystemHelper.remove('/template.html', () => {
        //console.log('deleted')
        $v.ThemeManager.useCustomTemplate = false
        TemplateManager.uploadFiles(files, callback)
      })
      return this
    }
    
    // do we need to vaildate template?
    TemplateManager.validateFiles(files, (result) => {
      if (result === false) {
        window.alert('Invalid template file')
        return
      }
      
      FileSystemHelper.copy('/', files, 'template.html', () => {
        //console.log(`template uploaded.`)
        //console.log(FileSystemHelper.getFileSystemUrl('/template.html'))
        $v.ThemeManager.useCustomTemplate = true
        
        //WindowHelper.confirm(TemplateManager.i18n.needReload, () => {
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
    FileSystemHelper.remove(TemplateManager.path)
    $v.ThemeManager.useCustomTemplate = false
    $v.ThemeManager.onCloseReload = true
  },
  open: function () {
    
    FileSystemHelper.isExists(TemplateManager.path, (isExists) => {
      let url = TemplateManager.getDefaultPath()
      if (isExists === true) {
        url = FileSystemHelper.getFileSystemUrl(TemplateManager.path)
      }
      console.log(url)
      WindowHelper.popup(url, 'customeTemplate')
    })
    return this
  },
  download: function () {
    FileSystemHelper.isExists(TemplateManager.path, (isExists) => {
      let url = TemplateManager.getDefaultPath()
      if (isExists === true) {
        url = FileSystemHelper.getFileSystemUrl(TemplateManager.path)
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
  hasCustomTemplate: function (callback) {
    FileSystemHelper.isExists(this.path, callback)
    return this
  },
  getDefaultPath: function () {
    let defaultTheme = ConfigHelper.get('defaultTheme')
    return './themes/' + defaultTheme + '/template.html'
  },
  load: function (callback) {
    let path = this.path
    FileSystemHelper.read(path, (template) => {
      if (template === undefined) {
        this.loadDefault(callback)
      }
      else {
        if (this.validate(template) === true) {
          template = this.replacePlaceholder(template)
          $(this.selector).html(template)
          FunctionHelper.triggerCallback(callback, template)
        }
        else {
          this.loadDefault(callback)
        }
      }
    })
    return this
  },
  loadDefault: function (callback) {
    let path = this.getDefaultPath()
    $.get(path, (template) => {
      template = this.replacePlaceholder(template)
      $(this.selector).html(template)
      FunctionHelper.triggerCallback(callback, template)
    })
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
    TemplateManager.uploadFiles(files)
    return false
  },
  validateFiles: function (files, callback) {
    //console.log(files)
    if (files.length !== 1 || files[0].type !== 'text/html') {
      FunctionHelper.triggerCallback(callback, false)
      return this
    }
    //return true
    //let result = true
    FileSystemHelper.readEventFilesText(files[0], (content) => {
      //console.log(content)
      let result = TemplateManager.validate(content)
      
      FunctionHelper.triggerCallback(callback, result)
    })
    
    return this
  },
  validate: function (template) {
    return (template.split('${postTitle}').length === 2
              && template.split('${postDate}').length === 2
              && template.split('${postLabels}').length === 2
              && template.split('${postBody}').length === 2)
  },
  set: function (content, callback) {
    if (content === undefined 
            || content.trim() === '') {
      this.reset()
      FunctionHelper.triggerCallback(callback)
    }
    else {
      FileSystemHelper.write(content, this.path, callback)
    }
  },
  getConfig: function (callback) {
    this.hasCustomTemplate((isExists) => {
      if (isExists === false) {
        FunctionHelper.triggerCallback(callback)
        return
      }
      else {
        FileSystemHelper.read(this.path, callback)
      }
    })
  }
}

export default TemplateManager