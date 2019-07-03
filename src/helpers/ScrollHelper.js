let ScrollHelper = {
  key: 'ScrollHelper.position',
  window: null,
  save: function () {
    this.init()
    let top = this.window.scrollTop()
    localStorage.setItem(this.key, top)
  },
  load: function () {
    this.init()
    let top = localStorage.getItem(this.key)
    if (top === undefined) {
      return
    }
    top = parseInt(top, 10)
    this.window.scrollTop(top)
  },
  init: function () {
    if (this.window === null) {
      this.window = $(window)
      
      let save = () => {
        DelayExecHelper.backExec(this.key, 1, 10, () => {
          this.save()
        })
      }
      
      this.window.scroll(() => {
        save()
      })
    }
  }
}

window.ScrollHelper = ScrollHelper
export default ScrollHelper