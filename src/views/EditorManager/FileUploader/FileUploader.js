/* global VueHelper, WindowHelper, SemanticUIHelper, ConfigHelper */

import draggable from 'vuedraggable'

let config = {
  data: function () {
    return {
      name: 'FileUploader',
      ui: undefined,
      delimiter: '、',
      links: [],
      downloadTemplate: ``,
      downloadTemplateSlide: ``,
      downloadTemplateSheet: ``,
      downloadTemplateDoc: ``,
    }
  },
  mounted: function () {
    this.init()
    // VueHelper.mountLocalStorage(this, 'delimiter')
  },
  computed: {
    enableInsert: function () {
      // console.log(this.links)
      for (let i = 0; i < this.links.length; i++) {
        // console.log(this.links[i].downloadURL)
        if (this.validateDownloadURL(this.links[i].downloadURL)) {
          return 'green'
        }
      }
      
      return 'disabled'
    }
  },
  created: function () {
    $v[this.name] = this
  },
  components: {
    draggable,
  },
  methods: {
    
  }
}

import FileUploaderMethods from './FileUploaderMethods.js'
FileUploaderMethods(config)

export default config