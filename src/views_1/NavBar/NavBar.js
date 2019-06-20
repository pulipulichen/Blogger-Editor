import NavBarMenu from './NavBarMenu/NavBarMenu.vue'

let NavBar = {
  //name: "main-content",
  data: function () {
    return {
      name: 'NavBar',
      ui: undefined,
      wordCount: 0,
      navbarHeight: 55
    }
  },
  components: {
    'navbar-menu': NavBarMenu
  },
  created: function () {
    $v.NavBar = this
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
        this.getUI().toggleClass('call-fixed')
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
  }
}

export default NavBar