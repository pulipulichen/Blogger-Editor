let ElectronHelper = {
  init: function () {
    
  },
  isElectronEnvironment: function () {
    return (typeof(process) === 'object' 
            && typeof(process.versions) === 'object'
            && typeof(process.versions['electron']) === 'string')
  },
  filterProtocol: function (url) {
    if (url.startsWith('//')) {
      if (this.isElectronEnvironment()) {
        return 'http:' + url
      }
      else {
        return url
      }
    }
    else {
      return url
    }
  }
}

window.ElectronHelper = ElectronHelper
export default ElectronHelper