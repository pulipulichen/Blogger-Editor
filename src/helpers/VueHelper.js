import Vue from 'vue'
import $ from 'jquery'

let VueHelper = {
  mountLocalStorage: function (vue, key) {
    if (localStorage.getItem(key)) {
      try {
        vue[key] = localStorage.getItem(key);
      } catch(e) {
        localStorage.removeItem(key);
      }
    }
  },
  persistLocalStorage: function (vue, key) {
    localStorage[key] = vue[key];
  },
  _vueIdCount: 0,
  init: function (id, sfc, callback) {
    if (typeof(id) === 'object') {
      callback = sfc
      sfc = id
      id = `vue_sfc_${this._vueIdCount}`
      this._vueIdCount++
    }
    
    $('body').append(`<div id="${id}"></div>`)
    
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
      render: h => h(sfc),
    })
  }
}

window.VueHelper = VueHelper
export default VueHelper