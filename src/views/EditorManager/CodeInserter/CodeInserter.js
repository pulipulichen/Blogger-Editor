var config = {
  data: function () {
    return {
      name: 'CodeInserter',
      ui: undefined,
      //iframePromptInput: 'http://blog.pulipuli.info/'
      code: '',
      syntax: '',
      nl2br: true
    }
  },
  mounted: function () {
    VueHelper.mountLocalStorage(this, 'syntax')
    VueHelper.mountLocalStorageBoolean(this, 'nl2br')
  },
  created: function () {
    $v[this.name] = this
  },
  computed: {
    enableInsert: function () {
      let code = this.code.trim()
      if (code.length > 2) {
        return 'green'
      }
      else {
        return 'disabled'
      }
    }
  },
  methods: {
    // ---------------------
    // Methods of Modal
    // ---------------------
    
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
        this.ui.find('select.dropdown').dropdown()
      }
      return this.ui
    },
    open: function () {
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    },
    escapeHTML: function (unsafeText) {
      // https://stackoverflow.com/a/48054293
      let div = document.createElement('div');
      div.innerText = unsafeText;
      return div.innerHTML;
    },
    insert: function () {
      let code = this.code
      code = this.escapeHTML(code)
      
      let className = this.syntax
      if (className !== '') {
        className = ` class="${className}"`
      }
      
      /*
      code = code.split('\n').map(line => {
        let output = ''
        for (let i = 0; i < line.length; i++) {
          let char = line.substr(i, 1)
          if (char === ' ') {
            output += '&nbsp;'
          }
          else {
            output += line.slice(i)
          }
        }
        return output
      }).join('\n')
      */
      //console.log(this.nl2br)
      //if (this.nl2br === true) {
      //if (true) {
        //console.log('nl2br')
        //code = code.split('\n').join('<br />\n')
      //}
      
      code = code.split(" ").join("&nbsp;")
      //console.log(code)
      code = `<pre><code${className}>${code}</code></pre>`
      //console.log(code)
      //let code = '<img src="icon.png" />'
      $v.EditorManager.FieldPostBody.insert(code)
      this.close()
      
      this.code = ''
      this.persist()
    },
    persist() {
      VueHelper.persistLocalStorage(this, 'syntax')
      VueHelper.persistLocalStorage(this, 'nl2br')
    },
    toggleNl2br: function () {
      this.nl2br = !this.nl2br
    }
  }
}

export default config