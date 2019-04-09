let InitHelper = {
  ready: false,
  onInit: function (callback) {
    //$v.EditorManager.FieldPostBody.cleanFileSystem()
    
    //$v.ImageReplacer.open()

    //WindowHelper.alert('TEST', () => {
    //  alert('OK')
    //})

    //$v.PostManager.open()
    //$v.ThemeManager.open()
    //$v.EditorManager.open()
    //$v.ConfigManager.open()
    
    //setTimeout(function () {
    //  $v.EditorManager.open()
    //}, 3000)
    
    //$v.PageLoader.open()
    FunctionHelper.triggerCallback(callback)
  },
  init: function (callback) {
    $(() => {
      $v.PageLoader.open()
      SemanticUIHelper.initDrop()
      //return 
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
  reload: function (callback) {
    $v.PageLoader.open()
    //return
    $v.EditorManager.save(() => {
      $v.ThemeManager.reload(() => {
        //$summernote = $('#summernotePostBody')
        //$summernote.summernote(summernotePostBodyConfig);

        //$('#summernotePostTitle').summernote(summernotePostTitleConfig);
        //EditorManager.methods.initSummerNote()
        $v.EditorManager.reload(() => {
          //setTimeout(() => {
            $v.PageLoader.close()
            FunctionHelper.triggerCallback(callback)
            //console.log('reload finish')
          //}, 1000)
        })
      })
    })
  }
}

window.InitHelper = InitHelper
export default InitHelper