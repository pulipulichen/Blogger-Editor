import FileUploaderMethodsInsert from './FileUploaderMethodsInsert.js'

export default function (app) {
  if (!app.methods) {
    app.methods = {}
  }

  FileUploaderMethodsInsert(app)

  // ---------------------
  // Methods of Modal
  // ---------------------
  
  app.methods.getUI = function () {
    if (typeof(this.ui) === 'undefined') {
      //console.log('find ui')
      this.ui = $(this.$refs.modal)
    }
    return this.ui
  }
  app.methods.open = function () {
    this.getUI().modal('show')
  }
  app.methods.close = function () {
    this.getUI().modal('hide')
  }
  
  app.methods.openTab = function (e) {
    SemanticUIHelper.openTab(e)
  }
  app.methods.openUploadURL = function (url, name) {
    // WindowHelper.popup(url, name)
    WindowHelper.forcePopup(url, name)
  }
  
  app.methods.resetDownloadURL = function () {
    if (Array.isArray(this.links) === false) {
      this.links = []
    }
    this.links.forEach(link => {
      link.downloadURL = ''
    })
  }

  app.methods.validateDownloadURL = function (url) {
    return (typeof(url) === 'string' && url.length > 4)
  }
  app.methods.onDelimiterChange = function () {
    VueHelper.persistLocalStorage(this, 'delimiter')
  }
  app.methods.getConfig = function () {
    let links = JSON.parse(JSON.stringify(this.links))
    return links.map(link => {
      delete link.downloadURL
      return link
    })
  }
  app.methods.setConfig = function (links) {
    if (typeof(links) === 'string') {
      links = JSON.parse(links)
    }
    //console.log('FileUploader setConfig')
    //console.log(links)
    this.links = links
    this.resetDownloadURL()
  }
  app.methods.addSetting = function () {
    this.links.push({
      name: '',
      uploadURL: ''
    })
  }
  app.methods.removeSetting = function (i) {
    this.links.splice(i, 1)
  }
  app.methods.popup = function (url) {
    WindowHelper.forcePopup(url)
  }
  
}