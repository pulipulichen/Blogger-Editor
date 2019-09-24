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
      entryCollection: null,
      highlightHeadingEq: 0
    }
  },
  
  mounted: function () {
    VueHelper.mountLocalStorageBoolean(this, 'opened')
    this.init()
  },
  /*
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
      
      $(window).scroll((event) => {
        this.highlightHeading(event)
      })
      $(window).resize((event) => {
        this.highlightHeading(event)
      })
      //setTimeout(() => {
      EventManager.on(InitHelper, 'initFinish', () => {
        //console.log('initFinish')
        this.highlightHeading()
        if (this.opened === true) {
          this.open()
        }
      })
        
      //}, 1000)
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
      VueHelper.persistLocalStorage(this, 'opened')
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
      VueHelper.persistLocalStorage(this, 'opened')
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
      let selector = 'h1,h2,h3,h4,h5,h6,.note-editor-comment,img[data-ocr="waiting"]'
      this.entryCollection = this.postBody.find(selector)
      let list = []
      
      // ----------------------------------------
      
      let minHeadingLevel = 6
      this.entryCollection.each((i, entry) => {
        let $entry = $(entry)
        let text
        let top = $entry.offset().top
        
        let tagName = entry.tagName.toLowerCase()
        let headingLevel = -1
        let title = ""
        
        let type = 'heading'
        if (tagName.startsWith('h') && tagName.length === 2) {
          headingLevel = parseInt(tagName.slice(1), 10)
          if (headingLevel < minHeadingLevel) {
            minHeadingLevel = headingLevel
          }
          text = $entry.text().trim()
          if (text === '') {
            return
          }
        }
        else if (entry.className.indexOf('note-editor-comment') > -1) {
          if (typeof(entry.title) === 'string' 
                  && entry.title.trim() !== '') {
            title = entry.title.trim()
          }
          type = 'comment'
          text = $entry.text().trim()
          if (text === '') {
            return
          }
        }
        else if (entry.getAttribute('data-ocr') === 'waiting') {
          type = 'ocr'
        }
        
        list.push({
          text: text,
          title: title,
          eq: i,
          level: headingLevel,
          type: type,
          //highlight: false,
          top: top,
          ocrWaitingCount: 0
        })
      })
      
      // --------------------------
      // 確定標題的層次，移除多餘的標題標籤
      
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
        //highlight: false,
        top: 0,
        comments: [],
        ocrWaitingCount: 0
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
          //console.log(entry)
          if (entry.type === 'heading') {
            this.entryHierarchy.push(entry)
            lastHeading = entry
          }
          else if (entry.type === 'comment') {
            this.entryHierarchy.push(lastHeading)
            lastHeading.comments.push(entry)
          }
          else if (entry.type === 'ocr') {
            this.entryHierarchy.push(lastHeading)
            lastHeading.ocrWaitingCount++
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
          else if (entry.type === 'comment') {
            if (lastHeadingType === 'heading') {
              lastHeading.comments.push(entry)
            }
            else {
              lastSubheading.comments.push(entry)
            }
          }
          else if (entry.type === 'ocr') {
            if (lastHeadingType === 'heading') {
              lastHeading.ocrWaitingCount++
            }
            else {
              lastSubheading.ocrWaitingCount++
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
    },
    highlightHeading: function (event) {
      //console.log(event)
      DelayExecHelper.backExec('OutlineNavigator.highlightHeading', 0.2, () => {
        //console.log([this.highlightHeadingEq, this.entryHierarchy[0].eq, (this.highlightHeadingEq === this.entryHierarchy[0].eq)])
        let top = window.scrollY + $(".summernotePostBody-wrapper .note-editor .note-toolbar").height() + 50
        //console.log(window.scrollY)
        //this.entryHierarchy[0].highlight = true
        //let direct = null
        //let i = parseInt(this.entryHierarchy.length / 2, 10)
        
        let mainHeading = null
        for (let i = 0; i < this.entryHierarchy.length; i++) {
          if (top < this.entryHierarchy[i].top) {
            break;
          }
          else {
            mainHeading = this.entryHierarchy[i]
          }
        }
        
        if (mainHeading !== null && Array.isArray(mainHeading.subheadings)) {
          let subheading = null
          for (let i = 0; i < mainHeading.subheadings.length; i++) {
            if (top < mainHeading.subheadings[i].top) {
              break;
            }
            else {
              subheading = mainHeading.subheadings[i]
            }
          }
          
          if (subheading !== null) {
            mainHeading = subheading
          }
        }
        
        if (mainHeading === null && this.entryHierarchy.length > 0) {
          mainHeading = this.entryHierarchy[0]
        }
        if (mainHeading === null) {
          return
        }
        
        this.highlightHeadingEq = mainHeading.eq
        //console.log($('#OutlineNavigatorHeadingEq' + mainHeading.eq + ':visible').length)
        document.getElementById('OutlineNavigatorHeadingEq' + mainHeading.eq).scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
        
        /*
        let findHeading = (i) => {
          if (direct === null) {
            return parseInt(headingList.length / 2, 10)
          }
          else if (direct === 'large') {
            return parseInt((headingList.length - i) / 2, 10)
          }
          else {
            return parseInt(i / 2, 10)
          }
        }
        
        let loopHeading = (prevI) => {
          let i = findHeading(prevI)
          
          if (i !== prevI) {
            
          }
          else {
            // 找到了，沒有了
            this.highlightHeadingEq = headingList.eq
          }
        }
        loopHeading(0)
        */
      })
    },
    getCommentUnit: function (count) {
      if (count > 1) {
        return this.$t('comments')
      }
      else {
        return this.$t('comment')
      }
    },
    getOCRWaitingUnit: function (count) {
      if (count > 1) {
        return this.$t('images is wating for OCR')
      }
      else {
        return this.$t('image is wating for OCR')
      }
    }
  }
}

export default config