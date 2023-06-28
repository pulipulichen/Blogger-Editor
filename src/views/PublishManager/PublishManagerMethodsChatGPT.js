export default function (app) {
  if (!app.methods) {
    app.methods = {}
  }

  app.methods.popupChatGPT  = function () {
    WindowHelper.forcePopup(this.urlChatGPTBlogger, 'chatgpt')
  }

  app.methods.copyPromptSpellCheck  = function () {

    let fieldPostTitle = $v.EditorManager.FieldPostTitle
    let postTitle = fieldPostTitle.getText()
    let text = this.getPostBodyText()


    let prompt = `請問以下文字有沒有錯字：

${postTitle}

${text}`

    CopyPasteHelper.copyPlainText(prompt)

    this.popupChatGPT()
  }
}