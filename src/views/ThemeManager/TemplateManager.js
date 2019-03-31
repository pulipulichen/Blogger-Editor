let TemplateManager = {
  selector: '#template',
  path: '/template.html',
  upload: function () {
    console.log('TemplateManager.upload')
  },
  reset: function () {
    FileSystemHelper.remove(this.path)
  },
  open: function () {
    
    FileSystemHelper.isExists(TemplateManager.path, (isExists) => {
      let url = TemplateManager.getDefaultPath()
      if (isExists === true) {
        url = FileSystemHelper.getFileSystemUrl(TemplateManager.path)
      }
      WindowHelper.popup(url, 'template')
    })
  },
  download: function () {
    FileSystemHelper.isExists(TemplateManager.path, (isExists) => {
      let url = TemplateManager.getDefaultPath()
      if (isExists === true) {
        url = FileSystemHelper.getFileSystemUrl(TemplateManager.path)
      }
      FileHelper.download(url, 'template.html')
    })
  },
  getCustom: function (callback) {
    let path = this.path
    FileSystemHelper.read(path, callback)
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

}

export default TemplateManager