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
      abstract: '',
      contentParts: [],
      copied: []
    }
  },
  mounted: function () {
    VueHelper.mountLocalStorage(this, 'abstract')
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
      return this.$t(`接下來我要寫一篇文章的內容，但是因為內容很長，我要分段寫上來。接著不論我說些什麼，都請你回答「####」，不要說任何話。直到我只說「完成」這兩個字之後，再請你扮演書評員，把我說過的話，總結成一段200字至300字之間有邏輯的摘要，以跟讀者介紹的角度介紹這篇文章。用臺灣人習慣的繁體中文來撰寫。`)
    },
    promptEnd () {
      return this.$t(`完成`)
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
      $v.EditorManager.FieldPostBody.insert(abstract)
      this.close()
      
      this.abstract = ''
      this.persist()
    },
    persist() {
      VueHelper.persistLocalStorage(this, 'abstract')
    },
    popupChatGPT (e) {
      CopyPasteHelper.copyPlainText(this.promptOpen)
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
    },
    copy (str, i = false) {
      if (i !== false) {
        if (this.copied.indexOf(i) === -1) {
          this.copied.push(i)
        }
      }
      CopyPasteHelper.copyPlainText(str)
    }
  }
}

export default config