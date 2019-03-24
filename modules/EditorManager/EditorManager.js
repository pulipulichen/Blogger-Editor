EditorManager = {
  template: `<div>
    <input name="uploadImageDraft" type="text"  data-persist="garlic" />
  </div>`,
  init: function () {
    $(() => {
      $('#editorManagerModal .modal-body').html(this.template)
    })
  }
}

EditorManager.init()