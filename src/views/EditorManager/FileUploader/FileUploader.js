import draggable from 'vuedraggable'

let config = {
  data: function () {
    return {
      name: 'FileUploader',
      ui: undefined,
      delimiter: ', ',
      links: [
        {
          name: 'GitHub',
          uploadURL: 'http://upload.blog.pulipuli.info',
          downloadURL: 'http://download.blog.pulipuli.info'
        },
        {
          name: 'GitHub 2',
          uploadURL: 'http://upload.blog2.pulipuli.info',
          downloadURL: 'http://download.blog2.pulipuli.info'
        }
      ]
    }
  },
  mounted: function () {
    VueHelper.mountLocalStorage(this, 'links')
  },
  computed: {
    enableInsert: function () {
      return 'green'
    }
  },
  created: function () {
    $v[this.name] = this
  },
  components: {
    draggable,
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
    },
    openTab: function (e) {
      SemanticUIHelper.openTab(e)
    },
    openUploadURL: function (url, name) {
      WindowHelper.popup(url, name)
    },
    onSettingChange: function () {
      VueHelper.persistLocalStorage(this, 'links')
    }
  }
}

export default config