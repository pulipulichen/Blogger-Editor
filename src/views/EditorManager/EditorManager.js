/*
EditorManager = {
  template: `
  <div class="form-group">
    <label for="uploadImageDraft">Upload Image Draft</label>
    <input name="uploadImageDraft" type="text" 
      data-persist="garlic"
      class="form-control" 
      id="uploadImageDraft" aria-describedby="emailHelp" 
      placeholder="https://www.blogger.com/blogger.g?blogID=..." />
    <a href="https://www.blogger.com" target="bloggerManager">
      <small class="form-text text-muted">Open Blogger console</small>
    </a>
  </div>`,
  init: function () {
    $(() => {
      $('#editorManagerModal .modal-body').html(this.template)
    })
  }
}

EditorManager.init()
*/

var EditorManager = {
  //name: "main-content",
  data: function () {
    return {
      ui: undefined,
      uploadImageDraft: '',
      disableUploadImageDraft: true
    }
  },
  mounted() {
    if (localStorage.getItem('uploadImageDraft')) {
      try {
        this.uploadImageDraft = localStorage.getItem('uploadImageDraft');
      } catch(e) {
        localStorage.removeItem('uploadImageDraft');
      }
    }
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
    validateUploadImageDrarfUrl: function () {
      this.disableUploadImageDraft = !this.uploadImageDraft.startsWith('https://www.blogger.com/blogger.g?blogID=')
      //console.log(this.disableUploadImageDraft)
    },
    persist() {
      localStorage.uploadImageDraft = this.uploadImageDraft;
      //console.log('now pretend I did more stuff...');
    }
  }
}

window.EditorManager = EditorManager
export default EditorManager