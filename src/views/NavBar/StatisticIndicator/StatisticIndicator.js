/* global DayjsHelper, EventManager, FunctionHelper, InitHelper */

let config = {
  data: function () {
    return {
      name: 'StatisticIndicator',
      ui: undefined,
      wordCount: 0,
      imageCount: 0,
      tableCount: 0,
      iframeCount: 0,
      timeSpentSecond: 0,
      lastEditTimestamp: 0,
      updateTimeSpentLock: false,
    }
  },
  /*
  computed: {

  },
  */
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
    titleWordCount: function () {
      return this.wordCount + ' ' + this.wordCountUnit
    },
    imageCountUnit: function () {
      if (this.imageCount > 1) {
        return this.$t('pictures')
      } else {
        return this.$t('picture')
      }
    },
    tableCountUnit: function () {
      if (this.tableCount > 1) {
        return this.$t('tables')
      } else {
        return this.$t('table')
      }
    },
    iframeCountUnit: function () {
      if (this.iframeCount > 1) {
        return this.$t('iframes')
      } else {
        return this.$t('iframe')
      }
    },
    titleImageCount: function () {
      return this.imageCount + ' ' + this.imageCountUnit
    },
    titleTableCount: function () {
      return this.tableCount + ' ' + this.tableCountUnit
    },
    titleIframeCount: function () {
      return this.iframeCount + ' ' + this.iframeCountUnit
    },
    timeSpentDisplay: function () {
      return DayjsHelper.timeSpentDisplay(this.timeSpentSecond)
    },
    timeSpentTitle: function () {
      let display = DayjsHelper.timeSpentDisplay(this.timeSpentSecond).split(':')
      
      let hour = parseInt(display[0], 10)
      let minute = parseInt(display[1], 10)
      let data = {
        'hour': hour,
        'minute': minute
      }
      let totalMinutes = hour * 60 + minute
      let key = 'Total spent time is {hour} hours and {minute} minutes'
      if (hour === 0) {
        if (minute > 1) {
          key = 'Total spent time is {minute} minutes'
        }
        else {
          key = 'Total spent time is {minute} minute'
        }
      }
      else {
        if (hour > 1) {
          if (minute > 1) {
            key = 'Total spent time is {hour} hours and {minute} minutes'
          }
          else {
            key = 'Total spent time is {hour} hours and {minute} minute'
          }
        }
        else {
          if (minute > 1) {
            key = 'Total spent time is {hour} hour and {minute} minutes'
          }
          else {
            key = 'Total spent time is {hour} hour and {minute} minute'
          }
        }
      }
      return this.$tc(key, totalMinutes, data)
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
      //this.getUI().fadeIn()
      this.getUI().show()
    },
    close: function () {
      //this.getUI().fadeOut()
      this.getUI().hide()
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
      this.wordCount = FieldPostBody.getTextCount()
      this.imageCount = FieldPostBody.countImage()
      this.tableCount = FieldPostBody.countTable()
      this.iframeCount = FieldPostBody.countIframe()
    },
    updateTimeSpent: function () {
      if (InitHelper.ready === false) {
        let post = $v.PostManager.getPost()
        this.timeSpentSecond = post.timeSpentSecond
        return this
      }
      
      if (this.updateTimeSpentLock === true) {
        return this
      }
      this.updateTimeSpentLock = true
      
      let currentEditTimestamp = (new Date()).getTime()
      
      let intervalSecond = Math.round((currentEditTimestamp - this.lastEditTimestamp) / 1000)
      if (intervalSecond > 60) {
        intervalSecond = 60
      }
      
      let post = $v.PostManager.getPost()
      if (post !== undefined) {
        //console.log(['開始累加時間', post.id, post.timeSpentSecond, intervalSecond, (post.timeSpentSecond + intervalSecond)])
        post.timeSpentSecond = post.timeSpentSecond + intervalSecond
        this.timeSpentSecond = post.timeSpentSecond
      }
      else {
        this.timeSpentSecond = 0
      }
      
      $v.PostManager.updateEditingPost('timeSpentSecond', this.timeSpentSecond, () => {
        
        this.lastEditTimestamp = currentEditTimestamp
        setTimeout(() => {
          this.updateTimeSpentLock = false
        }, 1000)
      })
    },
  }
}

export default config