import NavBarMenu from './NavBarMenu/NavBarMenu.vue'

let NavBar = {
  //name: "main-content",
  data: function () {
    return {
      name: 'NavBar',
      ui: undefined,
      wordCount: 0,
      navbarHeight: 55,
      classNameFixed: 'call-fixed',
      $body: null,
      sidebarWidth: 700,
      lastScrollTop: 0,
      scrollTimer: null
    }
  },
  components: {
    'navbar-menu': NavBarMenu
  },
  created: function () {
    $v.NavBar = this
    this.$body = $('body')
    this.initWindowEvent()
  },
  computed: {
    wordCountUnit: function () {
      if (this.wordCount > 1) {
        return this.$t('words')
      }
      else {
        return this.$t('word')
      }
    }
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    },
    openSidebarMenu: function () {
      //$v.PublishManager.open()
      $v.NavBarSidebar.open()
    },
    toggle: function () {
      //console.log('aaa')
      // check scroll height
      if (document.body.clientWidth < this.sidebarWidth) {
        $v.NavBarSidebar.open()
      }
      else {
        let ui = this.getUI()
        if (window.scrollY > this.navbarHeight) {
          if (ui.hasClass(this.classNameFixed) === false) {
            ui.addClass(this.classNameFixed)
            ui.slideDown()
            this.$body.toggleClass(this.classNameFixed)
          }
          else {
            ui.slideUp(() => {
              ui.removeClass(this.classNameFixed)
            })
            this.$body.toggleClass(this.classNameFixed)
          }
        }
        else {
          ui.removeClass(this.classNameFixed)
          this.$body.removeClass(this.classNameFixed)
        }
      }
    },
    unpin: function () {
      //console.log('aaa')
      // check scroll height
      if (document.body.clientWidth < this.sidebarWidth) {
        $v.NavBarSidebar.close()
      }
      else {
        let ui = this.getUI()
        if (window.scrollY > this.navbarHeight) {
          if (ui.hasClass(this.classNameFixed) === false) {
            ui.addClass(this.classNameFixed)
            ui.slideDown()
            this.$body.toggleClass(this.classNameFixed)
          }
          else {
            ui.slideUp(() => {
              ui.removeClass(this.classNameFixed)
            })
            this.$body.toggleClass(this.classNameFixed)
          }
        }
        else {
          ui.removeClass(this.classNameFixed)
          this.$body.removeClass(this.classNameFixed)
        }
      }
    },
    init: function (callback) {
      EventManager.on($v.EditorManager.FieldPostBody, ['set', 'change'], (FieldPostBody) => {
        //console.log('aaa')
        let text = FieldPostBody.getText()
        text = text.replace(/[^\x20-\x7E]/gmi, "")
        text = text.split(' ').join('')
        this.wordCount = text.length
        //console.log(this.wordCount)
        //
      })
      
      FunctionHelper.triggerCallback(callback)
    },
    initWindowEvent: function () {
      let setClassName = () => {
        if (window.scrollY > this.navbarHeight) {
          this.$body.addClass('topbar-out-of-view')
        }
        else {
          this.$body.removeClass('topbar-out-of-view')
        }
      }
      
      let $window = $(window)
      let className = 'upscroll'
      //let scrollTimer
      
      let scrollDown = (ui) => {
        ui.addClass(className)
        ui.slideDown()
      }
      
      let scrollUp = (ui) => {
        let st = window.pageYOffset || document.documentElement.scrollTop
        if (st < this.navbarHeight) {
          return
        }
        
        ui.slideUp(() => {
          ui.removeClass(className)
        })
      }
      
      $window.scroll(() => {
        setClassName()
        
        let ui = this.getUI()
        
        var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        if (st > this.lastScrollTop){
           // downscroll code
           //console.log('downscroll code')
           scrollUp(ui)
        } else {
           // upscroll code
           //console.log('upscroll code')
           scrollDown(ui)
           
           clearTimeout(this.scrollTimer)
           this.scrollTimer = setTimeout(() => {
             scrollUp(ui)
           }, 3000)
        }
        this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
      })
      $window.resize(() => {
        setClassName()
      })
    },
    clearScrollTimeout: function () {
      if (this.scrollTimer !== null) {
        clearTimeout(this.scrollTimer)
        this.scrollTimer = null
      }
    }
  }
}

export default NavBar