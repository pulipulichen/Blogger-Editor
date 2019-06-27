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
      $body: null
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
      if (document.body.clientWidth < 900) {
        $v.NavBarSidebar.open()
      }
      else {
        if (window.scrollY > this.navbarHeight) {
          this.getUI().toggleClass(this.classNameFixed)
          this.$body.toggleClass(this.classNameFixed)
        }
        else {
          this.getUI().removeClass(this.classNameFixed)
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
      $window.scroll(() => {
        setClassName()
      })
      $window.resize(() => {
        setClassName()
      })
    }
  }
}

export default NavBar