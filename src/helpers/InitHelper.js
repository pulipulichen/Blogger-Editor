let InitHelper = {
  ready: false,
  onInit: function (callback) {
    //$v.ImageReplacer.open()

    //$v.EditorManager.open()
    FunctionHelper.triggerCallback(callback)
  },
  init: function (callback) {
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
                
                this.ready = true

                setTimeout(() => {
                  this.onInit(callback)
                }, 1000)
              })
            })
          })
        })
      })
    })
  },
}

window.InitHelper = InitHelper
export default InitHelper