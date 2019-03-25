PostManager = {
  template: `<div>okok</div>`,
  init: function () {
    $(() => {
      $('#postsManagerModal .modal-body').html(this.template)
    })
  }
}

PostManager.init()