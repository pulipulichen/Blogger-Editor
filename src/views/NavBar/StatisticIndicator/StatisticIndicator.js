let config = {
  data: function () {
    return {
      name: 'StatisticIndicator',
      ui: undefined,
      wordCount: 0,
      imageCount: 0,
      timeSpentSecond: 0,
      lastEditTimestamp: 0
    }
  },
  computed: {

  },
  mounted: function () {
    this.init()
  },
  computed: {
    wordCountUnit: function () {
      if (this.wordCount > 1) {
        return this.$t('words')
      } else {
        return this.$t('word')
      }
    },
    imageCountUnit: function () {
      if (this.wordCount > 1) {
        return this.$t('pictures')
      } else {
        return this.$t('picture')
      }
    },
    timeSpentDisplay: function () {
      return DayjsHelper.timeSpentDisplay(this.timeSpentSecond)
    }
  },
  created: function () {
    $v[this.name] = this
  },
  methods: {
    // ---------------------
    // Methods of Modal
    // ---------------------

    getUI: function () {
      if (typeof (this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    },
    open: function () {
      this.getUI().fadeIn()
    },
    close: function () {
      this.getUI().fadeOut()
    },
    persist() {
      //VueHelper.persistLocalStorage(this, 'summerNoteConfigStyleTags')
    },

    init(callback) {
      EventManager.on($v.EditorManager.FieldPostBody, ['set', 'change'], (FieldPostBody) => {
        this.updateWordImageCount(FieldPostBody)
        this.updateTimeSpent()
        
        this.getUI().fadeIn()
      })
      
      EventManager.on($v.EditorManager.FieldPostBody, ['beforechange'], (FieldPostBody) => {
        this.getUI().fadeOut()
      })
      
      FunctionHelper.triggerCallback(callback)
    },
    updateWordImageCount: function (FieldPostBody) {
      //console.log('aaa')
      let text = FieldPostBody.getText()
      text = text.replace(/[^\x20-\x7E]/gmi, "")
      text = text.split(' ').join('')
      this.wordCount = text.length
      //console.log(this.wordCount)
      //

      this.imageCount = FieldPostBody.countImage()
    },
    updateTimeSpent: function () {
      let currentEditTimestamp = (new Date()).getTime()
      
      let intervalSecond = Math.round((currentEditTimestamp - this.lastEditTimestamp) / 1000)
      if (intervalSecond > 60) {
        intervalSecond = 60
      }
      
      let post = $v.PostManager.getPost()
      post.timeSpentSecond = post.timeSpentSecond + intervalSecond
      this.timeSpentSecond = post.timeSpentSecond
      $v.PostManager.updateEditingPost('timeSpentSecond', this.timeSpentSecond)
      
      this.lastEditTimestamp = currentEditTimestamp
    },
  }
}

export default config