import NavBarMenu from './../NavBarMenu/NavBarMenu.vue'

let NavBarMenuSidebar = {
  //name: "main-content",
  data: function () {
    return {
      name: 'NavBarSidebar',
      ui: undefined,
      dimmer: undefined,
      body: undefined
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
      //console.log('aaa')
      //this.getUI().sidebar('toggle')
      this.getUI().transition('slide right')
      this.dimmer.transition('fade in')
      this.body.css('overflow-y', 'hidden')
    },
    close: function () {
      //this.getUI().sidebar('toggle')
      this.getUI().transition('slide right')
      this.dimmer.transition('fade out')
      this.body.css('overflow-y', '')
    },
  }
}

export default NavBarMenuSidebar