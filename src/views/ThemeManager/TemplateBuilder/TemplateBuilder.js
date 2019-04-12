let config = {
  data: function () {
    return {
      name: 'TemplateBuilder',
      ui: undefined,
      currentStep: 1,
      rawHTML: '',
      parsedTemplate: ''
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
        this.ui = $(`.${this.name}.ui.modal`)
      }
      return this.ui
    },
    open: function () {
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    },
    prev: function () {
      this.currentStep--
    },
    next: function () {
      this.currentStep++
    },
    parseRawHTML: function () {
      
    }
  }
}

export default config