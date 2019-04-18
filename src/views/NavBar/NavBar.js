let NavBar = {
  //name: "main-content",
  data: function () {
    return {
      name: 'NavBar',
      ui: undefined,
    }
  },
  created: function () {
    $v.NavBar = this
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    },
    openPublishManager: function () {
      $v.PublishManager.open()
    },
    openPostManager: function () {
      $v.PostManager.open()
    },
    openThemeManager: function () {
      $v.ThemeManager.open()
    },
    openEditorManager: function () {
      $v.EditorManager.open()
    },
    openConfigManager: function () {
      $v.ConfigManager.open()
    },
    toggle: function () {
      this.getUI().toggleClass('call-fixed')
    }
  }
}

export default NavBar