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
    close: function () {
      this.getUI().modal('hide')
    },
    init: function (callback) {
      this.open()
      //FunctionHelper.triggerCallback(callback)
    }
  }
}

export default config