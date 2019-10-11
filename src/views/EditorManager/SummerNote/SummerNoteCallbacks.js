/* global GoogleAnalyticsHelper, FunctionHelper */

import SummerNoteImage from './SummerNoteImage.js'

let SummerNoteCallbacks = {
  blockList: ['li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'],
  moveDown: [13, 48, 34],
  moveUp: [38, 33],
  FieldPostBody: null,
  toolbar: null,
  toolbarHeight: null,
  config: function (callback) {
    return {
      onInit: () => {
        FunctionHelper.triggerCallback(callback)
      },
      onImageUpload: (files) => {
        SummerNoteImage.insertFromButton(files)
      },
      onDrop: (files) => {
        //console.log('onDrop')
        this.onDrop(files)
      },
      onPaste: (e) => {
        this.onPaste(e)
      },
      onChange: (contents) => {
        $v.EditorManager.FieldPostBody.onChange(contents)
      },
      //onKeyup: (e) => {
      onKeyup: (e) => {
        // 只有少數幾個鍵是允許觸發的
        //console.log(e.target.selectionStart)
        //console.log([e.keyCode], this.enableScrollPositionToCenterKeyCodes.indexOf(e.keyCode))
        if (this.enableScrollPositionToCenterKeyCodes.indexOf(e.keyCode) > -1) {
          this.scrollPositionToCenter(e)
        }
      },
      onInput: (e) => {
        this.scrollPositionToCenter(e)
      },
      onHandleKeyMap: (e, keys, eventName) => {
        GoogleAnalyticsHelper.send('SummerNoteCallbacks.onHandleKeyMap', {
          keys: keys,
          eventName: eventName
        })
      }
    }
  },
  enableScrollPositionToCenterKeyCodes: [37, 38, 39, 40, 13, 32, 33, 34],
  scrollPositionToCenter: function (e) {
    if (this.FieldPostBody === null) {
      this.FieldPostBody = $v.EditorManager.FieldPostBody
    }

    if (this.toolbarHeight === null) {
      this.toolbar = $('.summernotePostBody-wrapper .note-toolbar')
      this.toolbarHeight = this.toolbar.height()
      window.addEventListener('resize', () => {
        this.toolbarHeight = this.toolbar.height()
      })
    }

    // enter: 13
    // arrow down: 48
    // page down: 34

    //let keyCode = e.keyCode


    //if (this.moveDown.indexOf(keyCode) > -1
    //        || this.moveUp.indexOf(keyCode) > -1) {
    if (true) {
      let currentPositionTop
      let currentPosition = this.FieldPostBody.getCurrentPosition()
      if (currentPosition !== undefined) {
        currentPositionTop = currentPosition.top
      }
      if (currentPositionTop === undefined) {
        return false
      }

      //console.log('beforeScrollTop', currentPositionTop)
      if (currentPositionTop < 500 
              || window.innerHeight < 480) {
        return false
      }

      let padding = (window.innerHeight - this.toolbarHeight) / 10

      //if (this.moveDown.indexOf(keyCode) > -1) {
        let bottomLimit = window.scrollY + window.innerHeight - padding
        //console.log(['bottom', currentPositionTop, bottomLimit, (currentPositionTop > bottomLimit)])
        if (currentPositionTop > bottomLimit) {
          //window.scrollTo(null, window.scrollY + padding)
          window.scrollBy({
            top: padding,
            behavior: 'smooth',
          })
        }
      //else if (this.moveUp.indexOf(keyCode) > -1) {
        let topLimit = window.scrollY + this.toolbarHeight + padding 
        //console.log(['top', currentPositionTop, topLimit, (currentPositionTop < topLimit)])
        if (currentPositionTop < topLimit) {
          //window.scrollTo(null, window.scrollY - padding)
          window.scrollBy({
            top: -1 * padding,
            behavior: 'smooth',
          })
        }
    }
  },
  onDrop: function (files) {
    let loop = (i) => {
      if (i < files.length) {
        let file = files[i];
        SummerNoteImage.insertImageFromDrop(file, () => {
          i++
          setTimeout(() => {
            loop(i)
          }, 1)
        })
      }
    }
    loop(0)
  },
  onPaste: function (e) {
    var orgEvent = e.originalEvent;
    let items = orgEvent.clipboardData.items

    for (var i = 0; i < items.length; i++) {
      if (items[i].kind === "file"
              && items[i].type.startsWith('image/')) {
        let imageFile = items[i].getAsFile();
        SummerNoteImage.insertImageFromPaste(imageFile)
        e.preventDefault();
        break;
      }
    }
  },
}

export default SummerNoteCallbacks