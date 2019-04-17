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
      for (let i = 0; i < this.links.length; i++) {
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
    insert: function () {
      let output = []
      this.links.forEach((link) => {
        if (this.validateDownloadURL(link.downloadURL)) {
          let aTag = $(`<a href="${link.downloadURL}" target="_blank">${link.name}</a>`)[0]
          output.push(aTag)
        } 
      })
      
      for (let i = 0; i < output.length; i++) {
        if (i > 0) {
          $v.EditorManager.FieldPostBody.insert(this.delimiter)
        }
        
        let node = output[i]
        $v.EditorManager.FieldPostBody.insert(node)
      }
      
      
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
        return
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
      return (typeof(url) === 'string' 
              && url.length > 4)
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
      console.log('FileUploader setConfig')
      console.log(links)
      this.links = links
      this.resetDownloadURL()
    }
  }
}

export default config