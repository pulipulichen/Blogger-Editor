/**
 * @deprecated 20190330
 */
SummerNoteHelper = {
  getPostSummerNoteToolbarConfig: function () {
    let toolbar = [
        ['view', ['codeview']],
        ['style', ['style']],
        ['font', ['undo', 'bold', 'underline', 'clear']],
        //['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['hr', 'link', 'picture', 'video']],
        ['mybutton', ['copyHTML', 'imageReplacer']],
        ['help', [/*'fullscreen',*/ 'help']]
      ]

    return toolbar
  },
  getPostSummerNoteStyleTagsConfig: function () {
      let styleTags = ['p', 'code', 'h4', 'h5', 'h6']
      return styleTags
    },
  buildButton: function (contents, tooltip, click) {
    let ui = $.summernote.ui;

    // create button
    let button = ui.button({
      contents: contents,
      tooltip: tooltip,
      click: click
    });

    return button.render(); 
  },
}