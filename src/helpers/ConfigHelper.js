const globalConfig = require('../../config/config.js')
const localConfig = require('../../config/config.local.js')

//console.log(globalConfig.default)
let ConfigHelper = {
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
    return VueHelper.getLocalStorage('ConfigManager.locale', this.get('locale'))
  }
}

window.ConfigHelper = ConfigHelper
export default ConfigHelper