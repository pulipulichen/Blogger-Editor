const globalConfig = require('../../config.js')
const localConfig = require('../../config.local.js')

ConfigHelper = {
  get: function (key, defaultValue) {
    if (typeof(localConfig[key]) !== 'undefined') {
      return localConfig[key]
    }
    else if (typeof(globalConfig[key]) !== 'undefined') {
      return globalConfig[key]
    }
    else {
      return defaultValue
    }
  }
}