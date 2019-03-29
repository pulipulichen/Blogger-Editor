var PostManagerModal = {
  //name: "main-content",
  data: function () {
    return {
      ui: undefined,
    }
  },
  created: function () {
    //return
    $(() => {
      this.getUI().find('.close.icon:first').click(() => {
        //console.log(1)
        this.close()
      })
    })   
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = this.ui = $('.PostManager.ui.modal')
      }
      return this.ui
    },
    open: function () {
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    }
  }
}

window.PostManagerModal = PostManagerModal
export default PostManagerModal