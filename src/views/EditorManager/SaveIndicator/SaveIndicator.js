let config = {
  data: function () {
    return {
      name: 'SaveIndicator',
      ui: undefined,
      locked: false
    }
  },
  /*
  mounted: function () {
    //VueHelper.mountLocalStorage(this, 'summerNoteConfigStyleTags')
  },
  computed: {
    
  },
  */
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
      this.getUI().addClass('show')
    },
    close: function () {
      this.getUI().removeClass('show')
    },
    save: function () {
      DelayExecHelper.forceExec()
      this.close()
    },
    persist() {
      //VueHelper.persistLocalStorage(this, 'summerNoteConfigStyleTags')
    },
    lock: function () {
      this.locked = true
    },
    unlock: function () {
      this.locked = false
    }
  }
}

export default config