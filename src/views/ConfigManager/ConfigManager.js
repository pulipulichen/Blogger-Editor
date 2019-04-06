let config = {
  //name: "main-content",
  data: function () {
    return {
      name: 'ConfigManager',
      ui: undefined,
      onCloseReload: false
    }
  },
  mounted() {
  },
  created: function () {
    $v[this.name] = this
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    },
    open: function () {
      //console.log(this.data)
      this.getUI().modal('show')
    },
    close: function () {
      
      if (this.onCloseReload === true) {
        this.onCloseReload = false
        InitHelper.reload(() => {
          this.getUI().modal('hide')
        })
      }
      else {
        this.getUI().modal('hide')
      }
      
    },
    configDownload: function () {
      //console.log('configDownload')
      
      let config = {
        image: {
          uploadImageDraft: this.uploadImageDraft,
          imageSizeDefault: this.imageSizeDefault
        },
        toolbar: {
          toolbar: this.SummerNoteConfig.toolbar(false),
          styleTags: this.SummerNoteConfig.styleTags(false),
        }
      }
      
      config = JSON.stringify(config)
      FileHelper.save(config, 'editorConfig.json')
    },
    triggerConfigUpload: function (e) {
      $(e.target).parent().children('input:file:first').click()
    },
    configUpload: function (e) {
      let files = e.target.files
      this.readConfig(files)
    },
    configDrop: function (e) {
      //console.log('configDrop')
      let files = e.dataTransfer.files
      this.readConfig(files)
    },
    readConfig: function (files) {
      if (files.length !== 1 
              || files[0].type !== 'application/json') {
        return this
      }
      //console.log(files[0])
      
      FileSystemHelper.readEventFilesText(files[0], (config) => {
        //console.log(config)
        config = JSON.parse(config)
        this.setConfig(config)
        WindowHelper.alert('Config uploaded')
      })
      return this
    },
    setConfig: function (config) {
      if (typeof(config.image) === 'object') {
        let image = config.image
        if (typeof(image.uploadImageDraft) === 'string') {
          this.uploadImageDraft = image.uploadImageDraft
        }
        if (typeof(image.imageSizeDefault) === 'number') {
          this.imageSizeDefault = image.imageSizeDefault
        }
      }
      if (typeof(config.toolbar) === 'object') {
        let toolbar = config.toolbar
        if (Array.isArray(toolbar.toolbar)) {
          this.summerNoteConfigToolbar = JSON.stringify(toolbar.toolbar)
          if (this.summerNoteConfigToolbar === '[]') {
            this.summerNoteConfigToolbar = ''
          }
        }
        if (Array.isArray(toolbar.styleTags)) {
          this.summerNoteConfigStyleTags = JSON.stringify(toolbar.styleTags)
          if (this.summerNoteConfigStyleTags === '[]') {
            this.summerNoteConfigStyleTags = ''
          }
        }
      }
    },
  }
}

//window.EditorManager = EditorManager
export default config