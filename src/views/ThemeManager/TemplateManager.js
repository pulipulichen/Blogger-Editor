let TemplateManager = {
  selector: '#template',
  path: '/template.html',
  upload: function () {
    console.log('TemplateManager.upload')
  },
  reset: function () {
    console.log('TemplateManager.reset')
  },
  open: function () {
    console.log('TemplateManager.open')
  },
  download: function () {
    console.log('TemplateManager.download')
  },
  getCustom: function (callback) {
    let path = this.path
    FileSystemHelper.read(path, callback)
  },
  load: function (defaultTheme, callback) {
    let path = this.path
    FileSystemHelper.read(path, (template) => {
      if (template === undefined) {
        path = 'themes/' + defaultTheme + '/template.html'
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