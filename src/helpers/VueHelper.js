
const VueHelper = {
  render: function (selector, vuePath) {
    let component = require(vuePath)
    new Vue({
      el: selector,
      render: h => h(component),
    })
  }
}
module.exports = VueHelper