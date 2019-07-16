let EditorManagerConfig = {
  EditorManager: null,
  init: function (EditorManager) {
    this.EditorManager = EditorManager
  },
  configDownload: function () {
    //console.log('configDownload')

    let config = this.getConfig()
    config = JSON.stringify(config)
    
    let nowFormat = DayjsHelper.nowFormat()
    let filename = `editorConfig-${nowFormat}.json`
    
    FileHelper.save(config, filename)
  },
  getConfig: function () {
    let EditorManager = this.EditorManager
    let t = (key) => {
      return this.$t(key)
    }
    
    let config = {
      image: {
        uploadImageDraft: EditorManager.uploadImageDraft,
        imageSizeDefault: EditorManager.imageSizeDefault
      },
      toolbar: {
        toolbar: EditorManager.SummerNoteConfig.toolbar(t, false),
        styleTags: EditorManager.SummerNoteConfig.styleTags(t, false),
      }
    }
    return config
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
      WindowHelper.alert(this.$t('Config uploaded'))
    })
    return this
  },
  setConfig: function (config) {
    let EditorManager = this.EditorManager
    
    if (typeof(config) === 'string') {
      config = JSON.parse(config)
    }

    if (typeof(config.image) === 'object') {
      let image = config.image
      if (typeof(image.uploadImageDraft) === 'string') {
        EditorManager.uploadImageDraft = image.uploadImageDraft
      }
      if (typeof(image.imageSizeDefault) === 'number') {
        EditorManager.imageSizeDefault = image.imageSizeDefault
      }
    }
    if (typeof(config.toolbar) === 'object') {
      let toolbar = config.toolbar
      if (Array.isArray(toolbar.toolbar)) {
        let setting = JSON.stringify(toolbar.toolbar)
        if (setting === '[]') {
          setting = ''
        }
        EditorManager.summerNoteConfigToolbar = setting
      }
      if (Array.isArray(toolbar.styleTags)) {
        let setting = JSON.stringify(toolbar.styleTags)
        if (setting === '[]') {
          setting = ''
        }
        EditorManager.summerNoteConfigStyleTags = setting
      }
    }
  },
}

export default EditorManagerConfig