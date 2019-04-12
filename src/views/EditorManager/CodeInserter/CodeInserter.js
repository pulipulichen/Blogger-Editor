var config = {
  data: function () {
    return {
      name: 'CodeInserter',
      ui: undefined,
      //iframePromptInput: 'http://blog.pulipuli.info/'
      iframePromptInput: ''
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
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    },
    open: function () {
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    },
    insert: function () {
      //console.log(this.iframePromptInput)
      let url = this.iframePromptInput
      let code = `<div><iframe src="${url}" width="100%" style="height: 90vh" frameborder="0" class="post-iframe"></iframe></div>`
      //let code = '<img src="icon.png" />'
      $v.EditorManager.FieldPostBody.insert(code)
      this.iframePromptInput = ''
      this.close()
    }
  }
}

export default config