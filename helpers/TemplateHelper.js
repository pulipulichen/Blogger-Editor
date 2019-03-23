TemplateHelper = {
  init: function (callback) {
    //let name = 'default'
    let name = 'simple'
    
    let templatePath = 'themes/' + name + '/template.html'
    let stylePath = 'themes/' + name + '/style.css'
    $(`<link href="${stylePath}" rel="stylesheet" type="text/css" />`)
            .appendTo('head')
    
    $.get(templatePath, (template) => {
      //console.log(template)
      //let titleEditor = `<input type="text" name="postTitle" id="postTitle" />`
      let titleEditor = `<div id="summernotePostTitle">Post Title [TEMP]</div>`
      template = template.replace('${postTitle}', titleEditor)
      
      let postEditor = `<div id="summernotePostBody"><p>HelloAAAA</p><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><p>Summernote</p></div>`
      template = template.replace('${postBody}', postEditor)
      
      $('#template').html(template)
      
      FunctionHelper.triggerCallback(callback)
    })
  },
}