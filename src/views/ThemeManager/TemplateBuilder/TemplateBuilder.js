let config = {
  data: function () {
    return {
      name: 'TemplateBuilder',
      ui: undefined,
      currentStep: 1,
      rawHTML: '',
      parsedTemplate: '',
      placeholderFound: [],
      placeholderNotFound: [],
      onCloseReload: false,
    }
  },
  mounted: function () {
    
  },
  computed: {
    validateRawHTML: function () {
      if (this.rawHTML.length < 100
              || this.rawHTML.split('<html').length === 0
              || this.rawHTML.split('</html>').length === 0) {
        return false
      }
      else {
        return true
      }
    },
    templateFoundMessage: function () {
      if (this.placeholderNotFound.length === 0) {
        return 'positive'
      }
      else {
        return 'yellow'
      }
    }
  },
  created: function () {
    $v.base = this
  },
  methods: {
    // ---------------------
    // Methods of Modal
    // ---------------------
    
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(`.${this.name}.ui.modal`)
      }
      return this.ui
    },
    open: function () {
      this.currentStep = 1
      this.rawHTML = ''
      this.parsedTemplate = ''
      this.getUI().modal('show')
    },
    close: function () {
      if (this.onCloseReload === true) {
        this.onCloseReload = false
        InitHelper.reload(() => {
          this.getUI().modal('hide')
        })
      }
      else {
        this.getUI().modal('hide')
      }
    },
    prevStep: function () {
      this.currentStep--
    },
    nextStep: function () {
      this.currentStep++
    },
    parseRawHTML: function () {
      let rawHTML = this.rawHTML.trim()
      let htmlObject = this.extractBody(rawHTML)
      htmlObject = this.detectPostTitle(htmlObject)
      htmlObject = this.detectPostLabels(htmlObject)
      htmlObject = this.detectPostDate(htmlObject)
      htmlObject = this.detectPostBody(htmlObject)
      //console.log(rawHTML)
      
      let parsedTemplate = htmlObject.html()
      
      while(parsedTemplate.indexOf('\n\n') > -1) {
        parsedTemplate = parsedTemplate.split('\n\n').join('\n')
      }
        
      this.parsedTemplate = parsedTemplate
      
      this.nextStep()
    },
    extractBody: function (rawHTML) {
      let headCode = rawHTML.slice(rawHTML.indexOf('<head'), rawHTML.indexOf('</head>') + 7).trim()
      headCode = headCode.slice(headCode.indexOf('>') + 1, headCode.lastIndexOf('</head>')).trim()
      
      if (headCode.indexOf('<!--[if IE]>') > -1) {
        let pos1 = headCode.indexOf('<!--[if IE]>')
        let pos2 = headCode.indexOf('-->', pos1) + 3
        headCode = headCode.slice(0, pos1) + headCode.slice(pos2)
      }
      
      let bodyCode = rawHTML.slice(rawHTML.indexOf('<body'), rawHTML.indexOf('</body>') + 7).trim()
      bodyCode = bodyCode.replace('<body', '<div')
      bodyCode = bodyCode.replace('</body>', '</div>')
      
      let htmlObject = $(`<div>${bodyCode}</div>`)
      htmlObject.prepend(headCode)
      
      htmlObject.children('title').remove()
      htmlObject.children('link:not([type="text/css"])').remove()
      htmlObject.children('meta').remove()
      
      //htmlObject.find('script:not([src])').remove()
      htmlObject.find('script').remove()
      
      htmlObject.find('header').remove()
      htmlObject.find('footer').remove()
      htmlObject.find('.site-footer').remove()
      htmlObject.find('aside').remove()
      htmlObject.find('#side-bar').remove()
      htmlObject.find('#comments').remove()
      htmlObject.find('#disqus_thread').remove()
      htmlObject.find('#blog-pager').remove()
      htmlObject.find('.gcse').remove()
      htmlObject.find('.post-feeds').remove()
      htmlObject.find('.entry-meta').remove()
      htmlObject.find('.hidden').remove()
      htmlObject.find('#menu-primary').remove()
      htmlObject.find('noscript').remove()
      htmlObject.find('#masthead').remove()
      htmlObject.find('.blog-admin').remove()
      htmlObject.find('.comment-count').remove()
      htmlObject.find('.firstload-background').remove()
      htmlObject.find('a[accesskey][href]').remove()
      
      
      return htmlObject
    },
    detectPostTitle: function (htmlObject) {
      let found = false
      let placeholder = '${PostTitle}'
      
      // process htmlObject
      let h1 = htmlObject.find('article > h1:first')
      if (h1.length > 0) {
        let contents = h1.contents()
        for (let i = 0; i < contents.length; i++) {
          let content = contents[i]
          if (content.nodeType === 3 
                  && content.nodeValue.trim() !== "") {
            content.nodeValue = placeholder
            found = true
            break
          }
        }
        
        if (found === false) {
          h1.prepend(placeholder)
        }
      }
      
      if (found === true) {
        this.placeholderFound.push(placeholder)
      }
      else {
        this.placeholderNotFound.push(placeholder)
      }
      return htmlObject
    },
    detectPostLabels: function (htmlObject) {
      let found = true
      let placeholder = '${PostLabels}'
      
      // process htmlObject
      let labelInfo = htmlObject.find('article .label-info:first')
      if (labelInfo.length > 0) {
        labelInfo.text(placeholder)
        found = true
      }
      
      if (found === true) {
        this.placeholderFound.push(placeholder)
      }
      else {
        this.placeholderNotFound.push(placeholder)
      }
      return htmlObject
    },
    detectPostDate: function (htmlObject) {
      let found = false
      let placeholder = '${PostDate}'
      
      // process htmlObject
      let timestamp = htmlObject.find('article .timestamp:first')
      if (timestamp.length > 0) {
        let contents = timestamp.contents()
        for (let i = 0; i < contents.length; i++) {
          let content = contents[i]
          if (content.nodeType === 3 
                  && content.nodeValue.trim() !== "") {
            content.nodeValue = placeholder
            found = true
            break
          }
        }
        
        if (found === false) {
          timestamp.prepend(placeholder)
        }
      }
      
      if (found === true) {
        this.placeholderFound.push(placeholder)
      }
      else {
        this.placeholderNotFound.push(placeholder)
      }
      return htmlObject
    },
    detectPostBody: function (htmlObject) {
      let found = false
      let placeholder = '${PostBody}'
      
      // process htmlObject
      let article = htmlObject.find('article:first')
      if (article.length > 0) {
        article.children(':not(h1:first)').remove()
        article.append(placeholder)
        found = true
      }
      
      if (found === true) {
        this.placeholderFound.push(placeholder)
      }
      else {
        this.placeholderNotFound.push(placeholder)
      }
      return htmlObject
    },
    downloadParedResult: function () {
      let dateFormat = DayjsHelper.nowFormat()
      let filename = `template-${dateFormat}.html`
      //console.log('downloadParedResult')
      FileHelper.save(this.parsedTemplate, filename)
    },
    setAsTemplate: function () {
      console.log(this.parsedTemplate)
      $v.ThemeManager.TemplateManager.setConfig(this.parsedTemplate)
      this.onCloseReload = true
    }
  }
}

export default config