import SummerNoteButtons from './SummerNoteButtons.js'
import SummerNoteCallbacks from './SummerNoteCallbacks.js'

let SummerNoteConfig = {
  toolbar: function () {
    let toolbar = [
        ['view', ['codeview']],
        ['style', ['style']],
        ['font', ['undo', 'bold', 'underline', 'clear']],
        //['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['hr', 'link', 'picture', 'video']],
        ['imageResize', ['imageSizeOriginal', 'imageSizeDefault']],
        ['mybutton', ['copyHTML', 'imageReplacer']],
        ['help', [/*'fullscreen',*/ 'help']]
      ]

    return toolbar
  },
  styleTags: function () {
    let styleTags = ['p', 'code', 'h4', 'h5', 'h6']
    //let styleTags = [
    //  this.buildButtonCopyCode()
    //]

    return styleTags
  },
  popoverImage: function () {
    return [
      //['imagesize', ['copyHTML', 'imageSize100', 'imageSize50', 'imageSize25']],
      //['float', ['floatLeft', 'floatRight', 'floatNone']],
      ['imagesize', ['popoverImageSizeOriginal', 'popoverImageSizeDefault']],
      ['remove', ['removeMedia']]
    ]
  },
  popoverLink: function () {
    return [
      ['link', ['linkDialogShow', 'unlink']]
    ]
  },
  popoverAir: function () {
    return [
      ['color', ['color']],
      ['font', ['bold', 'underline', 'clear']],
      ['para', ['ul', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture']]
    ]
  },
  fullConfig: function (callback) {
    let config = {
      focus: true, // set focus to editable area after initializing summernote
      disableResizeEditor: true,
      placeholder: 'Post Body',
      toolbar: this.toolbar(),
      styleTags: this.styleTags(),
      popover: {
        image: this.popoverImage(),
        link: this.popoverLink(),
        //air: this.popoverAir()
      },
      buttons: SummerNoteButtons.config(),
      //disableDragAndDrop: false,
      callbacks: SummerNoteCallbacks.config(callback)
    }
    return config
  },
  airConfig: function (fieldName, placeholder, callback) {
    let config = {
      airMode: true,
      placeholder: placeholder,
      shortcuts: false,
      disableDragAndDrop: true,
      popover: {
        air: []
      },
      callbacks: {
        onChange: (contents) => {
          DelayExecHelper.exec(fieldName, 3, () => {
            $v.PostManager.updateEditingPost(fieldName, contents)
          })
          //console.log(fieldName + ':', contents)
        },
        onInit: function() {
          FunctionHelper.triggerCallback(callback)
        }
      }
    }
    return config
  },
}

export default SummerNoteConfig