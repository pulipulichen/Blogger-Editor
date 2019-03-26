import Vue from 'vue'

//import VueHelper from './helpers/VueHelper.js'
//let VueHelper = require('./helpers/VueHelper.js')
//require('./helpers/VueHelper.js')
//VueHelper.render('#NavBar', require('./views/NavBar/NavBar.vue'))
import NavBar from './views/NavBar/NavBar.vue'
  //import NavBar from './views/NavBar/NavBar.vue'
  new Vue({
    el: "#NavBar",
    render: h => h(NavBar),
  })


import EditorManager from './views/EditorManager/EditorManager.vue'

new Vue({
  el: "#EditorManager",
  render: h => h(EditorManager),
})