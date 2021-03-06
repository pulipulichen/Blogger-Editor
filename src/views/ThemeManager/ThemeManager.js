import TemplateManager from './TemplateManager.js'
import StyleManager from './StyleManager.js'
import TemplateBuilderSfc from './TemplateBuilder/TemplateBuilder.vue'
import VueHelper from './../../helpers/VueHelper.js'

var ThemeManager = {
  //name: "main-content",
  data: function () {
    return {
      ui: undefined,
      //defaultTheme: 'simple'
      defaultTheme: ConfigHelper.get('defaultTheme'),
      useCustomTemplate: false,
      useCustomStyle: false,
      path: {
        template: '/template.html',
        style: '/style.css'
      },
      TemplateManager: TemplateManager,
      StyleManager: StyleManager,
      TemplateBuilder: null,
      onCloseReload: false,
      customStyle: ''
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
    $(() => {
      let items = $('.ThemeManager.modal .menu .item')
      if (typeof(items.tab) === 'function') {
        items.tab()
      }
      //this.open()
    })
    $v.ThemeManager = this
    
    if (ConfigHelper.get('debug').disableTemplateBuilder === false) {
      VueHelper.init('TemplateBuilder', TemplateBuilderSfc, (TemplateBuilder) => {
        this.TemplateBuilder = TemplateBuilder
      })
    }
    
  },
  methods: {
    // ---------------------
    // Methods of Modal
    // ---------------------
    
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        //this.ui = $('.ThemeManager.ui.modal')
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    },
    open: function () {
      this.TemplateManager.hasCustomTemplate((isExists) => {
        this.useCustomTemplate = isExists
        this.StyleManager.hasCustomStyle((isExists) => {
          this.useCustomStyle = isExists
          this.getUI().modal('show')
        })  
      })
      
      //console.log(this.data)
      
    },
    close: function () {
      //console.log('close')
      //return false
      if (this.onCloseReload === true) {
        this.onCloseReload = false
        //this.reload(() => {
        //console.log('get ready to reload')
        let style = this.customStyle
        this.StyleManager.saveStyle(style, () => {
          InitHelper.reload(() => {
            this.getUI().modal('hide')
          })
        })
      }
      else {
        this.getUI().modal('hide')
      }
      
    },
    persist() {
      //localStorage.uploadImageDraft = this.uploadImageDraft;
      //console.log('now pretend I did more stuff...');
    },
    // -------------------------
    // Other Methods
    // -------------------------
    /*
    loadThemeFile: function (templatePath, callback) {
      let name = 'simple'
      
      let templatePath, stylePath
      if (templatePath.startsWith('filesystem:http') === false) {
        templatePath = 'themes/' + templatePath + '/template.html'
        stylePath = 'themes/' + templatePath + '/style.css'
      }
      else {
        // filesystem:http://localhost:8383/temporary/home-icon_1.png
        let prefix = 'filesystem:' + location.protocol + '://' + location.host + '/temporary'
        templatePath = prefix + templatePath + '/template.html'
        stylePath = prefix + templatePath + '/style.css'
      }
      $(`<link href="${stylePath}" rel="stylesheet" type="text/css" />`)
              .appendTo('head')
      
      $.get(templatePath, (template) => {
        template = this.processTemplate(template)
        
        $('#template').html(template)

        FunctionHelper.triggerCallback(callback)
      })
    },
    */
    /*
    loadStyle: function (callback) {
      
      //let stylePath = 'filesystem:' + location.protocol + '://' + location.host + '/temporary' + path
      
      //this.hasCustomStyle((isExisted) => {
      this.StyleManager.hasCustomStyle((isExisted) => {
        let path = this.path.style
        let stylePath = FileSystemHelper.getFileSystemUrl(path)
        if (isExisted === false) {
          stylePath = 'themes/' + this.defaultTheme + '/style.css'
        }
        
        $(`<link href="${stylePath}" rel="stylesheet" type="text/css" />`)
              .appendTo('head')
        
        FunctionHelper.triggerCallback(callback)
      })
    },
    */
    init: function (callback) {
      if (ConfigHelper.get('debug').disableThemeManager === true) {
        return FunctionHelper.triggerCallback(callback)
      }
      
      //this.loadStyle(() => {
        //this.loadTemplate(callback)
      //  this.TemplateManager.load(callback)
      //})
      
      
      this.StyleManager.getStyle((style) => {
        this.customStyle = style
      })
      
      this.StyleManager.load(() => {
        //console.log('StyleManager loaded')
        this.TemplateManager.load(callback)
      })
    },
    /*
    hasCustomStyle: function (callback) {
      let path = this.path.style
      FileSystemHelper.isExists(path, callback)
    },
    */
    // --------
    
    openTemplateBuilder: function () {
      this.TemplateBuilder.open()
    },
    
    openTab: function (e) {
      SemanticUIHelper.openTab(e)
    },
    reload: function (callback) {
      $('#template').empty()
      this.init(callback)
    },
    getConfig: function (callback) {
      this.TemplateManager.getConfig((template) => {
        this.StyleManager.getConfig((style) => {
          FunctionHelper.triggerCallback(callback, template, style)
        })
      })
    }
  }
}

//window.ThemeManager = ThemeManager
export default ThemeManager