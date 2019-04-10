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
    //console.log(this.$t('Config Manager'))
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
              || files[0].type !== 'application/zip') {
        return this
      }
      
      this.onCloseReload = true
      
      FileHelper.readZip(files[0], (file, callback)=> {
        let path = file.path
        let content = file.content
        if (path.endsWith('/editorConfig.json')) {
          $v.EditorManager.setConfig(content)
          FunctionHelper.triggerCallback(callback)
        }
        else if (path.endsWith('/template.html')) {
          $v.ThemeManager.TemplateManager.setConfig(content, callback)
        }
        else if (path.endsWith('/style.css')) {
          $v.ThemeManager.StyleManager.setConfig(content, callback)
        }
      }, () => {
        //console.log('finish')
        WindowHelper.alert('Config restored.')
      })
      return this
    },
  }
}

//window.EditorManager = EditorManager
export default config