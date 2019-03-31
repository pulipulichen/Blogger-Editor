import Vue from 'vue'
import $ from 'jquery'

export default {
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
  init: function (id, sfc, callback) {
    $('body').append(`<div id="${id}"></div>`)
    
    if (typeof(sfc.created) === 'function') {
      let create = sfc.created
      sfc.created = function () {
        callback(this)
        create()
      }
    }
    else {
      sfc.created = function () {
        callback(this)
      }
    }
    
    new Vue({
      el: `#${id}`,
      render: h => h(sfc)
    })
  }
}