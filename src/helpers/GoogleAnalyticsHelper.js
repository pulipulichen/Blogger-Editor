let GoogleAnalyticsHelper = {
  //trackingId: null, // UA-37178375-10
  trackingId: 'UA-37178375-10',
  init: function (callback) {
    FunctionHelper.triggerCallback(callback)
  },
  send: function (event) {
    this.init(() => {
      console.log('#TODO')
    })
  }
}

window.GoogleAnalyticsHelper = GoogleAnalyticsHelper
export default GoogleAnalyticsHelper
