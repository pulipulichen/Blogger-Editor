let SummerNoteHelper = {
  buildButton: function (contents, tooltip, click) {
    let ui = $.summernote.ui;

    // create button
    let button = ui.button({
      contents: contents,
      tooltip: tooltip,
      click: click
    });

    return button.render(); 
  }
}

export default SummerNoteHelper