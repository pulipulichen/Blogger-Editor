import Vue from 'vue'

import PostManagerComponent from './views/PostManager/PostManager.vue'
window.PostManagerG = new Vue({
  el: "#PostManager",
  render: h => h(PostManagerComponent),
})