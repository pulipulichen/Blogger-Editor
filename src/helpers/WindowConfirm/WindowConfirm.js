var config = {
  data: function () {
    return {
      name: 'WindowConfirm',
      ui: undefined,
      onYes: null,
      onNo: null,
      message: ''
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
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    },
    open: function (message, onYes, onNo) {
      if (message === undefined) {
        return
      }
      
      if (typeof(message) === 'function') {
        onYes = message
        message = ''
      }
      
      if (typeof(onYes) === 'function') {
        this.onYes = onYes
      }
      if (typeof(onNo) === 'function') {
        this.onNo = onNo
      }
      this.message = message
      
      this.getUI().modal({
        closable: false
      }).modal('show')
      this.getUI().find('.yes.button').focus()
    },
    yes: function () {
      FunctionHelper.triggerCallback(this.onYes)
      this.close()
    },
    no: function () {
      FunctionHelper.triggerCallback(this.onNo)
      this.close()
    },
    close: function () {
      this.onYes = null
      this.onNo = null
      this.getUI().modal('hide')
    }
  }
}

export default config