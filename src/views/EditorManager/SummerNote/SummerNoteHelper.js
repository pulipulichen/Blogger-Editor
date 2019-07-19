import SummerNoteKeyMap from './SummerNoteKeyMap.js'

let SummerNoteHelper = {
  buildButton: function (name, contents, tooltip, click, doRender) {
    let ui = $.summernote.ui
    // create button
    
    if (typeof(tooltip) !== 'string') {
      tooltip = '' + tooltip
    }
    tooltip = tooltip + this.getHotkey(name)
    
    let gaClick = (event) => {
      GoogleAnalyticsHelper.send('SummerNoteHelper.clickButton', {
        'name': $(contents).text()
      })
      click(event)
    }
    
    let button = ui.button({
      contents: contents,
      tooltip: tooltip, // `<span>${tooltip}</span>`,
      click: gaClick
    });
    
    if (doRender !== false) {
      let result = button.render(); 
      return result
    }
    else {
      return button
    }
  },
  buildDropdownButtonsGroup: function (c, contents, tooltip, buttonsData) {
    let ui = $.summernote.ui
    let options = $.summernote.options
    //let buttons = new $.summernote.options.modules.buttons(c)
    //return buttons.addToolbarButtonsGroup(contents, tooltip, buttonsData)
    
    return ui.buttonGroup([
      ui.button({
        className: 'dropdown-toggle',
        //contents: contents, // TODO
        contents: ui.dropdownButtonContents(contents, options),
        tooltip: tooltip,
        data: {
          toggle: 'dropdown'
        }
      }),
      ui.dropdown(buttonsData)
    ]).render();
  },
  getHotkey: function (key) {
    let output = ''
    
    let env = 'pc'
    let keyMap = SummerNoteKeyMap[env]
    for (let shortcut in keyMap) {
      if (keyMap[shortcut] === key) {
        output = shortcut
        break
      }
    }
    
    if (output !== '') {
      output = ` (${output})`
    }
    return output
  }
}

export default SummerNoteHelper