let init = () => {
  //$v.ImageReplacer.open()

  $v.EditorManager.open()
}

$(() => {
  $v.PageLoader.open()
  $v.BrowserDetector.init(() => {
    FileSystemHelper.init(() => {
      $v.PostManager.init(() => {
        $v.ThemeManager.init(() => {
          //$summernote = $('#summernotePostBody')
          //$summernote.summernote(summernotePostBodyConfig);

          //$('#summernotePostTitle').summernote(summernotePostTitleConfig);
          //EditorManager.methods.initSummerNote()
          $v.EditorManager.init(() => {
            $v.PageLoader.close()
            
            setTimeout(() => {
              init()
            }, 1000)
          })
        })
      })
    })
  })
})