const globalConfig = require('../../config.js')
const localConfig = require('../../config.local.js')

//console.log(globalConfig.default)
ConfigHelper = {
  get: function (key, defaultValue) {
    if (typeof(localConfig.default[key]) !== 'undefined') {
      return localConfig.default[key]
    }
    else if (typeof(globalConfig.default[key]) !== 'undefined') {
      return globalConfig.default[key]
    }
    else {
      return defaultValue
    }
  },
  lang: function () {
    return VueHelper.getLocalStorage('locale', this.get('locale'))
  }
}