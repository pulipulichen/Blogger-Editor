export default function (app) {
  if (!app.methods) {
    app.methods = {}
  }

  app.methods.popupChatGPT  = function () {
    WindowHelper.forcePopup(this.urlChatGPTBlogger, 'chatgpt')
  }

  app.methods.copyPromptSpellCheck  = function () {

    let fieldPostTitle = $v.EditorManager.FieldPostTitle
    let postTitle = fieldPostTitle.getText().trim()
    let text = this.getPostBodyMarkdown().trim()


    let prompt = `請為下方的「##START##」跟「##END##」之間的文本有沒有錯字、或是存在邏輯不通的問題給出修改建議。請不要列出文本原本的內容。只要用列點的方式給出建議即可。請用繁體中文回答。

##START##
${postTitle}

${text}
##END##`

    CopyPasteHelper.copyPlainText(prompt)

    this.popupChatGPT()
  }

  app.methods.copyPromptSpellCheckAgain  = function () {

    let prompt = `你還有其他建議嗎？請用繁體中文回答。`

    CopyPasteHelper.copyPlainText(prompt)

    this.popupChatGPT()
  }
}