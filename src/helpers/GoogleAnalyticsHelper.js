const uuidv4 = require('uuid/v4');

let GoogleAnalyticsHelper = {
  trackingId: null, // UA-37178375-10
  //trackingId: 'UA-37178375-10',
  uuid: null,
  resetUUID: true,
  init: function (callback) {
    let trackingId = $v.ConfigManager.googleAnalyticsTrackingId.trim()
    if (trackingId !== this.trackingId) {
      //var customUserId = "USER_ID"; // 輸入系統的使用者ID

      // 標準的Google分析追蹤程式碼
      /*
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      */

      ga('create', trackingId) // 如果有開啟User-ID功能
      //ga('require', 'displayfeatures');
      //ga('set', 'dimension1', customUserId); // 加入自訂維度customUserId
      ga('send', 'pageview')
      this.trackingId = trackingId
      
      this.initUUID()
    }
    
    this.databaseCreateTable(() => {
      if (this.trackingId.startsWith('UA-')) {
        FunctionHelper.triggerCallback(callback)
      }
    })
  },
  databaseCreateTable: function (callback) {
    let sqlCreateTable = `Create Table if not exists eventTrack
          (id INTEGER PRIMARY KEY, 
           unix INTEGER, 
           uuid TEXT, 
           postID INTEGER, 
           category TEXT,
           action TEXT)`
    WebSQLDatabaseHelper.exec(sqlCreateTable,callback)
    return this
  },
  databaseReset: function (callback) {
    //let sql = `DELETE FROM eventTrack`
    let sql = `DROP TABLE eventTrack`
    WebSQLDatabaseHelper.exec(sql,callback)
    return this
  },
  databaseInsert: function (category, action, callback) {
    let sql = `insert into 
            eventTrack(unix, uuid, postId, category, action) 
            values(?,?,?,?,?)`
    
    if (typeof(category) !== 'string') {
      category = JSON.stringify(category)
    }
    if (typeof(action) !== 'string') {
      action = JSON.stringify(action)
    }
    
    let unix = DayjsHelper.unix()
    let data = [
      unix,
      this.uuid,
      $v.PostManager.editingPostId,
      category,
      action
    ]
    WebSQLDatabaseHelper.exec(sql, data,callback)
    return this
  },
  getDayLimitWhere: function (dayLimit) {
    if (typeof(dayLimit) === 'string') {
      if (dayLimit.indexOf('.') > -1) {
        eval(`dayLimit = ${dayLimit}`)
      }
      else {
        dayLimit = parseInt(dayLimit, 10)
      }
    }
    if (typeof(dayLimit) === 'number') {
      let unix = DayjsHelper.unix()
      let unixLimit = unix - (dayLimit * 1000 * 60 * 24)
      return `unix > ${unixLimit}`
    }
  },
  databaseSelect: function (dayLimit, callback) {
    if (typeof(dayLimit) === 'function') {
      callback = dayLimit
      dayLimit = undefined
    }
    
    if (typeof(callback) !== 'function') {
      return
    }
    
    let sql = `select uuid, unix, category, action from eventTrack`
    let unixLimitWhere = this.getDayLimitWhere(dayLimit)
    
    if (unixLimitWhere !== undefined) {
      sql = sql + ` where ${unixLimitWhere} and postId = ${$v.PostManager.editingPostId}`
    }
    else {
      sql = sql + ` where postId = ${$v.PostManager.editingPostId}`
    }
    
    //console.log(sql)
    WebSQLDatabaseHelper.exec(sql, callback)
    return this
  },
  databaseSelectProduction: function (dayLimit, callback) {
    if (typeof(dayLimit) === 'function') {
      callback = dayLimit
      dayLimit = undefined
    }
    
    if (typeof(callback) !== 'function') {
      return
    }
    
    let sql = `select uuid, unix, postId, category, action from eventTrack`
    let unixLimitWhere = this.getDayLimitWhere(dayLimit)
    
    if (unixLimitWhere !== undefined) {
      sql = sql + ` where ${unixLimitWhere} and category = 'FieldPostBody.onChange' and postId = ${$v.PostManager.editingPostId}`
    }
    else {
      sql = sql + ` where category = 'FieldPostBody.onChange' and postId = ${$v.PostManager.editingPostId}`
    }
    
    //console.log(sql)
    WebSQLDatabaseHelper.exec(sql, callback)
    return this
  },
  databaseSelectStrength: function (dayLimit, callback) {
    if (typeof(dayLimit) === 'function') {
      callback = dayLimit
      dayLimit = undefined
    }
    
    if (typeof(callback) !== 'function') {
      return
    }
    
    let sql = `select DISTINCT unix from eventTrack`
    let unixLimitWhere = this.getDayLimitWhere(dayLimit)
    
    if (unixLimitWhere !== undefined) {
      sql = sql + ` where ${unixLimitWhere} and postId = ${$v.PostManager.editingPostId}`
    }
    else {
      sql = sql + ` where postId = ${$v.PostManager.editingPostId}`
    }
    
    //console.log(sql)
    WebSQLDatabaseHelper.exec(sql, callback)
    return this
  },
  initUUID: function () {
    if (this.uuid === null) {
      if (this.resetUUID === false) {
        this.uuid = localStorage.getItem('GoogleAnalyticsHelper.uuid')
        if (this.uuid === null) {
          this.uuid = uuidv4() + '-' + DayjsHelper.nowFormat()
          localStorage.setItem('GoogleAnalyticsHelper.uuid', this.uuid)
        }
      }
      else {
        this.uuid = uuidv4() + '-' + DayjsHelper.nowFormat()
      }
    }
    
  },
  /**
   * 
   * @param {String} eventCategory
   * @param {String} eventAction
   * @param {String} eventLabel 可省略
   * @param {type} eventValue
   * @returns {undefined}
   */
  send: function (eventCategory, eventAction) {
    this.init(() => {
      this.databaseInsert(eventCategory, eventAction)
      eventAction = this.filterEventValue(eventCategory, eventAction)
      
      let data = {
        eventCategory: this.uuid,
        eventAction: eventAction
      }
      //console.log(data)
      ga('send', 'event', data);
    })
  },
  filterEventValue: function (eventCategory, eventValue) {
    if (eventValue === undefined || eventValue === null) {
      eventValue = ''
    }
    else if (typeof(eventValue) === 'object') {
      eventValue = JSON.stringify(eventValue)
    }
    
    // 加上時間
    eventValue = [
      //this.uuid,
      DayjsHelper.nowHHMMSSFormat(),
      eventCategory,
      eventValue
    ].join('→')
    
    return eventValue
  }
}

window.GoogleAnalyticsHelper = GoogleAnalyticsHelper
export default GoogleAnalyticsHelper
