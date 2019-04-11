var config = {
  data: function () {
    return {
      name: 'FileUploader',
      ui: undefined,
      delimiter: ', ',
      links: [
        {
          name: 'GitHub',
          uploadURL: 'http://blog.pulipuli.info',
          downloadURL: 'http://blog.pulipuli.info'
        },
        {
          name: 'GitHub 2',
          uploadURL: 'http://blog.pulipuli.info',
          downloadURL: 'http://blog.pulipuli.info'
        }
      ]
    }
  },
  mounted: function () {
    
  },
  computed: {
    enableInsert: function () {
      return 'green'
    }
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
      $v.EditorManager.FieldPostBody.insert('OK')
      this.close()
    }
  }
}

export default config