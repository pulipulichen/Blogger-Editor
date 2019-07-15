import SummerNoteHelper from './SummerNoteHelper.js'
import SummerNoteCode from './SummerNoteCode.js'

let SummerNoteOpen = {
  // -------------------------
  // model buttons
  // -------------------------
  
  
  IframePrompt: function (context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="plus square outline icon"></i> Iframe`)
    let tooltip = 'Insert iframe'
    let click = () => {
      $v.IframePrompt.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  FileUploader: function (context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="upload icon"></i> Upload File`)
    let tooltip = 'Upload file and insert links'
    let click = () => {
      $v.FileUploader.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  CodeInserter: function (context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="code icon"></i>  Code`)
    let tooltip = 'Insert code'
    let click = () => {
      $v.CodeInserter.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  OutlineNavigator: function (context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="sitemap icon"></i> Outline`)
    let tooltip = 'Outline Navigation'
    let click = () => {
      $v.OutlineNavigator.toggle()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  SnippetInserter: function (context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="quote left icon"></i> Snippet`)
    let tooltip = 'Insert snippet'
    let click = () => {
      $v.SnippetInserter.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  GoogleDocsLinkBuilder: function (context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="google icon"></i> Google Docs Links`)
    let tooltip = 'Open Google Docs Links Builder'
    let click = () => {
      $v.GoogleDocLinkBuilder.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  OneDriveLinkBuilder: function (context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="linkify icon"></i> OneDrive Links`)
    let tooltip = 'Open OneDrive Link Builder'
    let click = () => {
      WindowHelper.forcePopup('https://blog.pulipuli.info/2019/02/onedrive-onedrive-file-download-link.html#postcataonedrive-onedrive-file-download-link.html0_anchor3', 'OneDriveDownload')
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  
  insertHR: function (context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="note-icon-minus icon"></i> Horizontal Rule`)
    let tooltip = '水平線 (CTRL+ENTER)'
    let click = () => {
      //$v.EditorManager.FieldPostBody.summernote('iframeDialog.show')
      $v.EditorManager.FieldPostBody.get().summernote('insertHorizontalRule')
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  
  insertVideo: function (context, doRender) {
    //let contents = '<div><i class="note-icon-video"></i> 影片</div>'
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="note-icon-video icon"></i> Video`)
    let tooltip = '影片'
    let click = () => {
      //$v.EditorManager.FieldPostBody.summernote('iframeDialog.show')
      $v.EditorManager.FieldPostBody.get().summernote('video')
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  insertIframe: function (context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="linkify icon"></i> Iframe`)
    let tooltip = 'Insert iframe'
    let click = () => {
      //$v.EditorManager.FieldPostBody.summernote('iframeDialog.show')
      $v.EditorManager.FieldPostBody.get().summernote('iframeDialog.show')
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  
  // -----------------------------
  // Others
  // -----------------------------
  
  
  transSelected: function (context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="language icon"></i> Trans`)
    let tooltip = 'Translate Selected'
    let click = () => {
      let text = $v.EditorManager.FieldPostBody.getSelectText()
      text = encodeURI(text)
      let url = `https://translate.google.com/#view=home&op=translate&sl=auto&tl=auto&text=${text}`
      WindowHelper.popup(url)
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  
  toggleMenu: function (context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="bars icon"></i>`)
    let tooltip = 'Toggle Menu'
    let click = () => {
      $v.NavBar.toggle()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  
  // ------------------------------------
  insertGroup: function (c) {
    return SummerNoteHelper.buildDropdownButtonsGroup(c, 'Insert', 'Insert Tools', [
      this.insertHR(c, false),
      this.insertVideo(c, false),
      SummerNoteCode.insertMore(c, false),
      this.SnippetInserter(c, false),
      this.insertIframe(c, false),
      //this.CodeInserter(c, false),
      this.FileUploader(c, false),
      this.GoogleDocsLinkBuilder(c, false),
      this.OneDriveLinkBuilder(c, false),
    ])
  },
  /*
  formatGroup: function (c) {
    return SummerNoteHelper.buildDropdownButtonsGroup(c, 'Format', 'Format Tools', [
      this.insertHR(c, false),
      this.insertVideo(c, false),
      SummerNoteCode.insertMore(c, false),
      this.SnippetInserter(c, false),
      //this.CodeInserter(c, false),
      this.FileUploader(c, false),
      this.GoogleDocsLinkBuilder(c, false),
      this.OneDriveLinkBuilder(c, false),
    ])
  }
  */
}

export default SummerNoteOpen