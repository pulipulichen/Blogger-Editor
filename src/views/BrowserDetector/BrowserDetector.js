const { detect } = require('detect-browser');
//import detectBrowser from 'detect-browser'
//const browser = detectBrowser.detect();
const browser = detect();

var config = {
  //name: "main-content",
  data: function () {
    return {
      ui: undefined,
      //defaultTheme: 'simple'
      defaultTheme: 'default'
    }
  },
  created: function () {
    $v.BrowserDetector = this
  },
  methods: {
    // ---------------------
    // Methods of Modal
    // ---------------------
    
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = this.ui = $('.BrowserDetector.ui.modal')
      }
      return this.ui
    },
    open: function () {
      //console.log(this.data)
      this.getUI().modal('show')
    },
    init: function (callback) {
      if (browser.name !== 'chrome') {
        this.open()
      }
      else {
        FunctionHelper.triggerCallback(callback)
      }
      //FunctionHelper.triggerCallback(callback)
    }
  }
}

export default config