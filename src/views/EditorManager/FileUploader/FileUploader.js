/* global VueHelper, WindowHelper, SemanticUIHelper, ConfigHelper */

import draggable from 'vuedraggable'

let config = {
  data: function () {
    return {
      name: 'FileUploader',
      ui: undefined,
      delimiter: ', ',
      links: []
    }
  },
  mounted: function () {
    //console.log(ConfigHelper.get('FileUploader').links)
    VueHelper.mountLocalStorageJSON(this, 'links', ConfigHelper.get('FileUploader').links)
    this.resetDownloadURL()
    
    VueHelper.mountLocalStorage(this, 'delimiter')
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
      this.links.forEach((link) => {
        if (this.validateDownloadURL(link.downloadURL)) {
          let url = link.downloadURL
          if (url.startsWith('https://github.com/') && url.indexOf('/blob/master/') > 0) {
            url = this.convertGitHubPage(url)
          }
          
          let aTag = `<a href="${url}" target="_blank">${link.name}</a>`
          output.push(aTag)
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
      $v.EditorManager.FieldPostBody.insert('<p>' + output.join(this.delimiter) + '</p>')
      
      
      this.close()
      this.resetDownloadURL()
    },
    openTab: function (e) {
      SemanticUIHelper.openTab(e)
    },
    openUploadURL: function (url, name) {
      WindowHelper.popup(url, name)
    },
    onSettingChange: function () {
      VueHelper.persistLocalStorage(this, 'links')
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
    }
  }
}

export default config