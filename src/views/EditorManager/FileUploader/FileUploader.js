/* global VueHelper, WindowHelper, SemanticUIHelper, ConfigHelper */

import draggable from 'vuedraggable'

let config = {
  data: function () {
    return {
      name: 'FileUploader',
      ui: undefined,
      delimiter: ', ',
      links: [],
      template: ``,
      templateSlide: ``,
    }
  },
  mounted: function () {
    //console.log(ConfigHelper.get('FileUploader').links)
    VueHelper.mountLocalStorageJSON(this, 'links', ConfigHelper.get('FileUploader').links)
    VueHelper.mountLocalStorageJSON(this, 'delimiter', ConfigHelper.get('FileUploader').delimiter)
    VueHelper.mountLocalStorageJSON(this, 'downloadTemplate', ConfigHelper.get('FileUploader').downloadTemplate)
    VueHelper.mountLocalStorageJSON(this, 'downloadTemplateSlide', ConfigHelper.get('FileUploader').downloadTemplateSlide)
    this.resetDownloadURL()
    
    // VueHelper.mountLocalStorage(this, 'delimiter')
  },
  computed: {
    enableInsert: function () {
      // console.log(this.links)
      for (let i = 0; i < this.links.length; i++) {
        // console.log(this.links[i].downloadURL)
        if (this.validateDownloadURL(this.links[i].downloadURL)) {
          return 'green'
        }
      }
      
      return 'disabled'
    }
  },
  created: function () {
    $v[this.name] = this
  },
  components: {
    draggable,
  },
  methods: {
    // ---------------------
    // Methods of Modal
    // ---------------------
    
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    },
    open: function () {
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    },
    convertGitHubPage: function (link) {
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
    },
    insert: function () {
      let output = []

      let template = this.downloadTemplate
      let GOOGLE_SLIDE, GOOGLE_SLIDE_PDF

      this.links.forEach((link, i) => {
        if (this.validateDownloadURL(link.downloadURL)) {
          let url = link.downloadURL
          if (url.startsWith('https://github.com/') && url.indexOf('/blob/master/') > 0) {
            url = this.convertGitHubPage(url)
          }
          else if (url.startsWith(`https://docs.google.com/presentation/d/`) && url.endsWith('/edit?usp=sharing')) {
            template = this.downloadTemplateSlide

            GOOGLE_SLIDE = url
            GOOGLE_SLIDE_PDF = this.convertGoogleDrive(url, 'pdf')

            url = this.convertGoogleDrive(url, link.parameters)
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
        // $v.EditorManager.FieldPostBody.insert('<p>' + output.join(this.delimiter) + '</p>')

        if (GOOGLE_SLIDE && template.indexOf(`{GOOGLE_SLIDE}`) > -1) {
          template = template.split(`{GOOGLE_SLIDE}`).join(GOOGLE_SLIDE)
        }

        if (GOOGLE_SLIDE_PDF && template.indexOf(`{GOOGLE_SLIDE_PDF}`) > -1) {
          template = template.split(`{GOOGLE_SLIDE_PDF}`).join(GOOGLE_SLIDE_PDF)
        }

        if (template.indexOf(`{DOWNLOADS}`) > -1) {
          template = template.split(`{DOWNLOADS}`).join(output.join(this.delimiter))
        }

        $v.EditorManager.FieldPostBody.insert(template)
      }
      
      this.close()
      this.resetDownloadURL()
    },
    openTab: function (e) {
      SemanticUIHelper.openTab(e)
    },
    openUploadURL: function (url, name) {
      // WindowHelper.popup(url, name)
      WindowHelper.forcePopup(url, name)
    },
    onSettingChange: function () {
      VueHelper.persistLocalStorage(this, 'links')
      VueHelper.persistLocalStorage(this, 'delimiter')
      VueHelper.persistLocalStorage(this, 'downloadTemplate')
      VueHelper.persistLocalStorage(this, 'downloadTemplateSlide')
      this.links = this.links.concat([])
    },
    resetDownloadURL: function () {
      if (Array.isArray(this.links) === false) {
        this.links = []
      }
      this.links.forEach(link => {
        link.downloadURL = ''
      })
    },
    linkNameIcon: function (name) {
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
    },
    validateDownloadURL: function (url) {
      return (typeof(url) === 'string' && url.length > 4)
    },
    onDelimiterChange: function () {
      VueHelper.persistLocalStorage(this, 'delimiter')
    },
    getConfig: function () {
      let links = JSON.parse(JSON.stringify(this.links))
      return links.map(link => {
        delete link.downloadURL
        return link
      })
    },
    setConfig: function (links) {
      if (typeof(links) === 'string') {
        links = JSON.parse(links)
      }
      //console.log('FileUploader setConfig')
      //console.log(links)
      this.links = links
      this.resetDownloadURL()
    },
    addSetting: function () {
      this.links.push({
        name: '',
        uploadURL: ''
      })
    },
    removeSetting: function (i) {
      this.links.splice(i, 1)
    },
    popup: function (url) {
      WindowHelper.forcePopup(url)
    },
    convertGoogleDrive (url, type = 'pdf') {
      let parts = url.trim().split('/')
      let format = parts[3]
      let id = parts[5]
      return `https://docs.google.com/${format}/d/${id}/export/${type}`
    },
    convertGitHubPagePrefix (link) {
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
}

export default config