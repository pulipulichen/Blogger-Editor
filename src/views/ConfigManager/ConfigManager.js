import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
import dayjs from 'dayjs'

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
      this.getUI().find('.backup.button').focus()
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
      
      let editorConfig = $v.EditorManager.getConfig()
      $v.ThemeManager.getConfig((template, style) => {
        let zip = new JSZip()
        let date = DayjsHelper.nowFormat('YYYY-MMDD')
        let folderName = `blogger-editor-config-${date}`
        let folder = zip.folder(folderName);

        
        folder.file('editorConfig.json', JSON.stringify(editorConfig))
        if (template !== undefined) {
          folder.file('template.html', template)
        }
        if (style !== undefined) {
          folder.file('style.css', style)
        }
        
        zip.generateAsync({type: "blob"}).then((content) => {
          // see FileSaver.js
            saveAs(content, `${folderName}.zip`)
        })
      })
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