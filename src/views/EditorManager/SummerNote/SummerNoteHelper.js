let SummerNoteHelper = {
  buildButton: function (contents, tooltip, click, doRender) {
    let ui = $.summernote.ui;

    // create button
    let button = ui.button({
      contents: contents,
      tooltip: tooltip,
      click: click
    });

    if (doRender !== false) {
      return button.render(); 
    }
    else {
      return button
    }
  },
  buildDropdownButtonsGroup: function (c, contents, tooltip, buttonsData) {
    //let ui = $.summernote.ui
    let buttons = new $.summernote.options.modules.buttons(c)
    return buttons.addToolbarButtonsGroup(contents, tooltip, buttonsData)
  }
}

export default SummerNoteHelper