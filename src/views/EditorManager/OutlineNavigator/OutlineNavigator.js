let config = {
  data: function () {
    return {
      name: 'OutlineNavigator',
      ui: undefined,
      templateElement: null,
      postBody: null,
      opened: false,
      headingsElement: null,
      windowElement: null,
      toolbarElement: null,
      headings: [
        {
          text: "h2 heading heading heading heading heading heading",
          eq: 0,
          subheading: [
            {
              text: 'h3 heading heading heading heading heading heading',
              eq: 1
            },
            {
              text: 'h3 heading heading heading heading heading heading',
              eq: 2
            }
          ]
        },
        {
          text: "h2 heading",
          eq: 0,
          subheading: [
            {
              text: 'h3 heading',
              eq: 1
            },
            {
              text: 'h3 heading',
              eq: 1
            }
          ]
        }
      ]
    }
  },
  mounted: function () {
    
  },
  computed: {
    
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
        this.templateElement = $('#template')
      }
      return this.ui
    },
    open: function () {
      this.opened = true
      //this.getUI().modal('show')
      //this.getUI().sidebar('toggle')
      this.analyseHeadings()
      this.getUI().addClass('visible')
      this.templateElement.addClass('sidebar')
      console.log('open')
    },
    close: function () {
      this.opened = false
      //this.getUI().modal('hide')
      //this.getUI().sidebar('toggle')
      this.getUI().removeClass('visible')
      this.templateElement.removeClass('sidebar')
      console.log('close')
    },
    toggle: function () {
      if (this.opened) {
        this.close()
      }
      else {
        this.open()
      }
    },
    analyseHeadings: function () {
      if (this.opened === false) {
        return
      }
      
      if (this.postBody === null) {
        this.postBody = $v.EditorManager.FieldPostBody.getElement()
      }
      let headingsSelector = 'h1,h2,h3,h4,h5'
      let headingsOriginal = []
      let minHeadingLevel = 5
      this.headingsElement = this.postBody.find(headingsSelector)
      this.headingsElement.each((i, headingElement) => {
        let tagName = headingElement.tagName
        let headingLevel = parseInt(tagName.slice(1), 10)
        if (headingLevel < minHeadingLevel) {
          minHeadingLevel = headingLevel
        }
        
        let text = $(headingElement).text().trim()
        headingsOriginal.push({
          text: text,
          eq: i,
          level: headingLevel
        })
      })
      //console.log(headings.length)
      
      let headings = []
      let subheading = false
      let lastLevel = null
      headingsOriginal.forEach((heading) => {
        if (heading.level === minHeadingLevel
                || heading.level === (minHeadingLevel + 1)) {
          
          //console.log([heading])
          
          if (lastLevel !== null) { 
            if (heading.level > lastLevel) {
              subheading = true
            }
            else if (heading.level < lastLevel) {
              subheading = false
            }
          }
          
          if (lastLevel === null
                  || subheading === false) {
            headings.push({
              text: heading.text,
              eq: heading.eq,
              subheading: []
            })
            lastLevel = heading.level
          }
          else {
            //console.log(headings)
            let lastHeading = headings[(headings.length - 1)]
            //console.log(lastHeading)
            lastHeading.subheading.push({
              text: heading.text,
              eq: heading.eq,
            })
            lastLevel = heading.level
          }
        }
      })
      
      this.headings = headings
      
    },
    scrollTo: function (eq) {
      //console.log(['scrollTo', eq])
      let top = this.headingsElement.eq(eq).offset().top
      //console.log(['scrollTo', top])
      if (this.windowElement === null) {
        this.windowElement = $(window)
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
    }
  }
}

export default config