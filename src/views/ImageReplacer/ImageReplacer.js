import dayjs from 'dayjs'

var config = {
  //name: "main-content",
  data: function () {
    return {
      ui: undefined,
    }
  },
  created: function () {
    $v.ImageReplacer = this
    $(() => {
      //this.open()
    })
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = this.ui = $('.EditorManager.ui.modal')
      }
      return this.ui
    },
    open: function () {
      //console.log(this.data)
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    },
  }
}

//window.EditorManager = EditorManager
export default config