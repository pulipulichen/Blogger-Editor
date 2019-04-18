let ScrollHelper = {
  key: 'ScrollHelper.position',
  window: null,
  save: function () {
    if (this.window === null) {
      this.window = $(window)
    }
    let top = this.window.scrollTop()
    localStorage.setItem(this.key, top)
  },
  load: function () {
    if (this.window === null) {
      this.window = $(window)
    }
    let top = localStorage.getItem(this.key)
    if (top === undefined) {
      return
    }
    top = parseInt(top, 10)
    this.window.scrollTop(top)
  }
}

window.ScrollHelper = ScrollHelper
export default ScrollHelper