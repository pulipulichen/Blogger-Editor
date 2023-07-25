import SummerNoteCode from './../SummerNote/SummerNoteCode.js'

import TurndownService from 'turndown'
var turndownService = new TurndownService({
  headingStyle: 'atx'
})

import {gfm} from 'turndown-plugin-gfm'
import MarkdownHelper from '../../../helpers/MarkdownHelper.js'
turndownService.use(gfm)

var config = {
  data: function () {
    return {
      name: 'AbstractInserter',
      ui: undefined,
      //iframePromptInput: 'http://blog.pulipuli.info/'
      abstract: 'asas',
      contentParts: [],
      copied: [],

      contentPartsReview: [],
      copiedReview: [],

      insertLast: true
    }
  },
  mounted: function () {
    VueHelper.mountLocalStorage(this, 'abstract')
    VueHelper.mountLocalStorageBoolean(this, 'insertLast')
  },
  created: function () {
    $v[this.name] = this
  },
  computed: {
    enableInsert: function () {
      let abstract = this.abstract.trim()
      if (abstract.length > 2) {
        return 'green'
      }
      else {
        return 'disabled'
      }
    },
    promptOpen () {
      return this.$t(`接下來我要寫一篇文章的內容，以Markdown格式撰寫。` +
        `但是因為內容很長，我必須要分段貼上來。接著不論我說些什麼，都請你回答「####」，不要給我任何回應。`  + 
        `直到我只說「完成」這兩個字，之後再請你扮演書評員，把我說過的話，總結成一段200字至300字之間有邏輯的摘要，以跟讀者介紹的角度介紹這篇文章。` +
        `請用臺灣人習慣的繁體中文來撰寫。`)
    },
    promptEnd () {
      return this.$t(`完成`)
    },
    promptEndReview () {
      return this.$t(`你還有其他建議嗎？請用繁體中文回答。`)
    },
  },
  methods: {
    // ---------------------
    // Methods of Modal
    // ---------------------
    
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    },
    open: function () {
      this.initMarkdownParts()
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    },
    insert: function () {
      let abstract = this.abstract
      
      // abstract = abstract.split('\n').join('<br />\n')

      abstract = `<pre class="abstract" style="display: none;">${abstract}</pre>`
      //console.log(code)
      //let code = '<img src="icon.png" />'
      if (this.insertLast) {
        // console.log($v.EditorManager.FieldPostBody.ui)
        $v.EditorManager.FieldPostBody.getElement().children('pre.abstract').remove()
        $v.EditorManager.FieldPostBody.insertLast(abstract)
      }
      else {
        $v.EditorManager.FieldPostBody.insert(abstract)
      }
        
      this.close()
      
      this.abstract = ''
      this.persist()
    },
    persist() {
      VueHelper.persistLocalStorage(this, 'abstract')
      VueHelper.persistLocalStorage(this, 'insertLast')
    },
    popupChatGPT (e) {
      // CopyPasteHelper.copyPlainText(this.promptOpen)
      this.copy(this.promptOpen, 'opening')
      WindowHelper.forcePopup(e.target.href, e.target.target)
    },
    // initHTMLParts () {
    //   this.copied = []
    //   let html = SummerNoteCode.GetOneFileHTML(this.$t, false)
      
    //   let output = []
    //   let limit = 1500

    //   let parts = html.split('<h2')
    //   let tempPart = parts[0]

    //   for (let i = 1; i < parts.length; i++) {
    //     if (tempPart.length > limit) {
    //       output.push(tempPart)
    //       tempPart = '<h2' + parts[i]
    //     }
    //     else {
    //       tempPart = tempPart + '<h2' + parts[i]
    //     }
    //   }

    //   if (tempPart.length > 0) {
    //     output.push(tempPart)
    //   }

    //   this.HTMLParts = output
    // },
    initMarkdownParts () {
      this.copied = []
      this.contentParts = MarkdownHelper.getPostBodyMarkdownParts('mask')

      let fieldPostTitle = $v.EditorManager.FieldPostTitle
      let postTitle = fieldPostTitle.getText().trim()
      this.contentPartsReview = this.contentParts.map((promptText, i) => {
        let prompt = `這是一份標題為「${postTitle}」，編號為「text-${(i+1)}」的文本，以Markdown語法撰寫。` +
      `請檢查標題和文本內容有沒有出現錯字、邏輯不通、需要補充的問題，並且給出具體的修改建議。` +
      `請不要列出文本原本的內容。只要用列點的方式給出建議即可。` +
      `請用臺灣人習慣的用詞，以繁體中文回答。

` + '````md' + `
${promptText.trim()}
` + '````'
        return prompt
      })
    },
    copy (str, i = false) {
      if (i !== false) {
        if (this.copied.indexOf(i) === -1) {
          this.copied.push(i)
        }
      }
      CopyPasteHelper.copyPlainText(str)
    },
    copyReview (str, i = false) {
      if (i !== false) {
        if (this.copiedReview.indexOf(i) === -1) {
          this.copiedReview.push(i)
        }
      }
      CopyPasteHelper.copyPlainText(str)

      if (i === 0) {
        WindowHelper.forcePopup("https://chat.openai.com/chat", "chatgptReview")
      }
    }
  }
}

export default config