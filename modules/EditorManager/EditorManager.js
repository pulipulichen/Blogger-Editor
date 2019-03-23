EditorManager = {
  template: `<div>editor manager</div>`,
  init: function () {
    $(() => {
      $('#editorManagerModal .modal-body').html(this.template)
    })
  }
}

EditorManager.init()