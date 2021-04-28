/* global SemanticUIHelper, BloggerImageHelper, CopyPasteHelper, GoogleAnalyticsHelper */

import SummerNoteHelper from './SummerNoteHelper.js'
import SpeakUtil from './SpeakUtil.js'

let SummerNoteRead = {
  readAloudButton: null,
  ReadAloudClickEvent: async function () {
    if (!this.readAloudButton) {
      this.readAloudButton = $('.note-toolbar .speak-button')
    }
    
    if (SpeakUtil.isSpeaking) {
      SpeakUtil.stop()
      this.readAloudButton.css('color', '')
      return false
    }

    let selectedText = $v.EditorManager.FieldPostBody.getSelectText()
    
    //this.SaveSnippetClick()
    //console.log('Read Aloud', selectedText)
    if (selectedText.length === 0) {
      let element = $v.EditorManager.FieldPostBody.getCurrentElement()
      
      while (true) {
        let parent = element.parent()
        if (parent.hasClass('note-editable')) {
          break
        }
        element = parent
      } 
      //console.log(element)
      if (element) {
        selectedText = element.text()
      }
      //console.log(selectedText)
    }
    
    if (selectedText.length === 0) {
      return false
    }

    this.readAloudButton.css('color', 'green')
    await SpeakUtil.speak(selectedText, $v.EditorManager.speakRate)
    this.readAloudButton.css('color', '')
  },
  ReadAloud: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="assistive listening systems icon speak-button"></i>`)
    let tooltip = $t('Read Aloud')
    
    let click = () => {
      this.ReadAloudClickEvent()
    }
    return SummerNoteHelper.buildButton('readAloud', contents, tooltip, click, doRender)
  },
  rateLabel: null,
  getRateLabel: function () {
    if (!this.rateLabel) {
      this.rateLabel = $('.note-toolbar .rate-label')
      console.log(this.rateLabel)
      if (this.rateLabel.length === 0) {
        this.rateLabel = null
        return false
      }
    }
    return this.rateLabel
  },
  ReadAloudSpeedGroup: function ($t, context, doRender) {
    let rate = $v.EditorManager.speakRate
    let contents = SemanticUIHelper.wrapNIWSF(`<span class="rate-label">${rate}${$t('x')}</span>`)
    
    return SummerNoteHelper.buildDropdownButtonsGroup(context, contents, $t('Rate'), [
      this.ReadAloudSpeed($t, context, false, 1.5),
      this.ReadAloudSpeed($t, context, false, 1.6),
      this.ReadAloudSpeed($t, context, false, 1.7),
      this.ReadAloudSpeed($t, context, false, 1.8),
      this.ReadAloudSpeed($t, context, false, 1.9),
      this.ReadAloudSpeed($t, context, false, 2),
      this.ReadAloudSpeed($t, context, false, 1),
      this.ReadAloudSpeed($t, context, false, 0.8),
      this.ReadAloudSpeed($t, context, false, 0.6),
      this.ReadAloudSpeed($t, context, false, 0.5),
    ])
  },
  ReadAloudSpeed: function ($t, context, doRender, rate) {
    let contents = SemanticUIHelper.wrapNIWSF(`<span class="rate-option" data-rate="${rate}">${rate}x</span>`)
    let tooltip = $t('Rate') + ': ' + rate 
    let click = () => {
//      if (!this.rateLabel) {
//        this.rateLabel = $('.note-toolbar .rate-label')
//      }
//      
//      this.rateLabel.html(rate + $t('x'))
      $v.EditorManager.speakRate = rate
      $v.EditorManager.persist()
    }
    return SummerNoteHelper.buildButton('ReadAloudSpeed' + rate, contents, tooltip, click, doRender)
  },
}

export default SummerNoteRead