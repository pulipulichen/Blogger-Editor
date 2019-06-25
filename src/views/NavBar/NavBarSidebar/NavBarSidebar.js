import NavBarMenu from './../NavBarMenu/NavBarMenu.vue'

let NavBarMenuSidebar = {
  //name: "main-content",
  data: function () {
    return {
      name: 'NavBarSidebar',
      ui: undefined,
      dimmer: undefined,
      body: undefined,
      isOpened: false
    }
  },
  created: function () {
    $v[this.name] = this
  },
  components: {
    'navbar-menu': NavBarMenu
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
        this.buildDimmer()
        this.body = $('body')
      }
      return this.ui
    },
    buildDimmer: function () {
      this.dimmer = $(`<div class="dimmer"></div>`).appendTo('body')
      this.dimmer.attr(this.$options._scopeId, '')
      this.dimmer.click(() => {
        this.close()
      })
      return this.dimmer
    },
    open: function () {
      if (this.isOpened === null || this.isOpened === true) {
        return
      }
      if ($v.OutlineNavigator.opened === false) {
        
        this.isOpened = null
        //console.log('aaa')
        //this.getUI().sidebar('toggle')
        this.getUI().transition({
          animation: 'slide right',
          onComplete: () => {
            this.isOpened = true
          }
        })
        this.dimmer.transition('fade in')
      }
      else {
        this.getUI().show()
        this.dimmer.show()
        this.isOpened = true
      }
      this.body.css('overflow-y', 'hidden')
    },
    close: function () {
      if (this.isOpened === null || this.isOpened === false) {
        return
      }
      
      //this.getUI().sidebar('toggle')
      if ($v.OutlineNavigator.opened === false) {
        this.isOpened = null
        this.getUI().transition({
          animation: 'slide right',
          onComplete: () => {
            this.isOpened = false
          }
        })
        this.dimmer.transition('fade out')
      }
      else {
        this.getUI().hide()
        this.dimmer.hide()
        this.isOpened = false
      }
      this.body.css('overflow-y', '')
    },
  }
}

export default NavBarMenuSidebar