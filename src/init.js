let init = () => {
  //$v.ImageReplacer.open()
}

$(() => {
  $v.BrowserDetector.init(() => {
    FileSystemHelper.init(() => {
      $v.PostManager.init(() => {
        $v.ThemeManager.init(() => {
          //$summernote = $('#summernotePostBody')
          //$summernote.summernote(summernotePostBodyConfig);

          //$('#summernotePostTitle').summernote(summernotePostTitleConfig);
          //EditorManager.methods.initSummerNote()
          $v.EditorManager.init(() => {
            init()
          })
        })
      })
    })
  })
})