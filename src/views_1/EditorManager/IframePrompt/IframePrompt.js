var config = {
  data: function () {
    return {
      name: 'IframePrompt',
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
      
      // 加入讀取剪貼簿的功能
      navigator.clipboard.readText()
        .then(text => {
          text = text.trim()
          //console.log(text)
          //console.log('Pasted content: ', text);
          if (this.isURL(text)) {
            this.iframePromptInput = this.stripHTTPHeader(text)
          }
        })
        .catch(err => {
          //console.error('Failed to read clipboard contents: ', err);
        });
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
    },
    isURL: function (url) {
      return ((url.startsWith("http://") && url.length > 15)
              || (url.startsWith("https://") && url.length > 15)
              || (url.startsWith("//") && url.length > 10)
              || (url.startsWith("#") && url.length > 2))
    },
    stripHTTPHeader: function (url) {
      if (this.isURL(url)) {
        if (url.indexOf('//') > 0) {
          url = url.slice(url.indexOf('//'))
        }
      }
      return url
    }
  }
}

export default config