import SummerNoteHelper from './SummerNoteHelper.js'

import SummerNoteImage from './SummerNoteImage.js'
import SummerNoteCode from './SummerNoteCode.js'
import SummerNoteOpen from './SummerNoteOpen.js'

let SummerNoteButtons = {
  config: function ($t) {
    return {
      // ---------------
      // Buttons on Toolbar
      // ---------------
      
      CopyHTML: (c) => {
        return SummerNoteCode.CopyCode($t, c)
      },
      ImageReplacer: (c) => {
        return SummerNoteImage.ImageReplacer($t, c)
      },
      IframePrompt: (c) => {
        return SummerNoteOpen.IframePrompt($t, c)
      },
      FileUploader: (c) => {
        return SummerNoteOpen.FileUploader($t, c)
      },
      CodeInserter: (c) => {
        return SummerNoteOpen.CodeInserter($t, c)
      },
      OutlineNavigator: (c) => {
        return SummerNoteOpen.OutlineNavigator($t, c)
      },
      SnippetInserter: (c) => {
        return SummerNoteOpen.SnippetInserter($t, c)
      },
      
      // -------
      
      imageSizeOriginal: (c) => {
        return SummerNoteImage.imageSizeOriginal($t, c)
      },
      imageSizeDefault: (c) => {
        return SummerNoteImage.imageSizeDefault($t, c)
      },
      insertMore: (c) => {
        return SummerNoteCode.insertMore($t, c)
      },
      transSelected: (c) => {
        return SummerNoteOpen.transSelected($t, c)
      },
      downloadImageTemplate: (c) => {
        return SummerNoteImage.downloadImageTamplate($t, c)
      },
      CleanCode: (c) => {
        return SummerNoteCode.CleanCode($t, c)
      },
      SaveSnippet: (c) => {
        return SummerNoteCode.SaveSnippet($t, c)
      },
      toggleMenu: (c) => {
        return SummerNoteOpen.toggleMenu($t, c)
      },
      
      // ---------------
      // Buttons on Popover
      // ---------------
      
      popoverImageSizeOriginal: (c) => {
        return SummerNoteImage.popoverImageSizeOriginal($t, c)
      },
      popoverImageSizeDefault: (c) => {
        return SummerNoteImage.popoverImageSizeDefault($t, c)
      },
      popoverImageSave: (c) => {
        return SummerNoteImage.popoverImageSave($t, c)
      },
      popoverImageOpen: (c) => {
        return SummerNoteImage.popoverImageOpen($t, c)
      },
      
      
      // ---------------
      // Buttons for Dropdown
      // ---------------
      insertGroup: (c) => {
        return SummerNoteOpen.insertGroup($t, c)
      },
      /*
      formatGroup: (c) => {
        return SummerNoteOpen.formatGroup($t, c)
      },
      */
    }
  },  // config: function () {
  
}

export default SummerNoteButtons