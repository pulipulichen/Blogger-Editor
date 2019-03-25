let config = {
  //name: "main-content",
  data: () => ({
      // reactive data property of the component.
      //webpack: 'Powered by webpack! is it work?',
  }),
  created: function () {
    $(() => {
      this.openEditorManager()
      
    })
  },
  methods: {
    openPostManager: function () {
      console.log(1)
    },
    openThemeManager: function () {
      console.log(2)
    },
    openEditorManager: function () {
      $('.EditorManager.ui.modal').modal('show')
    },
  }
}

export default config