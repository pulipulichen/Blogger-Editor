var config = {
  data: function () {
    return {
      name: 'PageLoader',
      ui: undefined,
      onShow: null,
      onHide: null,
      isOpening: false,
      isClosing: false,
      $body: null
    }
  },
  mounted: function () {
    
  },
  created: function () {
    $v[this.name] = this
    this.$body = $('body')
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
          onVisible: () => {
            this.isOpening = false
            FunctionHelper.triggerCallback(this.onShow)
            this.onShow = null
          },
          onHide: () => {
            this.isClosing = false
            FunctionHelper.triggerCallback(this.onHide)
            this.onHide = null
          }
        })
        
      }
      return this.ui
    },
    open: function (callback) {
      if (this.isClosing === true) {
        setTimeout(() => {
          this.open(callback)
        }, 1000)
        return
      }
      if (this.isOpening === true) {
        return
      }
      
      this.isOpening = true
      if (typeof(callback) === 'function') {
        this.onShow = callback
      }
      this.getUI().modal('show')
      this.$body.addClass('page-loader')
    },
    close: function (callback) {
      if (this.isOpening === true) {
        setTimeout(() => {
          this.close(callback)
        }, 1000)
        return
      }
      
      if (this.isClosing === true) {
        return
      }
      
      this.isClosing = true
      if (typeof(callback) === 'function') {
        this.onHide = callback
      }
      this.getUI().modal('hide')
      this.$body.removeClass('page-loader')
    }
  }
}

export default config