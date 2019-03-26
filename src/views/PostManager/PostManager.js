/*
PostManager = {
  template: `<div>okok</div>`,
  init: function () {
    $(() => {
      $('#postsManagerModal .modal-body').html(this.template)
    })
  }
}

PostManager.init()
*/


var PostManager = {
  //name: "main-content",
  data: function () {
    return {
      ui: undefined,
      //uploadImageDraft: '',
      //disableUploadImageDraft: true
    }
  },
  mounted() {
    /*
    if (localStorage.getItem('uploadImageDraft')) {
      try {
        this.uploadImageDraft = localStorage.getItem('uploadImageDraft');
      } catch(e) {
        localStorage.removeItem('uploadImageDraft');
      }
    }
    */
  },
  created: function () {
    //return
    $(() => {
      this.getUI().find('.close.icon').click(() => {
        //console.log(1)
        this.close()
      })
      
      this.open()
    })   
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        console.log('find ui')
        this.ui = this.ui = $('.PostManager.ui.modal')
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
    persist() {
      //localStorage.uploadImageDraft = this.uploadImageDraft;
      //console.log('now pretend I did more stuff...');
    }
  }
}

window.PostManager = PostManager
export default PostManager