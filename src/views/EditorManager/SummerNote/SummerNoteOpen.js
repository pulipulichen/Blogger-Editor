import SummerNoteHelper from './SummerNoteHelper.js'
import SummerNoteCode from './SummerNoteCode.js'
import SummerNoteImage from './SummerNoteImage.js'

let SummerNoteOpen = {
  // -------------------------
  // model buttons
  // -------------------------
  
  
  IframePrompt: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="plus square outline icon"></i> Iframe`)
    let tooltip = 'Insert iframe'
    let click = () => {
      $v.IframePrompt.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  FileUploader: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="upload icon"></i> Upload File`)
    let tooltip = 'Upload file and insert links'
    let click = () => {
      $v.FileUploader.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  CodeInserter: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="code icon"></i>  Code`)
    let tooltip = 'Insert code'
    let click = () => {
      $v.CodeInserter.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  OutlineNavigator: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="sitemap icon"></i> Outline`)
    let tooltip = 'Outline Navigation'
    let click = () => {
      $v.OutlineNavigator.toggle()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  SnippetInserter: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="quote left icon"></i> Snippet`)
    let tooltip = 'Insert snippet'
    let click = () => {
      $v.SnippetInserter.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  GoogleDocsLinkBuilder: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="google icon"></i> Google Docs Links`)
    let tooltip = 'Open Google Docs Links Builder'
    let click = () => {
      $v.GoogleDocLinkBuilder.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  OneDriveLinkBuilder: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="linkify icon"></i> OneDrive Links`)
    let tooltip = 'Open OneDrive Link Builder'
    let click = () => {
      WindowHelper.forcePopup('https://blog.pulipuli.info/2019/02/onedrive-onedrive-file-download-link.html#postcataonedrive-onedrive-file-download-link.html0_anchor3', 'OneDriveDownload')
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  GooglePhoto: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="image icon"></i> Google Photo`)
    let tooltip = 'Open Google Photo'
    let click = () => {
      WindowHelper.forcePopup('https://photos.google.com/?hl=zh-TW', 'googlePhoto')
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  
  insertHR: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="note-icon-minus icon"></i> Horizontal Rule`)
    let tooltip = '水平線 (CTRL+ENTER)'
    let click = () => {
      //$v.EditorManager.FieldPostBody.summernote('iframeDialog.show')
      $v.EditorManager.FieldPostBody.get().summernote('insertHorizontalRule')
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  
  insertVideo: function ($t, context, doRender) {
    //let contents = '<div><i class="note-icon-video"></i> 影片</div>'
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="note-icon-video icon"></i> Video`)
    let tooltip = '影片'
    let click = () => {
      //$v.EditorManager.FieldPostBody.summernote('iframeDialog.show')
      $v.EditorManager.FieldPostBody.get().summernote('video')
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  insertIframe: function ($t, context, doRender) {
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
  
  
  transSelected: function ($t, context, doRender) {
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
  
  toggleMenu: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="bars icon"></i>`)
    let tooltip = 'Toggle Menu'
    let click = () => {
      $v.NavBar.toggle()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  
  downloadImageTemplate: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="image icon"></i> Image Template`)
    let tooltip = 'Download Image Template'
    let click = () => {
      SummerNoteImage.downloadImageTamplateClick()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  
  // ------------------------------------
  insertGroup: function ($t, c) {
    return SummerNoteHelper.buildDropdownButtonsGroup(c, 'Insert', 'Insert Tools', [
      this.transSelected($t, c, false),
      this.insertHR($t, c, false),
      this.insertVideo($t, c, false),
      SummerNoteCode.insertMore($t, c, false),
      this.SnippetInserter($t, c, false),
      this.insertIframe($t, c, false),
      //this.CodeInserter(c, false),
      this.FileUploader($t, c, false),
      this.GoogleDocsLinkBuilder($t, c, false),
      this.OneDriveLinkBuilder($t, c, false),
    ])
  },
  
  formatGroup: function ($t, c) {
    return SummerNoteHelper.buildDropdownButtonsGroup(c, 'Format', 'Format Tools', [
      SummerNoteImage.downloadImageTamplate($t, c, false),
      SummerNoteImage.ImageReplacer($t, c, false),
      this.GooglePhoto($t, c, false),
      SummerNoteCode.CopyCode($t, c, false),
      SummerNoteCode.CleanCode($t, c, false),
      SummerNoteImage.imageSizeOriginal($t, c, false),
      SummerNoteImage.imageSizeDefault($t, c, false),
    ])
  }
}

export default SummerNoteOpen