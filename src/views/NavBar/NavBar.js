var NavBar = {
  //name: "main-content",
  data: () => ({
      // reactive data property of the component.
      //webpack: 'Powered by webpack! is it work?',
  }),
  created: function () {
  },
  methods: {
    openPostManager: function () {
      PostManager.methods.open()
    },
    openThemeManager: function () {
      ThemeManager.methods.open()
    },
    openEditorManager: function () {
      EditorManager.methods.open()
    },
  }
}

export default NavBar