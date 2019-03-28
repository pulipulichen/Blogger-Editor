$(() => {
  PostManager.methods.init(() => {
    ThemeManager.methods.init(() => {
      //$summernote = $('#summernotePostBody')
      //$summernote.summernote(summernotePostBodyConfig);

      //$('#summernotePostTitle').summernote(summernotePostTitleConfig);
      EditorManager.methods.initSummerNote()
    })
  })
})