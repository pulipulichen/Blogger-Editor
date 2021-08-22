/* global SemanticUIHelper, WindowHelper, DelayExecHelper */

import SummerNoteHelper from './SummerNoteHelper.js'
import SummerNoteCode from './SummerNoteCode.js'
import SummerNoteImage from './SummerNoteImage.js'

let SummerNoteOpen = {
  // -------------------------
  // model buttons
  // -------------------------
  
  
  IframePrompt: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="plus square outline icon"></i>` + $t('Iframe'))
    let tooltip = $t('Insert iframe')
    let click = () => {
      $v.IframePrompt.open()
    }
    return SummerNoteHelper.buildButton('IframePrompt', contents, tooltip, click, doRender)
  },
  FileUploader: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="upload icon"></i>` + $t('Upload File') )
    let tooltip = $t('Upload file and insert links')
    let click = () => {
      $v.FileUploader.open()
    }
    return SummerNoteHelper.buildButton('FileUploader', contents, tooltip, click, doRender)
  },
  CodeInserter: function ($t, context, doRender) {
    //let contents = SemanticUIHelper.wrapNIWSF(`<i class="code icon"></i>` + $t('Code'))
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="code icon"></i>`)
    let tooltip = $t('Insert Code')
    let click = () => {
      $v.CodeInserter.open()
    }
    return SummerNoteHelper.buildButton('CodeInserter', contents, tooltip, click, doRender)
  },
  CodeInserterOption: function ($t, context, doRender) {
    //let contents = SemanticUIHelper.wrapNIWSF(`<i class="code icon"></i>` + $t('Code'))
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="code icon"></i>` + $t('Code'))
    let tooltip = $t('Insert Code')
    let click = () => {
      $v.CodeInserter.open()
    }
    return SummerNoteHelper.buildButton('CodeInserterOption', contents, tooltip, click, doRender)
  },
  OutlineNavigator: function ($t, context, doRender) {
    //let contents = SemanticUIHelper.wrapNIWSF(`<i class="sitemap icon"></i>` + $t('Outline') )
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="sitemap icon"></i>` )
    let tooltip = $t('Outline Navigation')
    let click = () => {
      $v.OutlineNavigator.toggle()
    }
    return SummerNoteHelper.buildButton('OutlineNavigator', contents, tooltip, click, doRender)
  },
  SnippetInserter: function ($t, context, doRender) {
    //console.trace(doRender)
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="quote left icon"></i>` + $t('Snippet'))
    let tooltip = $t('Insert Snippet')
    let click = () => {
      $v.SnippetInserter.open()
    }
    return SummerNoteHelper.buildButton('SnippetInserter', contents, tooltip, click, doRender)
  },
  GoogleDocsLinkBuilder: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="google icon"></i>` + $t('Google Docs Links'))
    let tooltip = $t('Open Google Docs Links Builder')
    let click = () => {
      $v.GoogleDocLinkBuilder.open()
    }
    return SummerNoteHelper.buildButton('GoogleDocsLinkBuilder', contents, tooltip, click, doRender)
  },
  OneDriveLinkBuilder: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="linkify icon"></i>` + $t('OneDrive Links'))
    let tooltip = $t('Open OneDrive Link Builder')
    let click = () => {
      WindowHelper.forcePopup('https://blog.pulipuli.info/2019/02/onedrive-onedrive-file-download-link.html#postcataonedrive-onedrive-file-download-link.html0_anchor3', 'OneDriveDownload')
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click, doRender)
  },
  GooglePhoto: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="image icon"></i>` + $t('Google Photo') )
    let tooltip = $t('Open Google Photo')
    let click = () => {
      WindowHelper.forcePopup('https://photos.google.com/?hl=zh-TW', 'googlePhoto')
    }
    return SummerNoteHelper.buildButton('GooglePhoto', contents, tooltip, click, doRender)
  },
  PhotoRepository: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="image icon"></i>` + $t('Photo Repository') )
    let tooltip = $t('Open Photo Repository')
    let click = () => {
      WindowHelper.forcePopup($v.EditorManager.PhotoRepository, 'photo-repository-draft')
    }
    return SummerNoteHelper.buildButton('GooglePhoto', contents, tooltip, click, doRender)
  },
  insertHR: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="note-icon-minus icon"></i>` + $t('Horizontal Rule') )
    let tooltip = $t('Horizontal Rule')
    let click = () => {
      //$v.EditorManager.FieldPostBody.summernote('iframeDialog.show')
      $v.EditorManager.FieldPostBody.get().summernote('insertHorizontalRule')
    }
    return SummerNoteHelper.buildButton('insertHorizontalRule', contents, tooltip, click, doRender)
  },
  
  insertVideo: function ($t, context, doRender) {
    //let contents = '<div><i class="note-icon-video"></i> 影片</div>'
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="note-icon-video icon"></i>` + $t('Video'))
    let tooltip = $t('Video')
    let click = () => {
      //$v.EditorManager.FieldPostBody.summernote('iframeDialog.show')
      $v.EditorManager.FieldPostBody.get().summernote('videoDialog.show')
    }
    return SummerNoteHelper.buildButton('insertVideo', contents, tooltip, click, doRender)
  },
  
  insertTable: function ($t, context, doRender) {
    let ui = $.summernote.ui
    let options = $.summernote.options
    
    let result = ui.buttonGroup([
        ui.button({
            className: 'dropdown-toggle',
            //contents: ui.dropdownButtonContents( '<i class="note-icon-table icon"></i>' +  $t('Table'), options),
            contents: ui.dropdownButtonContents( '<i class="note-icon-table icon"></i>', options),
            tooltip: $t('Inser Table'),
            data: {
                toggle: 'dropdown'
            }
        }),
        ui.dropdown({
            title: $t('Table'),
            className: 'note-table',
            items: [
                '<div class="note-dimension-picker">',
                '  <div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"/>',
                '  <div class="note-dimension-picker-highlighted"/>',
                '  <div class="note-dimension-picker-unhighlighted"/>',
                '</div>',
                '<div class="note-dimension-display">1 x 1</div>'
            ].join('')
        })
    ], {
        callback: function ($node) {
            var $catcher = $node.find('.note-dimension-picker-mousecatcher');
            let mousecatcher
            $catcher.css({
                width: 10 + 'em',
                height: 10 + 'em'
            }).mousedown(function () {
              //let dim = $(this).attr('data-value')
              //console.log(this)
              if (mousecatcher === undefined) {
                mousecatcher = $('.note-dimension-picker-mousecatcher:visible')
              }
              
              let dim = mousecatcher.parent().next().text() //.attr('data-value')
              //console.log(dim)
              
              $v.EditorManager.FieldPostBody.get().summernote('editor.insertTable', dim)
            })
              .mousemove(function (event) {
              $v.EditorManager.FieldPostBody.get().summernote('buttons.tableMoveHandler', event)
            })
                //.mousedown(_this.context.createInvokeHandler('editor.insertTable'))
                //.on('mousemove', $.summernote.module.buttons.tableMoveHandler.bind(_this));
            //$v.EditorManager.FieldPostBody.get().summernote('buttons.insertTableCallback', $node)
        }
    })
    
    if (doRender !== true || doRender === undefined) {
      result.render()
    }
    return result
  },
  
  insertIframe: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="linkify icon"></i>` + $t('Iframe'))
    let tooltip = $t('Insert iframe')
    let click = () => {
      //$v.EditorManager.FieldPostBody.summernote('iframeDialog.show')
      $v.EditorManager.FieldPostBody.get().summernote('iframeDialog.show')
    }
    return SummerNoteHelper.buildButton('insertIframe', contents, tooltip, click, doRender)
  },
  
  DelayForceExec: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="save icon"></i>` + $t('Save'))
    let tooltip = $t('Save')
    let click = (event) => {
      //console.trace(event)
      //$v.EditorManager.FieldPostBody.summernote('iframeDialog.show')
      $v.EditorManager.SaveIndicator.save()
      //event.stopPropagation()
      //event.preventDefault()
      //return false
    }
    return SummerNoteHelper.buildButton('DelayForceExec', contents, tooltip, click, doRender)
  },
  
  ReloadPage: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="redo icon"></i>` + $t('Reload'))
    let tooltip = $t('Reload')
    let click = () => {
      DelayExecHelper.forceExec(() => {
        location.reload()
      })
    }
    return SummerNoteHelper.buildButton('ReloadPage', contents, tooltip, click, doRender)
  },
  
  // -----------------------------
  // Others
  // -----------------------------
  
  transSelected: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="language icon"></i>` + $t('Trans'))
    let tooltip = $t('Translate Selected')
    let click = () => {
      let text = $v.EditorManager.FieldPostBody.getSelectText()
      text = encodeURI(text)
      let url = `https://translate.google.com/#view=home&op=translate&sl=auto&tl=auto&text=${text}`
      WindowHelper.popup(url)
    }
    return SummerNoteHelper.buildButton('transSelected', contents, tooltip, click, doRender)
  },
  
  toggleMenu: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="bars icon"></i>`)
    let tooltip = $t('Toggle Menu')
    let click = () => {
      $v.NavBar.toggle()
    }
    return SummerNoteHelper.buildButton('toggleMenu', contents, tooltip, click, doRender)
  },
  
  downloadImageTemplate: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="image icon"></i> Cover Template`)
    let tooltip = 'Download Cover Template'
    let click = () => {
      SummerNoteImage.downloadImageTamplateClick()
    }
    return SummerNoteHelper.buildButton('downloadImageTemplate', contents, tooltip, click, doRender)
  },
  
  // ------------------------------------
  insertGroup: function ($t, c) {
    return SummerNoteHelper.buildDropdownButtonsGroup(c, $t('Insert'), $t('Insert Tools'), [
      this.SnippetInserter($t, c, false),
      SummerNoteCode.insertMore($t, c, false),
      //this.insertTable($t, c, false),
      this.transSelected($t, c, false),
      this.PhotoRepository($t, c, false),
      this.insertHR($t, c, false),
      this.CodeInserterOption($t, c, false),
      this.insertIframe($t, c, false),
      this.insertVideo($t, c, false),
      //this.CodeInserter(c, false),
      this.FileUploader($t, c, false),
      this.GoogleDocsLinkBuilder($t, c, false),
      this.OneDriveLinkBuilder($t, c, false),
    ])
  },
  
  formatGroup: function ($t, c) {
    return SummerNoteHelper.buildDropdownButtonsGroup(c, $t('Format'), $t('Format Tools'), [
      SummerNoteImage.downloadImageTamplate($t, c, false),
      SummerNoteImage.downloadAnnotationTamplate($t, c, false),
      //this.GooglePhoto($t, c, false),
      //this.PhotoRepository($t, c, false),
      SummerNoteImage.ImageReplacer($t, c, false),
      SummerNoteCode.CopyCode($t, c, false),
      SummerNoteCode.CleanCode($t, c, false),
      SummerNoteImage.imageSizeOriginal($t, c, false),
      SummerNoteImage.imageSizeThumbnail($t, c, false),
    ])
  }
}

export default SummerNoteOpen