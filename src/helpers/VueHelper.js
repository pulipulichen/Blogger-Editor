import Vue from 'vue'

const VueHelper = {
  render: function (selector, component) {
    new Vue({
      el: selector,
      render: h => h(component),
    })
  }
}