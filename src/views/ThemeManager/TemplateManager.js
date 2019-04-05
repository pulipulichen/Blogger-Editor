let TemplateManager = {
  selector: '#template',
  path: '/template.html',
  i18n: {
    needReload: 'We need reload webpage to active the change. Do you want to reload now?'
  },
  triggerUpload: function (e) {
    //console.log(this)
    $(e.target).parent().children('input:file:first').click()
  },
  upload: function (e) {
    //console.log('TemplateManager.upload')
    //console.log(e)
    let files = e.target.files
    
    // do we need to vaildate template?
    
    FileSystemHelper.copy('/', files, 'template.html', () => {
      //console.log(`template uploaded.`)
      this.afterUpload()
    })
  },
  afterUpload: function () {
    $v.ThemeManager.useCustomTemplate = true
    TemplateManager.reloadRequest()
  },
  reset: function () {
    FileSystemHelper.remove(TemplateManager.path)
    $v.ThemeManager.useCustomTemplate = false
    TemplateManager.reloadRequest()
  },
  reloadRequest: function () {
    //if (window.confirm(TemplateManager.i18n.needReload)) {
    //  location.reload()
    //}
    WindowHelper.confirm(TemplateManager.i18n.needReload, () => {
      $v.PageLoader.open()
      $v.EditorManager.save(() => {
        location.reload()
      })
    })
  },
  open: function () {
    
    FileSystemHelper.isExists(TemplateManager.path, (isExists) => {
      let url = TemplateManager.getDefaultPath()
      if (isExists === true) {
        url = FileSystemHelper.getFileSystemUrl(TemplateManager.path)
      }
      console.log(url)
      WindowHelper.popup(url, 'template')
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
  load: function (defaultTheme, callback) {
    let path = this.path
    FileSystemHelper.read(path, (template) => {
      if (template === undefined) {
        path = this.getDefaultPath()
        $.get(path, (template) => {
          template = this.replacePlaceholder(template)
          $(this.selector).html(template)
          FunctionHelper.triggerCallback(callback, template)
        })
      }
      else {
        template = this.replacePlaceholder(template)
        $(this.selector).html(template)
        FunctionHelper.triggerCallback(callback, template)
      }
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
    console.log(e.dataTransfer.items.length)
    console.log('drop')
    FileSystemHelper.copy('/', e.dataTransfer.files, 'template.html', () => {
      //console.log('uploaded')
      //console.log(FileSystemHelper.getFileSystemUrl(TemplateManager.path))
      TemplateManager.afterUpload()
    })
    //let droppedFiles = e.dataTransfer.items
    /*
    let droppedFiles = e.dataTransfer.files;
    let input = $(e.target).parent().find('input:file:first')
    console.log(input.length)
    input.prop('files', droppedFiles)
            .change()
            */
    return false
  },
  
  
}

export default TemplateManager