import NavBarMenu from './../NavBarMenu/NavBarMenu.vue'

let NavBarMenuSidebar = {
  //name: "main-content",
  data: function () {
    return {
      name: 'NavBarSidebar',
      ui: undefined
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
      }
      return this.ui
    },
    open: function () {
      //console.log('aaa')
      //this.getUI().sidebar('toggle')
      this.getUI().transition('slide right')
    },
    close: function () {
      //this.getUI().sidebar('toggle')
      this.getUI().transition('slide right')
    },
  }
}

export default NavBarMenuSidebar