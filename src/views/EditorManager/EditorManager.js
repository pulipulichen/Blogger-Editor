/*
EditorManager = {
  template: `
  <div class="form-group">
    <label for="uploadImageDraft">Upload Image Draft</label>
    <input name="uploadImageDraft" type="text" 
      data-persist="garlic"
      class="form-control" 
      id="uploadImageDraft" aria-describedby="emailHelp" 
      placeholder="https://www.blogger.com/blogger.g?blogID=..." />
    <a href="https://www.blogger.com" target="bloggerManager">
      <small class="form-text text-muted">Open Blogger console</small>
    </a>
  </div>`,
  init: function () {
    $(() => {
      $('#editorManagerModal .modal-body').html(this.template)
    })
  }
}

EditorManager.init()
*/

let config = {
  //name: "main-content",
  data: () => ({
      // reactive data property of the component.
      //webpack: 'Powered by webpack! is it work?',
    }),
}

export default config