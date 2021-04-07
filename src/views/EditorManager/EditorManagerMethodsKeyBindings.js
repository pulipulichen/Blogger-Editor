import $ from 'jquery'
import hotkeys from './vendors/hotkeys/hotkeys.webpack.js'

export default function (EditorManager) {
    
  EditorManager.methods.getKeyBindsConfig = function () {
    //console.log('ok')
    return {
//      'ctrl+s': (event, handler) => {
//        event.preventDefault()
//        $v.PostManager.backupPost()
//      }
    }
  }
  
  // -------------------
  
  EditorManager.methods.hotkeyFind = function (event, find) {
    event.stopPropagation()
    event.preventDefault()

    let selection = this.$refs.CodeMirrorEditor.getSelectedText()
    if (selection === '') {
      if (this.localConfig.stringToSearch !== '') {
        find()
      }
      else {
        this.hotkeyStartSearch()
      }
    }
    else {
      this.localConfig.displayPanel = 'replace'
      
      if (this.localConfig.stringToSearch !== selection) {
        this.localConfig.stringToSearch = selection
        this.hotkeyStartSearch()
      }
      else {
        find()
      }
    }
  }
  
  EditorManager.methods.hotkeyStartSearch = function () {
    this.localConfig.displayPanel = 'replace'
    this.$refs.ReplacePanel.selectSearchInput()
  }
  
  // --------------------
  
    
  EditorManager.methods.initKeyBinds = function () {
    let config = this.getKeyBindsConfig()
    
    hotkeys(Object.keys(config).join(','), async (event, handler) => {
      let pressKey = handler.key
      
      for (let key in config) {
        if (key === pressKey) {
          await config[key](event, handler)
          return true
        }
      }
    })
  }
  
}