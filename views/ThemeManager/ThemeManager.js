ThemeManager = {
  template: `<div>ThemeManager</div>`,
  init: function () {
    $(() => {
      $('#themeManagerModal .modal-body').html(this.template)
    })
  }
}

ThemeManager.init()