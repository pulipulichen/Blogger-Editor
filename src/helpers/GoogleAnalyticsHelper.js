const uuidv4 = require('uuid/v4');

let GoogleAnalyticsHelper = {
  trackingId: null, // UA-37178375-10
  //trackingId: 'UA-37178375-10',
  uuid: null,
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
    if (this.trackingId.startsWith('UA-')) {
      FunctionHelper.triggerCallback(callback)
    }
  },
  initUUID: function () {
    if (this.uuid === null) {
      this.uuid = uuidv4()
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
      
      eventAction = this.filterEventValue(eventAction)
      
      let data = {
        eventCategory: eventCategory,
        eventAction: eventAction
      }
      console.log(data)
      ga('send', 'event', data);
    })
  },
  filterEventValue: function (eventValue) {
    if (typeof(eventValue) === 'object') {
      eventValue = JSON.stringify(eventValue)
    }
    
    // 加上時間
    eventValue = [
      this.uuid,
      DayjsHelper.nowFormat(),
      eventValue
    ].join('→')
    
    return eventValue
  }
}

window.GoogleAnalyticsHelper = GoogleAnalyticsHelper
export default GoogleAnalyticsHelper
