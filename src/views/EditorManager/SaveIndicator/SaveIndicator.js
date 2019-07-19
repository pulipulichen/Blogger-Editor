let config = {
  data: function () {
    return {
      name: 'SaveIndicator',
      ui: undefined,
      locked: false,
      opened: false
    }
  },
  /*
  mounted: function () {
    //VueHelper.mountLocalStorage(this, 'summerNoteConfigStyleTags')
  },
  */
  computed: {
    getClassname: function () {
      let classname = this.name
      if (this.locked === true) {
        classname = classname + ' locked'
      }
      if (this.opened === true) {
        classname = classname + ' show'
      }
      return classname
    },
    getTitle: function () {
      if (this.locked === false) {
        return this.$t('Saving... (Click to Save)')
      }
      else {
        return this.$t('Please wait for saving.')
      }
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
      //console.log('open')
      //this.getUI().addClass('show')
      this.opened = true
    },
    close: function () {
      //this.getUI().removeClass('show')
      this.opened = false
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