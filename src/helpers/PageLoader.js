let PageLoader = {
  content: `<div class="ui page dimmer" id="PageLoader">
  <div class="content">
    Hello
  </div>
</div>`,
  ui: null,
  init: function () {
    if ($('#PageLoader').length === 0) {
      this.ui = $(this.content)
      $('body').append(this.ui)
      //this.ui = $('body')
    }
  },
  open: function () {
    this.init()
    this.ui.dimmer('show');
  },
  close: function () {
    this.init()
    this.ui.dimmer('hide');
  }
}
window.PageLoader = PageLoader
export default PageLoader