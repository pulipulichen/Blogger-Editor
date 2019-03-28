/*
ThemeManager = {
  template: `<div>ThemeManager</div>`,
  init: function () {
    $(() => {
      $('#themeManagerModal .modal-body').html(this.template)
    })
  }
}

ThemeManager.init()
*/

var ThemeManager = {
  //name: "main-content",
  data: function () {
    return {
      ui: undefined,
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
      this.getUI().find('.close.icon:first').click(() => {
        //console.log(1)
        this.close()
      })
      
      //this.open()
    })   
  },
  methods: {
    // ---------------------
    // Methods of Modal
    // ---------------------
    
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = this.ui = $('.ThemeManager.ui.modal')
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
    },
    // -------------------------
    // Other Methods
    // -------------------------
    loadThemeFile: function (name, callback) {
      
      
      let templatePath, stylePath
      if (name.startsWith('filesystem:http') === false) {
        templatePath = 'themes/' + name + '/template.html'
        stylePath = 'themes/' + name + '/style.css'
      }
      else {
        // filesystem:http://localhost:8383/temporary/home-icon_1.png
        let prefix = 'filesystem:' + location.protocol + '://' + location.host + '/temporary'
        templatePath = prefix + name + '/template.html'
        stylePath = prefix + name + '/style.css'
      }
      $(`<link href="${stylePath}" rel="stylesheet" type="text/css" />`)
              .appendTo('head')
      
      $.get(templatePath, (template) => {
        //console.log(template)
        //let titleEditor = `<input type="text" name="postTitle" id="postTitle" />`
        let titleEditor = `<div id="summernotePostTitle">Post Title [TEMP]</div>`
        template = template.replace('${postTitle}', titleEditor)

        //let postEditor = `<div id="summernotePostBody"><p>HelloAAAA</p><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><p>Summernote</p></div>`
        let postEditor = `<div id="summernotePostBody"><p>HelloAAAA</p><p>Summernote</p></div>`
        template = template.replace('${postBody}', postEditor)

        $('#template').html(template)

        FunctionHelper.triggerCallback(callback)
      })
    }
  }
}

window.ThemeManager = ThemeManager
export default ThemeManager