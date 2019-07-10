import draggable from 'vuedraggable'

let config = {
  data: function () {
    return {
      name: 'GoogleDocLinkBuilder',
      ui: undefined,
      //shareLink: '',
      shareLink: 'https://docs.google.com/presentation/d/1HYPmm0dWobeKUx1j0EEtsrEtuicFHRh4oMWvZHCafL4/edit?usp=sharing',
      links: [],
      checked: [],
      delimiter: ', ',
    }
  },
  mounted: function () {
    VueHelper.mountLocalStorage(this, 'delimiter', ', ')
    this.init()
  },
  components: {
    draggable,
  },
  watch: {
    shareLink: function (shareLink) {
      this.buildLinks(shareLink)
    }
  },
  created: function () {
    $v[this.name] = this
  },
  computed: {
    isReadyInsert: function () {
      for (let i = 0; i < this.links.length; i++) {
        if (this.links[i].checked === true) {
          return true
        }
      }
      return false
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
      }
      return this.ui
    },
    init: function () {
      this.buildLinks(this.shareLink)
    },
    open: function () {
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    },
    insert: function () {
      let output = []
      this.links.forEach(link => {
        if (link.checked === false) {
          return
        }
        output.push(`<a href="${link.url}" target="_blank">${link.label}</a>`)
      })
      
      if (output.length > 0) {
        output = '<p>' + output.join(this.delimiter) + '</p>'
        $v.EditorManager.FieldPostBody.insert(output)
      }
      
      this.close()
    },
    persist() {
      VueHelper.persistLocalStorage(this, 'delimiter')
    },
    copyLink: function (url) {
      CopyPasteHelper.copyPlainText(url)
    },
    buildLinks: function (shareLink) {
      if (typeof(shareLink) !== 'string') {
        return
      }
      
      setTimeout(() => {
        this.getUI().find('.ui.checkbox').checkbox()
      }, 0)
      
      let startPos = shareLink.indexOf('/d/')
      if (startPos > 0) {
        // Google Drive 模式
        let id = this.getGoogleDocId(shareLink)
        let type = this.getGoogleDocType(shareLink)
        // ---------------------
        this.links = this.buildGoogleDocLinks(type, id)
        // ---------------------
      }
      
      /*
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
      */
    },
    getGoogleDocId: function (shareLink) {
      let startPos = shareLink.indexOf('/d/')
      if (startPos > 0) {
        // Google Drive 模式
        startPos = startPos + 3
        let endPos = shareLink.indexOf('/', startPos)
        let id = shareLink.slice(startPos, endPos)
        return id
      }
    },
    getGoogleDocType: function (_link) {
      var _type = "file";
      if (_link.startsWith("https://docs.google.com/document/d/") === true) {
          _type = "document";
      } else if (_link.startsWith("https://docs.google.com/spreadsheets/d/") === true) {
          _type = "spreadsheets";
      } else if (_link.startsWith("https://docs.google.com/presentation/d/") === true) {
          _type = "presentation";
      }
      return _type
    },
    buildGoogleDocLink: function (url, type, icon) {
      return {
          url: url,
          label: this.$t('type.' + type),
          type: type,
          icon: icon,
          checked: false,
      }
    },
    buildGoogleDocLinks: function (type, id) {
      let links = []
      let linkPrefix
      switch (type) {
        case "document":
          linkPrefix = "https://docs.google.com/document/d/"

          links.push(this.buildGoogleDocLink(linkPrefix + id + '/edit?usp=sharing', type + '.share', "linkify"))

          links.push(this.buildGoogleDocLink(linkPrefix + id + '/preview', type + '.preview', "play circle"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/copy', type + '.copy', "copy"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=pdf', type + '.pdf', "file pdf outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=doc', type + '.doc', "file word outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=odt', type + '.odt', "file alternate"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=rtf', type + '.rtf', "file alternate"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=txt', type + '.txt', "file alternate outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=html', type + '.html', "html5"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=epub', type + '.epub', "book"))
          break;
        case "spreadsheets":
          linkPrefix = "https://docs.google.com/spreadsheets/d/"

          links.push(this.buildGoogleDocLink(linkPrefix + id + '/edit?usp=sharing', type + '.share', "linkify"))

          links.push(this.buildGoogleDocLink(linkPrefix + id + '/preview', type + '.preview'))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/copy', type + '.copy', "copy"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=pdf', type + '.pdf', "file pdf outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=xlsx', type + '.xlsx', "file excel outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=ods', type + '.ods', "file alternate"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=csv', type + '.csv', "file alternate outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=tsv', type + '.tsc', "file alternate outline"))
          break;
        case "presentation":
          linkPrefix = "https://docs.google.com/spreadsheets/d/"

          links.push(this.buildGoogleDocLink(linkPrefix + id + '/edit?usp=sharing', type + '.share', "linkify"))

          links.push(this.buildGoogleDocLink(linkPrefix + id + '/preview', type + '.preview', "play circle"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/present', type + '.present', "play circle"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/copy', type + '.copy', "copy"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=pdf', type + '.pdf', "file pdf outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=pptx', type + '.pptx', "file powerpoint outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=odp', type + '.odp', "file alternate"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=txt', type + '.txt', "file alternate outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=jpeg', type + '.jpeg', "file image outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=png', type + '.png', "file image outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=svg', type + '.svg', "file image outline"))
          break;
        default:
          // https://drive.google.com/open?id=0B3_qgRmbvvZ1MTc4M0NRZ25CSFRPQ3NMS1RXdk1PSG52VXVr
          links.push(this.buildGoogleDocLink('https://drive.google.com/open?id=' + id, type + '.share', "linkify"))

          links.push(this.buildGoogleDocLink("https://drive.google.com/uc?export=download&id=" + id, type + '.download', "file alternate outline"))
      }
      return links
    }
    
  },
  
}

export default config