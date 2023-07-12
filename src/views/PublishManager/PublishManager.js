/* global VueHelper, EventManager, FunctionHelper, ConfigHelper, WindowHelper, CopyPasteHelper, DayjsHelper */


let config = {
  data: function () {
    this.$i18n.locale = 'auto'
    return {
      name: 'PublishManager',
      ui: undefined,
      // bloggerConsoleURL: "https://www.blogger.com/",
      editURL: "",
      publicURL: "",
      postId: null,
      postTitle: "",
      postLabels: "",
      postSEOLink: "",
      editNote: "",
      bloggerConsoleURL: 'https://www.blogger.com/',
      urlChatGPTBlogger: 'https://chat.openai.com/',
      filesystemImageCount: 0,
      titleRecommend: false,
      isTitleRecommending: false,
      labelRecommends: [],
      isLabelRecommending: false,
      prompts: [],
      copied: [],
      URLpattern: new RegExp('^(https?:\\/\\/)?' + // protocol
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
              '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
              '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
              '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
    }
  },
  // wath: {
  //   'postId' () {
  //     this.postSEOLink = ''
  //   }
  // },
  mounted: function () {
    // VueHelper.mountLocalStorage(this, 'bloggerConsoleURL')
  },
  computed: {
    // PublishManagerComputed.js
  },
  created: function () {
    $v[this.name] = this
      
    // 監聽ImageReplacer的改變事件
    EventManager.on($v.ImageReplacer, 'onFilesystemImageCountChange', (ImageReplacer) => {
      this.filesystemImageCount = ImageReplacer.filesystemImageCount
      //console.log(this.filesystemImageCount)
    })
  },
  watch: {
    'bloggerConsoleURL' () {
      $v.ConfigManager.bloggerConsoleURL = this.bloggerConsoleURL
    },
  },
  methods: {
    // PublishManagerMethods.js
  }
}

import PublishManagerMethods from './PublishManagerMethods.js'
PublishManagerMethods(config)

import PublishManagerComputed from './PublishManagerComputed.js'
PublishManagerComputed(config)

export default config