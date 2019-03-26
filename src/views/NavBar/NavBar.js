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
      console.log(1)
    },
    openThemeManager: function () {
      console.log(2)
    },
    openEditorManager: function () {
      EditorManager.methods.open()
    },
  }
}

export default NavBar