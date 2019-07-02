import SummerNoteHelper from './SummerNoteHelper.js'

let SummerNoteOpen = {
  // -------------------------
  // model buttons
  // -------------------------
  
  
  IframePrompt: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="plus square outline icon"></i> Iframe`)
    let tooltip = 'Insert iframe'
    let click = () => {
      $v.IframePrompt.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  FileUploader: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="upload icon"></i> Upload File`)
    let tooltip = 'Upload file and insert links'
    let click = () => {
      $v.FileUploader.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  CodeInserter: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="code icon"></i> Code`)
    let tooltip = 'Insert code'
    let click = () => {
      $v.CodeInserter.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  OutlineNavigator: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="sitemap icon"></i> Outline`)
    let tooltip = 'Outline Navigation'
    let click = () => {
      $v.OutlineNavigator.toggle()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  SnippetInserter: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="quote left icon"></i> Snippet`)
    let tooltip = 'Insert snippet'
    let click = () => {
      $v.SnippetInserter.open()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  
  // -----------------------------
  // Others
  // -----------------------------
  
  
  transSelected: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="language icon"></i> Trans`)
    let tooltip = 'Translate Selected'
    let click = () => {
      let text = $v.EditorManager.FieldPostBody.getSelectText()
      text = encodeURI(text)
      let url = `https://translate.google.com/#view=home&op=translate&sl=auto&tl=auto&text=${text}`
      WindowHelper.popup(url)
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  
  toggleMenu: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="bars icon"></i>`)
    let tooltip = 'Toggle Menu'
    let click = () => {
      $v.NavBar.toggle()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
}

export default SummerNoteOpen