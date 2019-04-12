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
      if (rawHTML.startsWith('<!DOCTYPE ')) {
        rawHTML = rawHTML.slice(rawHTML.indexOf('\n') + 1)
      }
      
      rawHTML = `<div>${rawHTML}</div>`
      
      let htmlObject = $(rawHTML)
      htmlObject = this.extractBody(htmlObject)
      htmlObject = this.detectPostTitle(htmlObject)
      htmlObject = this.detectPostLabels(htmlObject)
      htmlObject = this.detectPostDate(htmlObject)
      htmlObject = this.detectPostBody(htmlObject)
      //console.log(rawHTML)
      
      this.parsedTemplate = htmlObject.html()
      this.nextStep()
    },
    extractBody: function (htmlObject) {
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
      let found = false
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