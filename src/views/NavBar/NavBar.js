var NavBar = {
  //name: "main-content",
  data: () => ({
      // reactive data property of the component.
      //webpack: 'Powered by webpack! is it work?',
  }),
  created: function () {
    $v.NavBar = this
  },
  methods: {
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
  }
}

export default NavBar