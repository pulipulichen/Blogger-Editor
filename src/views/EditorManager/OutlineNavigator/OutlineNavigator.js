let config = {
  data: function () {
    return {
      name: 'OutlineNavigator',
      ui: undefined,
      $body: undefined,
      templateElement: null,
      postBody: null,
      opened: false,
      headingsElement: null,
      windowElement: null,
      toolbarElement: null,
      entryList: [],
      entryHierarchy: [],
      entryCollection: null
    }
  },
  /*
  mounted: function () {
    
  },
  computed: {
    
  },
  */
  created: function () {
    $v[this.name] = this
  },
  methods: {
    init: function () {
      //EventManager.on($v.PostManager, 'updateEditingPostBody', () => {
      //  this.buildEntryList()
      //})
      
      EventManager.on($v.EditorManager.FieldPostBody, ['set', 'change'], () => {
        this.buildEntryList()
      })
    },
    
    // ---------------------
    // Methods of Modal
    // ---------------------
    
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
        this.templateElement = $('#template')
        this.$body = $('body')
      }
      return this.ui
    },
    open: function () {
      this.opened = true
      //this.getUI().modal('show')
      //this.getUI().sidebar('toggle')
      //this.analyseHeadings()
      this.buildEntryList()
      this.getUI().addClass('visible')
      this.templateElement.addClass('sidebar')
      //console.log('open')
      this.$body.addClass('OutlineNavigator-open')
    },
    close: function () {
      this.opened = false
      //this.getUI().modal('hide')
      //this.getUI().sidebar('toggle')
      this.getUI().removeClass('visible')
      this.templateElement.removeClass('sidebar')
      //console.log('close')
      this.$body.removeClass('OutlineNavigator-open')
    },
    toggle: function () {
      if (this.opened) {
        this.close()
      }
      else {
        this.open()
      }
    },
    buildEntryList: function () {
      if (this.opened === false) {
        return
      }
      
      if (this.postBody === null) {
        this.postBody = $v.EditorManager.FieldPostBody.getElement()
      }
      let selector = 'h1,h2,h3,h4,h5,h6,.note-editor-comment'
      this.entryCollection = this.postBody.find(selector)
      let list = []
      
      // ----------------------------------------
      
      let minHeadingLevel = 6
      this.entryCollection.each((i, entry) => {
        let text = $(entry).text().trim()
        if (text === '') {
          return
        }
        
        let tagName = entry.tagName.toLowerCase()
        let headingLevel = -1
        let title = ""
        
        let type = 'heading'
        if (tagName.startsWith('h') && tagName.length === 2) {
          headingLevel = parseInt(tagName.slice(1), 10)
          if (headingLevel < minHeadingLevel) {
            minHeadingLevel = headingLevel
          }
        }
        else {
          if (typeof(entry.title) === 'string' 
                  && entry.title.trim() !== '') {
            title = entry.title.trim()
          }
          type = 'comment'
        }
        
        list.push({
          text: text,
          title: title,
          eq: i,
          level: headingLevel,
          type: type
        })
      })
      
      // --------------------------
      // 確定類型，移除多餘標籤
      
      list = list.filter(item => {
        let level = item.level
        //console.log(level)
        if (level === -1) {
          return true
        } 
        if (level === minHeadingLevel) {
          item.comments = []
          item.subheadings = []
          return true
        }
        else if (level === (minHeadingLevel + 1)) {
          item.type = 'subheading'
          //console.log(item.type)
          item.comments = []
          return true
        }
        else {
          return false
        }
      })
      
      // ----------------------------------------
      
      let lastHeading = {
        text: this.$t('(Header)'),
        eq: -1,
        level: minHeadingLevel,
        type: 'heading',
        comments: []
      }
      let lastSubheading
      let lastHeadingType
      
      //console.log(list)
      
      this.entryHierarchy = []
      list.forEach(entry => {
        if (entry === undefined) {
          return
        }
        
        if (lastHeadingType === undefined) {
          // 第一次
          if (entry.type === 'heading') {
            this.entryHierarchy.push(entry)
            lastHeading = entry
          }
          else {
            this.entryHierarchy.push(lastHeading)
            lastHeading.comments.push(entry)
          }
          lastHeadingType = 'heading'
        }
        else {
          if (entry.type === 'heading') {
            this.entryHierarchy.push(entry)
            lastHeading = entry
            lastHeadingType = 'heading'
          }
          else if (entry.type === 'subheading') {
            lastHeading.subheadings.push(entry)
            lastSubheading = entry
            lastHeadingType = entry.type
          }
          else {
            if (lastHeadingType === 'heading') {
              lastHeading.comments.push(entry)
            }
            else {
              lastSubheading.comments.push(entry)
            }
          }
        }
        //lastType = entry.type
      })
      
      //console.log(this.entryHierarchy)
    },
    scrollTo: function (eq) {
      
      //console.log(['scrollTo', eq])
      let top = this.entryCollection.eq(eq).offset().top
      //console.log(['scrollTo', top])
      if (this.windowElement === null) {
        this.windowElement = $(window)
      }
      
      if (eq === -1) {
        this.windowElement.scrollTop(0)
        return
      }
      
      if (this.toolbarElement === null) {
        this.toolbarElement = $('.note-toolbar')
      }
      
      let toolbarHeight = this.toolbarElement.height()
      let toolbarPostion = this.toolbarElement.css('position').toLowerCase()
      top = top - toolbarHeight - 10
      
      if (top < toolbarHeight
              || toolbarPostion !== 'fixed') {
        top = top - toolbarHeight
        //console.log(['decrease height', toolbarHeight])
      }
      this.windowElement.scrollTop(top)
    },
    scrollToTop: function () {
      if (this.windowElement === null) {
        this.windowElement = $(window)
      }
      this.windowElement.scrollTop(0)
    },
    scrollToFooter: function () {
      if (this.windowElement === null) {
        this.windowElement = $(window)
      }
      this.windowElement.scrollTop($(document).height() + 500)
    },
    getCommentTitle: function (comment) {
      let title = ''
      
      if (typeof(comment.title) === 'string'
              && comment.title.trim() !== '') {
        title = comment.title
        
        if (title.length > 30) {
          title = title.slice(0, 30) + '...'
        }
      }
      
      return title
    },
    getCommentTitleAttr: function (comment) {
      let title = this.getCommentTitle(comment)
      
      if (typeof(comment.text) === 'string'
              && comment.text.trim() !== '') {
        if (title !== "") {
          title = ": " + title
        }
        
        let text = comment.text
        if (text.length > 30) {
          text = text.slice(0, 30)
        }
        
        title = text + title
      }
      
      return title
    },
    toggleComment: function (event) {
      event.preventDefault()
      event.stopPropagation()
      
      let heading = $(event.target).parents('a.item:first')
      let comments = heading.next()
      
      comments.slideToggle()
    }
  }
}

export default config