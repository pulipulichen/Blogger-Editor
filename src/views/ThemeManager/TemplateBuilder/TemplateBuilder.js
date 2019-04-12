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
      
      while(parsedTemplate.index('\n\n') > -1) {
        parsedTemplate = parsedTemplate.split('\n\n').join('\n')
      }
        
      this.parsedTemplate = parsedTemplate
      
      this.nextStep()
    },
    extractBody: function (rawHTML) {
      let headCode = rawHTML.slice(rawHTML.indexOf('<head'), rawHTML.indexOf('</head>') + 7).trim()
      headCode = headCode.slice(headCode.indexOf('>') + 1, headCode.lastIndexOf('</head>')).trim()
      
      let bodyCode = rawHTML.slice(rawHTML.indexOf('<body'), rawHTML.indexOf('</body>') + 7).trim()
      bodyCode = bodyCode.replace('<body', '<div')
      bodyCode = bodyCode.replace('</body>', '</div>')
      
      let htmlObject = $(`<div>${bodyCode}</div>`)
      htmlObject.prepend(headCode)
      
      htmlObject.children('title').remove()
      htmlObject.children('link:not([type="text/css"])').remove()
      htmlObject.children('meta').remove()
      htmlObject.find('script:not([src])').remove()
      
      return htmlObject
    },
    detectPostTitle: function (htmlObject) {
      let found = false
      let placeholder = '${PostTitle}'
      
      // process htmlObject
      
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
      $v.ThemeManager.TemplateManager.set(this.parsedTemplate)
      this.onCloseReload = true
    }
  }
}

export default config