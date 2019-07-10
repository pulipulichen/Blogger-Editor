import draggable from 'vuedraggable'

let config = {
  data: function () {
    return {
      name: 'GoogleDocLinkBuilder',
      ui: undefined,
      //shareLink: '',
      shareLink: 'https://docs.google.com/presentation/d/1HYPmm0dWobeKUx1j0EEtsrEtuicFHRh4oMWvZHCafL4/edit?usp=sharing',
      links: [],
      checked: []
    }
  },
  mounted: function () {
    //VueHelper.mountLocalStorage(this, 'summerNoteConfigStyleTags')
    this.init()
  },
  components: {
    draggable,
  },
  watch: {
    /*
    getLinks: function () {
      setTimeout(() => {
        this.getUI().find('.ui.checkbox').checkbox()
      }, 0)
      return [{
          url: "https://docs.google.com/presentation/d/1HYPmm0dWobeKUx1j0EEtsrEtuicFHRh4oMWvZHCafL4/edit?usp=sharing",
          label: "Label A",
          type: "A",
          checked: true,
      },
      {
          url: "https://docs.google.com/presentation/d/1HYPmm0dWobeKUx1j0EEtsrEtuicFHRh4oMWvZHCafL4/edit?usp=sharing",
          label: "Label B",
          type: "B",
          checked: false,
      }]
    }
    */
    shareLink: function (shareLink) {
      this.buildLinks(shareLink)
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
    init: function () {
      this.buildLinks()
    },
    open: function () {
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    },
    persist() {
      //VueHelper.persistLocalStorage(this, 'summerNoteConfigStyleTags')
    },
    copyLink: function (url) {
      CopyPasteHelper.copyPlainText(url)
    },
    buildLinks: function (shareLink) {
      setTimeout(() => {
        this.getUI().find('.ui.checkbox').checkbox()
      }, 0)
      this.links = [{
          url: "https://docs.google.com/presentation/d/1HYPmm0dWobeKUx1j0EEtsrEtuicFHRh4oMWvZHCafL4/edit?usp=sharing",
          label: "Label A",
          type: "A",
          checked: true,
      },
      {
          url: "https://docs.google.com/presentation/d/1HYPmm0dWobeKUx1j0EEtsrEtuicFHRh4oMWvZHCafL4/edit?usp=sharing",
          label: "Label B",
          type: "B",
          checked: false,
      }]
    }
  }
}

export default config