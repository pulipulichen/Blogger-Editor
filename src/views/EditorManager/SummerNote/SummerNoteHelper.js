let SummerNoteHelper = {
  buildButton: function (contents, tooltip, click, doRender) {
    let ui = $.summernote.ui
    // create button
    let button = ui.button({
      contents: contents,
      tooltip: tooltip, // `<span>${tooltip}</span>`,
      click: click
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
  }
}

export default SummerNoteHelper