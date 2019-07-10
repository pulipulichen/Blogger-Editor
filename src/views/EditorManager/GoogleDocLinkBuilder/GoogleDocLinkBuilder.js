import draggable from 'vuedraggable'

let config = {
  data: function () {
    return {
      name: 'GoogleDocLinkBuilder',
      ui: undefined,
      //shareLink: '',
      shareLink: 'https://docs.google.com/presentation/d/1HYPmm0dWobeKUx1j0EEtsrEtuicFHRh4oMWvZHCafL4/edit?usp=sharing',
      links: [],
      checked: {},
      labels: {},
      order: {},
      delimiter: ', ',
      currentType: null,
    }
  },
  mounted: function () {
    VueHelper.mountLocalStorage(this, 'delimiter', ', ')
    VueHelper.mountLocalStorageJSON(this, 'checked', {})
    VueHelper.mountLocalStorageJSON(this, 'order', {})
    VueHelper.mountLocalStorageJSON(this, 'labels', {})
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
        let label = link.label.trim()
        if (label === '') {
          label = this.$t('type.' + link.type)
        }
        output.push(`<a href="${link.url}" target="_blank">${label}</a>`)
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
    onLabelChange: function (type, label) {
      if (typeof(this.labels) !== 'obecjt') {
        this.labels = {}
      }
      label = label.trim()
      if (label !== '') {
        this.labels[type] = label
      }
      else {
        delete this.labels[type]
      }

      VueHelper.persistLocalStorage(this, 'labels')
    },
    onOrderChange: function () {
      if (this.currentType !== null) {
        let orderList = []
        this.links.forEach(link => {
          orderList.push(link.type)
        })
        if (typeof(this.order) !== 'obecjt') {
          this.order = {}
        }
        this.order[this.currentType] = orderList
        
        VueHelper.persistLocalStorage(this, 'order')
      }
    },
    onCheckboxChange: function () {
      if (this.currentType !== null) {
        let checkedList = []
        this.links.forEach(link => {
          if (link.checked === true) {
            checkedList.push(link.type)
          }
        })
        if (typeof(this.checked) !== 'obecjt') {
          this.checked = {}
        }
        this.checked[this.currentType] = checkedList
        
        VueHelper.persistLocalStorage(this, 'checked')
      }
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
        this.currentType = type
        // ---------------------
        let linksMap = this.buildGoogleDocLinks(type, id)
        this.links = this.sortLinks(linksMap)
        // ---------------------
      }
      else {
        this.currentType = null
        this.links = []
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
      let checked = false
      if (typeof(this.checked) === 'object' 
              && Array.isArray(this.checked[this.currentType])
              && this.checked[this.currentType].indexOf(type) > -1) {
        checked = true
      }
      
      let label = this.$t('type.' + type)
      if (typeof(this.labels) === 'object' 
              && typeof(this.labels[type]) === 'string') {
        label = this.labels[type]
      }
      
      return {
          url: url,
          label: label,
          type: type,
          icon: icon,
          checked: checked,
      }
    },
    buildGoogleDocLinks: function (type, id) {
      let linksMap = {}
      let linkPrefix
      switch (type) {
        case "document":
          linkPrefix = "https://docs.google.com/document/d/"

          /*
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/edit?usp=sharing', type + '.share', "linkify"))

          //links.push(this.buildGoogleDocLink(linkPrefix + id + '/preview', type + '.preview', "play circle"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/copy', type + '.copy', "copy"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=pdf', type + '.pdf', "file pdf outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=odt', type + '.odt', "file alternate"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=doc', type + '.doc', "file word outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=rtf', type + '.rtf', "file alternate"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=txt', type + '.txt', "file alternate outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=html', type + '.html', "html5"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=epub', type + '.epub', "book"))
          */
          linksMap[type + '.share'] = this.buildGoogleDocLink(linkPrefix + id + '/edit?usp=sharing', type + '.share', "linkify")
          
          //linksMap[type + '.preview'] = this.buildGoogleDocLink(linkPrefix + id + '/preview', type + '.preview', "play circle")
          linksMap[type + '.copy'] = this.buildGoogleDocLink(linkPrefix + id + '/copy', type + '.copy', "copy")
          linksMap[type + '.pdf'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=pdf', type + '.pdf', "file pdf outline")
          linksMap[type + '.odt'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=odt', type + '.odt', "file alternate")
          linksMap[type + '.doc'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=doc', type + '.doc', "file word outline")
          linksMap[type + '.rtf'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=rtf', type + '.rtf', "file alternate")
          linksMap[type + '.txt'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=txt', type + '.txt', "file alternate outline")
          linksMap[type + '.html'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=html', type + '.html', "html5")
          linksMap[type + '.epub'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=epub', type + '.epub', "book")
          
          break;
        case "spreadsheets":
          linkPrefix = "https://docs.google.com/spreadsheets/d/"

          /*
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/edit?usp=sharing', type + '.share', "linkify"))

          //links.push(this.buildGoogleDocLink(linkPrefix + id + '/preview', type + '.preview'))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/copy', type + '.copy', "copy"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=csv', type + '.csv', "file alternate outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=ods', type + '.ods', "file alternate"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=xlsx', type + '.xlsx', "file excel outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=tsv', type + '.tsc', "file alternate outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=pdf', type + '.pdf', "file pdf outline"))
          */
          
          linksMap[type + '.share'] = this.buildGoogleDocLink(linkPrefix + id + '/edit?usp=sharing', type + '.share', "linkify")
          
          //linksMap[type + '.preview'] = this.buildGoogleDocLink(linkPrefix + id + '/preview', type + '.preview', "play circle")
          linksMap[type + '.copy'] = this.buildGoogleDocLink(linkPrefix + id + '/copy', type + '.copy', "copy")
          linksMap[type + '.csv'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=csv', type + '.csv', "file alternate outline")
          linksMap[type + '.ods'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=ods', type + '.ods', "file alternate")
          linksMap[type + '.xlsx'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=xlsx', type + '.xlsx', "file excel outline")
          linksMap[type + '.tsv'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=tsv', type + '.tsc', "file alternate outline")
          linksMap[type + '.pdf'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=pdf', type + '.pdf', "file pdf outline")
          
          break;
        case "presentation":
          linkPrefix = "https://docs.google.com/spreadsheets/d/"
          /*
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/edit?usp=sharing', type + '.share', "linkify"))

          //links.push(this.buildGoogleDocLink(linkPrefix + id + '/preview', type + '.preview', "play circle"))
          //links.push(this.buildGoogleDocLink(linkPrefix + id + '/present', type + '.present', "play circle"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/copy', type + '.copy', "copy"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=pdf', type + '.pdf', "file pdf outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=odp', type + '.odp', "file alternate"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=pptx', type + '.pptx', "file powerpoint outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=txt', type + '.txt', "file alternate outline"))
          //links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=jpeg', type + '.jpeg', "file image outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=png', type + '.png', "file image outline"))
          links.push(this.buildGoogleDocLink(linkPrefix + id + '/export?format=svg', type + '.svg', "file image outline"))
          */
          linksMap[type + '.share'] = this.buildGoogleDocLink(linkPrefix + id + '/edit?usp=sharing', type + '.share', "linkify")
          
          //linksMap[type + '.preview'] = this.buildGoogleDocLink(linkPrefix + id + '/preview', type + '.preview', "play circle")
          //linksMap[type + '.present'] = this.buildGoogleDocLink(linkPrefix + id + '/present', type + '.present', "play circle")
          linksMap[type + '.copy'] = this.buildGoogleDocLink(linkPrefix + id + '/copy', type + '.copy', "copy")
          linksMap[type + '.pdf'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=pdf', type + '.pdf', "file alternate outline")
          linksMap[type + '.odp'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=odp', type + '.odp', "file alternate")
          linksMap[type + '.pptx'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=pptx', type + '.pptx', "file excel outline")
          linksMap[type + '.txt'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=tsv', type + '.txt', "file alternate outline")
          linksMap[type + '.jpeg'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=pdf', type + '.jpeg', "file pdf outline")
          linksMap[type + '.png'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=png', type + '.png', "file pdf outline")
          linksMap[type + '.svg'] = this.buildGoogleDocLink(linkPrefix + id + '/export?format=svg', type + '.svg', "file pdf outline")
         
          break;
        default:
          // https://drive.google.com/open?id=0B3_qgRmbvvZ1MTc4M0NRZ25CSFRPQ3NMS1RXdk1PSG52VXVr
          /*
          links.push(this.buildGoogleDocLink('https://drive.google.com/open?id=' + id, type + '.share', "linkify"))

          links.push(this.buildGoogleDocLink("https://drive.google.com/uc?export=download&id=" + id, type + '.download', "file alternate outline"))
          */
          linksMap[type + '.share'] = this.buildGoogleDocLink('https://drive.google.com/open?id=' + id, type + '.share', "linkify")
          linksMap[type + '.download'] = this.buildGoogleDocLink("https://drive.google.com/uc?export=download&id=" + id, type + '.download', "file alternate outline")
         
      }
      return linksMap
    },
    sortLinks: function (linksMap) {
      let links = []
      
      if (typeof(this.order) === 'object' 
              && Array.isArray(this.order[this.currentType])
              && this.order[this.currentType].length > 1) {
        this.order[this.currentType].forEach(type => {
          if (typeof(linksMap[type]) === 'object') {
            links.push(linksMap[type])
            delete linksMap[type]
          }
        })
      }
      
      for (let key in linksMap) {
        links.push(linksMap[key])
      }
      
      return links
    }
    
  },
  
}

export default config