export default function (app) {
  if (!app.methods) {
    app.methods = {}
  }

  app.methods.popupChatGPT  = function () {
    WindowHelper.forcePopup(this.urlChatGPTBlogger, 'chatgpt')
  }

  app.methods.buildPrompts = function () {
    this.copied = []
    let markdownParts = MarkdownHelper.getPostBodyMarkdownParts('mask')

    if (markdownParts[0]) {
      let fieldPostTitle = $v.EditorManager.FieldPostTitle
      let postTitle = fieldPostTitle.getText().trim()
      let text = markdownParts[0]

      markdownParts[0] = `TITLE: ${postTitle}

CONTENT:
${text}`
    }

    this.prompts = markdownParts
  }

  app.methods.copyPromptSpellCheck  = function (promptText, i) {

    if (!promptText) {
      let fieldPostTitle = $v.EditorManager.FieldPostTitle
      let postTitle = fieldPostTitle.getText().trim()
      let text = this.getPostBodyMarkdown('mask')

      promptText = `TITLE: ${postTitle}

CONTENT:
${text}`
    }
    let prompt = `這是一份編號為「text-${(i+1)}」的文本，以Markdown語法撰寫。請為下方的「##START##」跟「##END##」之間的文本有沒有錯字、或是存在邏輯不通的問題給出修改建議。請不要列出文本原本的內容。只要用列點的方式給出建議即可。請用臺灣人習慣的用詞，以繁體中文回答。

##START##
${promptText}
##END##`

    CopyPasteHelper.copyPlainText(prompt)
    if (i === 0) {
      this.popupChatGPT()
    }

    if (this.copied.indexOf(i) === -1) {
      this.copied.push(i)
    }
  }

  app.methods.copyPromptSpellCheckAgain  = function () {

    let prompt = `你還有其他建議嗎？請用繁體中文回答。`

    CopyPasteHelper.copyPlainText(prompt)

    this.popupChatGPT()
  }
}