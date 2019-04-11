import Vue from 'vue'
import VueI18n from 'vue-i18n'
import i18nGlobal from './../i18n/global.js'

Vue.use(VueI18n)
import $ from 'jquery'

let VueHelper = {
  getLocalStorage: function (key, defaultValue) {
    if (localStorage.getItem(key)) {
      return localStorage.getItem(key)
    }
    else if (defaultValue !== undefined) {
      return defaultValue
    }
  },
  getLocalStorageInt: function (key, defaultValue) {
    if (localStorage.getItem(key)) {
      return parseInt(localStorage.getItem(key), 10)
    }
    else if (defaultValue !== undefined) {
      return parseInt(defaultValue, 10)
    }
  },
  mountLocalStorage: function (vue, key, defaultValue) {
    if (localStorage.getItem(key)) {
      try {
        vue[key] = localStorage.getItem(key);
      } catch(e) {
        localStorage.removeItem(key);
      }
    }
    else if (defaultValue !== undefined) {
      vue[key] = defaultValue
    }
  },
  mountLocalStorageInt: function (vue, key, defaultValue) {
    if (localStorage.getItem(key)) {
      try {
        vue[key] = parseInt(localStorage.getItem(key), 10);
      } catch(e) {
        localStorage.removeItem(key);
      }
    }
    else if (defaultValue !== undefined) {
      vue[key] = parseInt(defaultValue, 10)
    }
  },
  persistLocalStorage: function (vue, key) {
    localStorage[key] = vue[key];
  },
  _vueIdCount: 0,
  _vueContainer: null,
  _i18nConfig: null,
  _getI18nConfig: function () {
    if (this._i18nConfig === null) {
      //let locale = ConfigHelper.get('locale')
      let locale = I18nHelper.locale()
      this._i18nConfig = new VueI18n({
        locale: locale,
        messages: i18nGlobal
      })
    }
    return this._i18nConfig
  },
  init: function (id, sfc, callback) {
    if (typeof(id) === 'object') {
      callback = sfc
      sfc = id
      id = `vue_sfc_${this._vueIdCount}`
      this._vueIdCount++
    }
    
    if (this._vueContainer === null) {
      this._vueContainer = $('<div class="non-invasive-web-style-framework"></div>')
              .appendTo('body')
    }
    
    this._vueContainer.append(`<div id="${id}"></div>`)
    
    if (typeof(callback) === 'function') {
      if (typeof(sfc.created) === 'function') {
        let created = sfc.created
        sfc.created = function () {
          callback(this)
          created.call(this)
        }
      }
      else {
        sfc.created = function () {
          callback(this)
        }
      }
    }
    
    
    
    new Vue({
      el: `#${id}`,
      i18n: this._getI18nConfig(),
      render: h => h(sfc),
    })
  }
}

window.VueHelper = VueHelper
export default VueHelper