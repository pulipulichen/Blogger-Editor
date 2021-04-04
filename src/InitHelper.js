/* global EventManager, FunctionHelper, SemanticUIHelper, WebSQLDatabaseHelper, FileSystemHelper, ScrollHelper, DelayExecHelper */

let InitHelper = {
  ready: false,
  onInit: function (callback) {
    //$v.EditorManager.FieldPostBody.cleanFileSystem()
    //$v.EditorManager.FieldPostBody.activateCodeView()
    
    //$v.EditorManager.ImageReplacer.open()

    //WindowHelper.alert('TEST', () => {
    //  alert('OK')
    //})

    /*
    $v.PostManager.open()
    setTimeout(() => {
      $v.PostManager.clonePost(1, () => {
        setTimeout(() => {
          $v.PostManager.close()
        }, 3000)
      })
    }, 3000)
    */
    //$v.PublishManager.open()
    //$v.PostManager.open()
    //$v.ThemeManager.open()
    //$v.EditorManager.open()
    //$v.ConfigManager.open()
    
    
    //$v.IframePrompt.open()
    //$v.FileUploader.open()
    //$v.ThemeManager.TemplateBuilder.open()
    //$v.CodeInserter.open()
    //$v.OutlineNavigator.open()
    //$v.SnippetInserter.open()
    //$v.ImageReplacer.open()
    
    //$v.PageLoader.open()
    //$v.NavBarSidebar.open()
    //$v.GoogleDocLinkBuilder.open()
    //WindowHelper.popup('http://blog.pulipuli.info/')
    
    //console.log($('#summernotePostBody').summernote('editor.copyRichFormatHTML'))
    // $('#summernotePostBody').summernote('editor.getSelectedNodeAndRemove')
    // $('#summernotePostLabels').summernote('hintPopover.addItem', 'aaa')
    // $('#summernotePostBody').summernote('editor.insertIframe', 'http://blog.pulipuli.info/')
    
    //console.clear()
    
    EventManager.trigger(this, 'initFinish')
    FunctionHelper.triggerCallback(callback)
  },
  init: function (callback) {
    $(() => {
      //return 
      
      let initQueue = [
        //(next) => {
        //  ElectronHelper.init()
        //  next()
        //},
        (next) => {
          $v.PageLoader.open()
          SemanticUIHelper.initDrop()
          next()
        },
        (next) => {
          WebSQLDatabaseHelper.init(next)
        },
        (next) => {
          $v.NavBar.init(next)
        },
        (next) => {
          $v.StatisticIndicator.init(next)
        },
        (next) => {
          $v.BrowserDetector.init(next)
        },
        (next) => {
          FileSystemHelper.init(next)
        },
        (next) => {
          $v.PostManager.init(next)
        },
        (next) => {
          $v.ThemeManager.init(next)
        },
        (next) => {
          $v.EditorManager.init(next)
        },
        (next) => {
          DelayExecHelper.init()
          next()
        },
        (next) => {
          ScrollHelper.load()
          next()
        }
      ]
      
      let loop = (i) => {
        if (i < initQueue.length) {
          //console.log(i)
          let init = initQueue[i]
          init(() => {
            i++
            loop(i)
          })
        }
        else {
          setTimeout(() => {
            $v.PageLoader.close()
            this.ready = true
            this.onInit(callback)
          }, 1000)
        }
      }
      loop(0)
      
      /*
      $v.BrowserDetector.init(() => {
        FileSystemHelper.init(() => {
          $v.PostManager.init(() => {
            $v.ThemeManager.init(() => {
              //$summernote = $('#summernotePostBody')
              //$summernote.summernote(summernotePostBodyConfig);

              //$('#summernotePostTitle').summernote(summernotePostTitleConfig);
              //EditorManager.methods.initSummerNote()
              $v.EditorManager.init(() => {
                //$v.PublishManager.init(() => {

                  setTimeout(() => {
                    $v.PageLoader.close()
                    this.ready = true
                    this.onInit(callback)
                  }, 1000)
                //})
              })
            })
          })
        })
      })
      */
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
            //$v.PublishManager.init(() => {
              $v.PageLoader.close()
              FunctionHelper.triggerCallback(callback)
            //})
            //console.log('reload finish')
          //}, 1000)
        })
      })
    })
  }
}

window.InitHelper = InitHelper
export default InitHelper