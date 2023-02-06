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
      tab: 'interface',
      googleAnalyticsTrackingId: '',
      googleAnalyticsReportURL: '',
      googleAnalyticsRealtimeReportURL: '',
      eventTrackDayLimit: 3,
      apiKeysChatGPT: '',
      apiKeysAPILayer: '',
      apiKeysTrans: '',
      apiKeysURLScreenshot: '',
    }
  },
  mounted() {
    VueHelper.mountLocalStorage(this, 'locale', ConfigHelper.get('locale'))
    VueHelper.mountLocalStorage(this, 'backupPageURL', 'https://drive.google.com/drive/u/0/my-drive')
    VueHelper.mountLocalStorage(this, 'googleAnalyticsTrackingId')
    VueHelper.mountLocalStorage(this, 'googleAnalyticsReportURL')
    VueHelper.mountLocalStorage(this, 'googleAnalyticsRealtimeReportURL')
    VueHelper.mountLocalStorageInt(this, 'eventTrackDayLimit')
    
    VueHelper.mountLocalStorage(this, 'apiKeysChatGPT')
    VueHelper.mountLocalStorage(this, 'apiKeysAPILayer')
    VueHelper.mountLocalStorage(this, 'apiKeysTrans')
    VueHelper.mountLocalStorage(this, 'apiKeysURLScreenshot')

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
    },
    enableReportButton: function () {
      //console.log(this.backupPageURL)
      //console.log(this.backupPageURL.startsWith('https://drive.google.com/drive/u/0/'))
      return (this.googleAnalyticsReportURL.startsWith('https://analytics.google.com/analytics/web/#/'))
    },
    enableRealtimeReportButton: function () {
      //console.log(this.backupPageURL)
      //console.log(this.backupPageURL.startsWith('https://drive.google.com/drive/u/0/'))
      return (this.googleAnalyticsRealtimeReportURL.startsWith('https://analytics.google.com/analytics/web/#/realtime/rt-event/'))
    },
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
        return this
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
      VueHelper.persistLocalStorage(this, 'googleAnalyticsTrackingId')
      VueHelper.persistLocalStorage(this, 'googleAnalyticsReportURL')
      VueHelper.persistLocalStorage(this, 'googleAnalyticsRealtimeReportURL')
      VueHelper.persistLocalStorage(this, 'eventTrackDayLimit')

      VueHelper.persistLocalStorage(this, 'apiKeysChatGPT')
      VueHelper.persistLocalStorage(this, 'apiKeysAPILayer')
      VueHelper.persistLocalStorage(this, 'apiKeysTrans')
      VueHelper.persistLocalStorage(this, 'apiKeysURLScreenshot')
    },
    openBackupPageURL() {
      if (this.enableBackupPageButton) {
        WindowHelper.popup(this.backupPageURL, 'ConfigManager.backupPageURL')
      }
    },
    openReportURL() {
      if (this.enableReportButton) {
        WindowHelper.popup(this.googleAnalyticsReportURL, 'ConfigManager.googleAnalyticsReportURL')
      }
    },
    openRealtimeReportURL() {
      if (this.enableRealtimeReportButton) {
        WindowHelper.popup(this.googleAnalyticsRealtimeReportURL, 'ConfigManager.googleAnalyticsRealtimeReportURL')
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
    downloadEventTrackData: function (e) {
      let dayLimit = this.eventTrackDayLimit
      if (dayLimit <= 0) {
        dayLimit = undefined
      }
      GoogleAnalyticsHelper.databaseSelect(this.eventTrackDayLimit, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].action = this.filterAction(data[i].action)
          data[i].timestamp = DayjsHelper.format(data[i].unix, 'YYYY/MM/DD HH:mm:ss')
        }
        
        let filename = this.buildEventTrackDownloadFilename('events', dayLimit)
        
        FileHelper.saveCSV(data, filename)
      })
      return this
    },
    downloadEventTrackProductionData: function (e) {
      let dayLimit = this.eventTrackDayLimit
      if (dayLimit <= 0) {
        dayLimit = undefined
      }
      GoogleAnalyticsHelper.databaseSelectProduction(this.eventTrackDayLimit, (data) => {
        for (let i = 0; i < data.length; i++) {
          let timestamp = DayjsHelper.format(data[i].unix, 'YYYY/MM/DD HH:mm:ss')
          let action = JSON.parse(data[i].action)
          let timeSpent = action.timeSpent.split(':')
          let min = (parseInt(timeSpent[0], 10)*60) + parseInt(timeSpent[1], 10)
          data[i] = {
            timestamp: timestamp,
            minSpent: min,
            charCount: action.charCount,
            wordCount: action.wordCount,
            imageCount: action.imageCount
          }
        }
        
        let filename = this.buildEventTrackDownloadFilename('production', dayLimit)
        
        FileHelper.saveCSV(data, filename)
      })
      return this
    },
    downloadEventTrackStrengthData: function (e) {
      let dayLimit = this.eventTrackDayLimit
      if (dayLimit <= 0) {
        dayLimit = undefined
      }
      GoogleAnalyticsHelper.databaseSelectStrength(this.eventTrackDayLimit, (data) => {
        let aggrData = []
        let lastTimestamp
        let lastData
        for (let i = 0; i < data.length; i++) {
          let timestamp = DayjsHelper.format(data[i].unix, 'YYYY/MM/DD HH:')
          let mm = DayjsHelper.format(data[i].unix, 'mm')
          mm = Math.floor(parseInt(mm, 10) / 10) * 10
          if (mm < 10) {
            mm = '0' + mm
          }
          timestamp = timestamp + mm
          if (lastTimestamp !== timestamp) {
            if (lastData !== undefined) {
              aggrData.push(lastData)
            }
            
            lastData = {
              timestamp: timestamp,
              strength: 1
            }
            lastTimestamp = timestamp
          }
          else {
            lastData.strength++
          }
        }
        
        let filename = this.buildEventTrackDownloadFilename('strength', dayLimit)
        //console.log(aggrData)
        FileHelper.saveCSV(aggrData, filename)
      })
      return this
    },
    downloadEventTrackModificationData: function (e) {
      window.alert('TODO #278')
      /*
      let dayLimit = this.eventTrackDayLimit
      if (dayLimit <= 0) {
        dayLimit = undefined
      }
      GoogleAnalyticsHelper.databaseSelectStrength(this.eventTrackDayLimit, (data) => {
        let aggrData = []
        let lastTimestamp
        let lastData
        for (let i = 0; i < data.length; i++) {
          let timestamp = DayjsHelper.format(data[i].unix, 'YYYY/MM/DD HH:')
          let mm = DayjsHelper.format(data[i].unix, 'mm')
          mm = Math.floor(parseInt(mm, 10) / 10) * 10
          if (mm < 10) {
            mm = '0' + mm
          }
          timestamp = timestamp + mm
          if (lastTimestamp !== timestamp) {
            if (lastData !== undefined) {
              aggrData.push(lastData)
            }
            
            lastData = {
              timestamp: timestamp,
              strength: 1
            }
            lastTimestamp = timestamp
          }
          else {
            lastData.strength++
          }
        }
        
        let filename = this.buildEventTrackDownloadFilename('strength', dayLimit)
        //console.log(aggrData)
        FileHelper.saveCSV(aggrData, filename)
      })
       */
      return this
    },
    buildEventTrackDownloadFilename: function (basename, dayLimit) {
      let unix = DayjsHelper.unix()
      let endYYYYMMDD = DayjsHelper.format('YYYYMMDD')
      
      let filename = [basename, $v.PostManager.editingPostId]
      if (dayLimit !== undefined) {
        let unixLimit = unix - (dayLimit * 60 * 24)
        let startYYYYMMDD = DayjsHelper.format(unixLimit, 'YYYYMMDD')
        if (startYYYYMMDD !== endYYYYMMDD) {
          filename.push(startYYYYMMDD)
        }
      }
      filename.push(endYYYYMMDD)
      filename = filename.join('-')
      return filename
    },
    filterAction: function (action) {
      if (typeof(action) === 'string' && 
              ( (action.startsWith('{') && action.endsWith('}')) || (action.startsWith('[') && action.endsWith(']')) )
              ) {
        action = JSON.parse(action)
      }
      
      if (Array.isArray(action)) {
        action = action.join(';')
      }
      else if (typeof(action) === 'object') {
        let output = []
        for (let key in action) {
          let value = action[key]
          output.push(`${key}:${value}`)
        }
        action = output.join(';')
        //console.log(action)
      }
      return action
    },
    clearEventTrackData: function (e) {
      GoogleAnalyticsHelper.databaseReset()
      return this
    },
    openChatGPTConfig () {
      WindowHelper.popup('https://platform.openai.com/account/api-keys', 'ChatGPT API Key')
    },
    openAPILayerConfig () {
      WindowHelper.popup('https://apilayer.com/marketplace/keyword-api', 'APILayer API Key')
    }
  }
}

//window.EditorManager = EditorManager
export default config