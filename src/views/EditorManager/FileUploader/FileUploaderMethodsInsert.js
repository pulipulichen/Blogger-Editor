export default function (app) {
  if (!app.methods) {
    app.methods = {}
  }

  app.methods.init = function () {
    
    //console.log(ConfigHelper.get('FileUploader').links)
    VueHelper.mountLocalStorageJSON(this, 'links', ConfigHelper.get('FileUploader').links)
    VueHelper.mountLocalStorageJSON(this, 'delimiter', ConfigHelper.get('FileUploader').delimiter)
    VueHelper.mountLocalStorageJSON(this, 'downloadTemplate', ConfigHelper.get('FileUploader').downloadTemplate)
    VueHelper.mountLocalStorageJSON(this, 'downloadTemplateSlide', ConfigHelper.get('FileUploader').downloadTemplateSlide)
    VueHelper.mountLocalStorageJSON(this, 'downloadTemplateSheet', ConfigHelper.get('FileUploader').downloadTemplateSheet)
    VueHelper.mountLocalStorageJSON(this, 'downloadTemplateDoc', ConfigHelper.get('FileUploader').downloadTemplateDoc)
    this.resetDownloadURL()
  }

  app.methods.onSettingChange = function () {
    VueHelper.persistLocalStorage(this, 'links')
    VueHelper.persistLocalStorage(this, 'delimiter')
    VueHelper.persistLocalStorage(this, 'downloadTemplate')
    VueHelper.persistLocalStorage(this, 'downloadTemplateSlide')
    VueHelper.persistLocalStorage(this, 'downloadTemplateSheet')
    VueHelper.persistLocalStorage(this, 'downloadTemplateDoc')
    this.links = this.links.concat([])
  }

  app.methods.convertGitHubPage = function (link) {
    // https://github.com/pulipulichen/blog-pulipuli-info-data-2019/blob/master/10/20180518%20KALS.pptx
    // https://pulipulichen.github.io/blog-pulipuli-info-data-2019/10/20180518%20KALS.pptx
    
    //let link = "https://github.com/pulipulichen/blog-pulipuli-info-data-2019/blob/master/10/20180518%20KALS.pptx"
    if (link.startsWith('https://github.com/') === false || link.indexOf('/blob/master/') === -1) {
      return link
    }
    
    let parts = link.split('/')
    let user = parts[3]
    let repo = parts[4]
    
    let needle = '/blob/master/'
    let path = link.slice(link.indexOf(needle) + needle.length)
    
    let pageLink = `https://${user}.github.io/${repo}/${path}`
    //console.log(pageLink)
    
    return pageLink
  }
  app.methods.insert = async function () {
    let output = []

    let template = this.downloadTemplate
    let THUMBNAIL_URL, GOOGLE_SLIDE, GOOGLE_SLIDE_PDF,
      GOOGLE_SHEET, GOOGLE_SHEET_ODS,
      GOOGLE_DOC, GOOGLE_DOC_ODT, GOOGLE_DOC_PDF

    this.links.forEach((link, i) => {
      if (this.validateDownloadURL(link.downloadURL)) {
        let url = link.downloadURL
        if (url.startsWith('https://github.com/') && url.indexOf('/blob/master/') > 0) {
          url = this.convertGitHubPage(url)
        }
        else if (url.startsWith(`https://docs.google.com/presentation/d/`) && url.endsWith('/edit?usp=sharing')) {
          template = this.downloadTemplateSlide

          THUMBNAIL_URL = url
          GOOGLE_SLIDE = url
          GOOGLE_SLIDE_PDF = this.convertGoogleDriveSlide(url, 'pdf')

          url = this.convertGoogleDriveSlide(url, 'pptx')
        }
        else if (url.startsWith(`https://docs.google.com/spreadsheets/d/`) && url.endsWith('/edit?usp=sharing')) {
          template = this.downloadTemplateSheet

          THUMBNAIL_URL = url
          GOOGLE_SHEET = url
          GOOGLE_SHEET_ODS = this.convertGoogleDrive(url, 'ods')

          url = this.convertGoogleDrive(url, 'ods')
        }
        else if (url.startsWith(`https://docs.google.com/document/d/`) && url.endsWith('/edit?usp=sharing')) {
          template = this.downloadTemplateDoc

          THUMBNAIL_URL = url
          GOOGLE_DOC = url
          GOOGLE_DOC_PDF = this.convertGoogleDrive(url, 'pdf')
          GOOGLE_DOC_ODT = this.convertGoogleDrive(url, 'odt')

          url = this.convertGoogleDrive(url, 'odt')
        }

        if (link.name === 'GitHub' && !url.startsWith('https://')) {
          url = this.convertGitHubPagePrefix(link)
          
        }
        // https://docs.google.com/presentation/d/1-g9QmXvH6I0-cd6rIbwwORgGST86vGsxOIjrcJxNCDs/edit?usp=sharing

        
        let aTag = `<a href="${url}" target="_blank">${link.name}</a>`
        // if (i > 0) {
        //   aTag = this.delimiter + aTag
        // }
        output.push(aTag)

        // $v.EditorManager.FieldPostBody.insert(aTag)
      } 
    })
    
    /*
    for (let i = 0; i < output.length; i++) {
      if (i > 0) {
        $v.EditorManager.FieldPostBody.insert(this.delimiter)
      }
      
      let node = output[i]
      $v.EditorManager.FieldPostBody.insert(node)
    }
    */
    //console.log(output.join(this.delimiter))
    //console.log(output)
    if (output.length > 0) {

      template = await this.replaceTemplace(template, {
        THUMBNAIL_URL,
        GOOGLE_SLIDE,
        GOOGLE_SLIDE_PDF,
        GOOGLE_SHEET,
        GOOGLE_SHEET_ODS,
        GOOGLE_DOC,
        GOOGLE_DOC_PDF,
        GOOGLE_DOC_ODT
      })

      if (template.indexOf(`{DOWNLOADS}`) > -1) {
        template = template.split(`{DOWNLOADS}`).join(output.join(this.delimiter))
      }

      $v.EditorManager.FieldPostBody.insert(template)
    }
    
    this.close()
    this.resetDownloadURL()
  }

  app.methods.replaceTemplace = async function (template, replaceList) {
    let keys = Object.keys(replaceList)
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let value = replaceList[key]

      if (!value) {
        continue
      }

      if (template.indexOf(`{${key}}`) === -1) {
        continue
      }

      template = template.split(`{${key}}`).join(value)
    }
      
    return template
  }
  
  app.methods.linkNameIcon = function (name) {
    if (name === undefined) {
      return false
    }
    
    name = name.toLowerCase()
    name = name.split(' ').join('')
    if (name === 'github') {
      return 'github'
    }
    else if (name === 'googledrive') {
      return 'google drive'
    }
  }
  
  app.methods.convertGoogleDriveSlide = function (url, type = 'pdf') {
    let parts = url.trim().split('/')
    let format = parts[3]
    let id = parts[5]
    return `https://docs.google.com/${format}/d/${id}/export/${type}`
  }

  app.methods.convertGoogleDrive = function (url, type = 'pdf') {
    let parts = url.trim().split('/')
    let format = parts[3]
    let id = parts[5]
    return `https://docs.google.com/${format}/d/${id}/export?format=${type}`
  }

  app.methods.convertGitHubPagePrefix = function (link) {
    let url = link.downloadURL
    if (url.startsWith('/')) {
      url = url.slice(1)
    }
    let prefixURL = link.parameters

    let date = new Date()
    let YY = (date.getFullYear() + '').slice(2)
    prefixURL = prefixURL.split(`{YY}`).join(YY)

    let MM = date.getMonth() + 1
    if (MM < 10) {
      MM = '0' + MM
    }
    prefixURL = prefixURL.split(`{MM}`).join(MM)

    url = prefixURL + url

    return url
  }
}