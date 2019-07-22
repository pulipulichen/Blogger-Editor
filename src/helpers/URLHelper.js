let URLHelper = {
  isURL: function (url) {
    return ((url.startsWith("http://") && url.length > 15)
              || (url.startsWith("https://") && url.length > 15)
              || (url.startsWith("//") && url.length > 10)
              || (url.startsWith("#") && url.length > 2))
  }
}

window.URLHelper = URLHelper
export default URLHelper