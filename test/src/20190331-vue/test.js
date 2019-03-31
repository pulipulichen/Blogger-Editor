import aVue from './a.vue'
import VueHelper from './VueHelper.js'

export default {
  exec: function () {
    VueHelper.init('a', aVue, (a) => {
      console.log(a)
      a.add()
    })
  }
}