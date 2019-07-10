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
      onCloseReload: false,
      onCloseReloadI18n: false,
      locale: ConfigHelper.get('locale'),
      localeOptions: ConfigHelper.get('localeOptions'),
      backupPageURL: '',
      tab: 'interface'
    }
  },
  mounted() {
    VueHelper.mountLocalStorage(this, 'locale', ConfigHelper.get('locale'))
    VueHelper.mountLocalStorage(this, 'backupPageURL', 'https://drive.google.com/drive/u/0/my-drive')
    
    //console.log(this.enableBackupPageButton)
  },
  created: function () {
    $v[this.name] = this
    //console.log(this.$t('Config Manager'))
  },
  computed: {
    enableBackupPageButton: function () {
      //console.log(this.backupPageURL)
      //console.log(this.backupPageURL.startsWith('https://drive.google.com/drive/u/0/'))
      return (this.backupPageURL.startsWith('https://drive.google.com/drive/u/0/'))
    }
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        this.ui = $(this.$refs.modal)
        this.ui.find('select.dropdown').dropdown()
      }
      return this.ui
    },
    open: function (tab) {
      if (typeof(tab) === 'string') {
        //this.tab = tab
        this.openTab(tab)
        console.log(tab)
      }
      //console.log(this.data)
      this.getUI().modal('show')
      //this.getUI().find('.backup.button').focus()
    },
    close: function () {
      if (this.onCloseReloadI18n === true) {
        this.onCloseReloadI18n = false
        WindowHelper.confirm(this.$t('You need reload this page to change language. <br />Do you want to reload?'), () => {
          // yes reload
          location.reload()
        }, () => {
          // no just close
          this.close()
        })
        return
      }
      
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
      let zip = new JSZip()
      let date = DayjsHelper.nowFormat('YYYY-MMDD')
      let folderName = `blogger-editor-config-${date}`
      let folder = zip.folder(folderName)
      
      let queue = [
        (next) => {
          $v.ThemeManager.getConfig((template, style) => {
            if (template !== undefined) {
              folder.file('template.html', template)
            }
            if (style !== undefined) {
              folder.file('style.css', style)
            }
            
            next()
          })
        },
        (next) => {
          $v.EditorManager.SnippetInserter.getConfig((snippets) => {
            if (snippets !== undefined) {
              folder.file('SnippetInserter.json', JSON.stringify(snippets))
            }
            
            next()
          })
        },
        (next) => {
          let editorConfig = $v.EditorManager.getConfig()
          folder.file('editorConfig.json', JSON.stringify(editorConfig))

          let FileUploaderConfig = $v.EditorManager.FileUploader.getConfig()
          folder.file('FileUploaderConfig.json', JSON.stringify(FileUploaderConfig))

          next()
        },
        (next) => {
          zip.generateAsync({type: "blob"}).then((content) => {
            // see FileSaver.js
            saveAs(content, `${folderName}.zip`)
        })
        }
      ]
      
      let loop = (i) => {
        if (i < queue.length) {
          queue[i](() => {
            i++
            loop(i)
          })
        }
      }
      loop(0)
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
        else if (path.endsWith('/FileUploaderConfig.json')) {
          $v.EditorManager.FileUploader.setConfig(content)
          FunctionHelper.triggerCallback(callback)
        }
        else if (path.endsWith('/SnippetInserter.json')) {
          $v.EditorManager.SnippetInserter.setConfig(content)
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
    persistLocale() {
      this.onCloseReloadI18n = true
      this.persist()
    },
    persist() {
      VueHelper.persistLocalStorage(this, 'locale')
      VueHelper.persistLocalStorage(this, 'backupPageURL')
    },
    openBackupPageURL() {
      if (this.enableBackupPageButton) {
        WindowHelper.popup(this.backupPageURL, 'ConfigManager.backupPageURL')
      }
    },
    openTab: function (e) {
      let tab = e
      if (typeof(tab) === 'object') {
        tab = $(e.target).attr('data-tab')
      }
      this.tab = tab
      
      if (typeof(e) === 'string') {
        e = $(this.$refs[e])
      }
      SemanticUIHelper.openTab(e)
    },
  }
}

//window.EditorManager = EditorManager
export default config