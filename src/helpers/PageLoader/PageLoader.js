var config = {
  data: function () {
    return {
      name: 'PageLoader',
      ui: undefined,
      onShow: null,
      onHide: null
    }
  },
  mounted: function () {
    
  },
  created: function () {
    $v[this.name] = this
  },
  methods: {
    // ---------------------
    // Methods of Modal
    // ---------------------
    
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        //this.ui = $(this.$refs.modal)
        this.ui = $('.page-loader.modal').modal({
          closable: false,
          onShow: () => {
            FunctionHelper.triggerCallback(this.onShow)
            this.onShow = null
          },
          onHide: () => {
            FunctionHelper.triggerCallback(this.onHide)
            this.onHide = null
          }
        })
        
      }
      return this.ui
    },
    open: function (callback) {
      if (typeof(callback) === 'function') {
        this.onShow = callback
      }
      this.getUI().modal('show')
    },
    close: function (callback) {
      if (typeof(callback) === 'function') {
        this.onHide = callback
      }
      this.getUI().modal('hide')
    }
  }
}

export default config