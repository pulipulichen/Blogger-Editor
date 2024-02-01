export default function (app) {
  if (!app.computed) {
    app.computed = {}
  }

  app.computed.disableOpenBloggerConsole = function () {
    if (!this.bloggerConsoleURL || 
          this.bloggerConsoleURL === 'https://www.blogger.com' || 
          //|| this.bloggerConsoleURL.startsWith('https://www.blogger.com/blogger.g?blogID=')) {
          this.bloggerConsoleURL.startsWith('https://www.blogger.com/')) {
      return false
    }
    else {
      return true
    }
  }
  app.computed.disableOpenEditURL = function () {
    //if (this.editURL.startsWith('https://www.blogger.com/blogger.g?blogID=')
    if (this.editURL.startsWith('https://www.blogger.com/blog/post/edit/')
            || this.editURL.startsWith('https://www.blogger.com/blog/page/edit/')) {
      return false
    }
    else {
      return true
    }
  }
  app.computed.disableOpenPublicURL = function () {
    if (this.publicURL.startsWith('http') || this.publicURL.startsWith('//')) {
      return false
    }
    else {
      return true
    }
  }
  app.computed.enableImageUpload = function () {
    // return (this.filesystemImageCount > 0 && this.disableOpenEditURL === false)
    return (this.filesystemImageCount > 0)
  }
  app.computed.postTitleSafe = function () {
    let title = this.postTitle
    
    if (title.indexOf('/') > -1) {
      title = title.slice(0, title.indexOf('/')).trim()
    }
    
    if (title.length > 20) {
      title = title.slice(0, 20).trim()
    }
    
    return title
  }
  app.computed.googleTransLink = function () {
    let postTitle = this.postTitle
    
    let slashPos = postTitle.indexOf(' / ')
    if (slashPos > -1) {
      postTitle = postTitle.slice(0, slashPos).trim()
    }
    
    postTitle = postTitle.trim()
    postTitle = encodeURIComponent(postTitle)
    
    return `https://translate.google.com.tw/?sl=zh-TW&tl=en&text=${postTitle}&op=translate`
  }
  
  // app.computed.bloggerConsoleURL = function () {
  //   // @TODO
  // }
}