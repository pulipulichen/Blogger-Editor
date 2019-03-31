var config = {
  data: function () {
    return {
      name: 'TemplateBuilder',
      ui: undefined,
    }
  },
  mounted: function () {
    
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
        this.ui = this.ui = $(`.${this.name}.ui.modal`)
      }
      return this.ui
    },
    open: function () {
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    }
  }
}

export default config