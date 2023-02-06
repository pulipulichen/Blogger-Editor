var config = {
  data: function () {
    return {
      name: 'MarkdownImporter',
      ui: undefined,
      isLoading: false,
      //iframePromptInput: 'http://blog.pulipuli.info/'
      code: '',
      syntax: '',
      nl2br: true,
      URLpattern: new RegExp('^(https?:\\/\\/)?' + // protocol
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
              '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
              '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
              '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
    }
  },
  mounted: function () {
    // this.test20230205()
  },
  created: function () {
    $v[this.name] = this
  },
  computed: {
    enableInsert: function () {
      if (this.isLoading) {
        return 'disabled'
      }
      let code = this.code.trim()
      if (code.length > 2) {
        return 'green'
      }
      else {
        return 'disabled'
      }
    }
  },
  methods: {
    test20230205 () {
      this.code = `彩色電子紙的時代終於來臨了嗎？

----

# 電子紙

https://technews.tw/2022/10/21/sharp-e-note-and-bigme-tablet-with-e-ink-gallery-3/

現在電子墨水的技術已經逐漸從黑白進入到彩色的時代。近來元大推出的全新彩色電子墨水技術E Ink Gallery 3在亮度、解析度和反應速度都有大幅度的提升。

https://www.techbang.com/posts/103273-bigme-galy-e-ink

中國的大我Bigme推出了採用此技術的彩色電子墨水平板Galy。這是一台8吋尺寸的Android 11系統。

# 理想

對我來說，理想的電子紙平板需要具備以下的特色：
- 彩色：我會用不同顏色的註解。
- 7吋至8吋的大小：方便握持與攜帶。
- Android系統：可以用我熟悉的系統，甚至可以讓我做部份的客製化與開發。

不知道新一代的彩色電子墨水是否達到令人滿意的程度呢？就讓我們期待後續的評測影片吧。

1. 測試看看一
2. 測試看看二
3. 測試看看三

----

你有在用電子墨水的閱讀器嗎？你用的是哪一台呢？
歡迎在下面分享喔！`
    },

    // ---------------------
    // Methods of Modal
    // ---------------------
    
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
        this.ui.find('select.dropdown').dropdown()
      }
      return this.ui
    },
    open: function () {
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    },
    escapeHTML: function (unsafeText) {
      // https://stackoverflow.com/a/48054293
      let div = document.createElement('div');
      div.innerText = unsafeText;
      return div.innerHTML;
    },
    insert: async function () {
      this.isLoading = true
      let code = this.code
      
      code = await this.parseCode(code)
      // console.log(code)
      $v.EditorManager.FieldPostBody.insert(code)
      this.close()
      
      this.code = ''
      this.persist()
      this.isLoading = false
    },
    parseCode: async function (code) {
      let output = []

      let isFirstHr = true
      let isUL = false
      let isOL = false
      let olCounter = 1
      let listTemp = []

      let lines = code.trim().split('\n')
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        line = line.trim()

        if (line === '') {
          continue
        }

        if (!line.startsWith('- ') && isUL === true) {
          isUL = false
          output.push(`<ul><li>${listTemp.join('</li><li>')}</li></ul>`)
        }
        if (!line.startsWith(`${olCounter}. `) && isOL === true) {
          isOL = false
          output.push(`<ol><li>${listTemp.join('</li><li>')}</li></ol>`)
        }

        if (line === '--' || line === '----') {
          if (isFirstHr) {
            line = `<p><a name="more"></a><!--more--></p><hr />`
            isFirstHr = false
          }
          else {
            line = `<hr />`
          }
        }
        else if (line.startsWith('- ') && isUL === false) {
          isUL = true
          line = line.slice(line.indexOf('- ') + 2).trim()
          listTemp = [
            line
          ]
        }
        else if (line.startsWith('- ') && isUL === true) {
          line = line.slice(line.indexOf('- ') + 2).trim()
          listTemp.push(line)
        }
        else if (line.startsWith('1. ') && isOL === false) {
          isOL = true
          line = line.slice(line.indexOf('. ') + 2).trim()
          listTemp = [
            line
          ]
          olCounter++
        }
        else if (line.startsWith(`${olCounter}. `) && isOL === true) {
          line = line.slice(line.indexOf('. ') + 2).trim()
          listTemp.push(line)
          olCounter++
        }
        else if (this.isURL(line)) {
          let post = $v.PostManager.getPost()
          let dirPath = `/${post.id}/assets`

          let link = line
          let imgPath = await FileSystemHelper.getURLScreenshot(dirPath, link)
                // this.insertImage(imgPath)
                
          let imgNode = `<p><a href="${imgPath}" data-filename="${link}">
  <img src="${imgPath}" title="${link}" alt="${link}" data-filename="${link}" onload="BloggerImageHelper.readyToResize(this)" />
</a></p>`
          line = `<p><a href="${line}" target="_blank">${line}</a></p>`
          line = imgNode + line
          // console.log(line)
        }
        else if (line.startsWith('#')) {
          let title = line.slice(line.indexOf(' ') + 1)
          if (title.indexOf(' / ') === -1) {
            let trans = (await this.trans(title))
            if (typeof(trans) === 'string') {
              trans = trans.slice(0, 1).toUpperCase() + trans.slice(1)
            }
            title = title + ' / ' + trans
          }

          if (line.startsWith('### ')) {
            line = `<h4>${title}</h4>`
          }
          else if (line.startsWith('## ')) {
            line = `<h3>${title}</h3>`
          }
          else if (line.startsWith('# ')) {
            line = `<h2>${title}</h2>`
          }
        }
        else {
          line = `<p>${line}</p>`
        }

        output.push(line)
      }

      // let keywords = await this.getKeywords(output) 
      // output.unshift(`<p>[COVER: ${keywords.join(', ')}]</p>`)
      output.unshift(`<p>[COVER]</p>`)

      return output.join('\n')
    },
    isURL: function (str) {
      
      return !!this.URLpattern.test(str);
    },
    persist() {
      
    },
    trans (text, sourceLangage = 'zh', targetLanguage = 'en') {
      let appsScriptURL = $v.ConfigManager.apiKeysTrans

      if (appsScriptURL === '') {
        return `NoAPIKey`
      }

      return new Promise((resolve, reject) => {
        // let appURL = `https://script.google.com/macros/s/AKfycbwk-r9O03CPCwRlkUtAilv0B_Y_s2BLMDz5pq2z3QfauDtvrFr7Tu8Mv2VUOYOciQ8YpA/exec`

        let requestURL = appsScriptURL + '?text=' + encodeURIComponent(text) + '&s=' + sourceLangage + '&t=' + targetLanguage
        $.getJSON(requestURL, (json) => {
          resolve(json.output)
        })
      })
    },
    getKeywords (output) {
      let apiKey = $v.ConfigManager.apiKeysAPILayer
      if (apiKey === '') {
        return ['NoAPIKey']
      }

      let outputText = $(`<div>${output.join('\n')}</div>`).text()
      
      return new Promise(async (resolve, reject) => {
        var myHeaders = new Headers();
        myHeaders.append("ap" + "ik" + "ey", apiKey);

        var raw = outputText

        var requestOptions = {
          method: 'POST',
          redirect: 'follow',
          headers: myHeaders,
          body: raw
        };

        let res = await fetch("https://api.apilayer.com/keyword", requestOptions)
        let text = await res.text()
        let json = JSON.parse(text)
        let result = json.result

        result = result.map(({text}) => {
          return decodeURIComponent(JSON.parse('"' + text.replace(/\"/g, '\\"') + '"'))
        }).filter(t => !this.isURL(t))

        resolve(result)
      })
    }
  }
}

export default config