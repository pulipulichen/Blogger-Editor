import SummerNoteHelper from './SummerNoteHelper.js'

import SummerNoteImage from './SummerNoteImage.js'
import SummerNoteCode from './SummerNoteCode.js'
import SummerNoteOpen from './SummerNoteOpen.js'

let SummerNoteButtons = {
  config: function () {
    return {
      
      // ---------------
      // Buttons on Toolbar
      // ---------------
      
      CopyHTML: (c) => {
        return SummerNoteCode.CopyCode(c)
      },
      ImageReplacer: (c) => {
        return SummerNoteImage.ImageReplacer(c)
      },
      IframePrompt: (c) => {
        return SummerNoteOpen.IframePrompt(c)
      },
      FileUploader: (c) => {
        return SummerNoteOpen.FileUploader(c)
      },
      CodeInserter: (c) => {
        return SummerNoteOpen.CodeInserter(c)
      },
      OutlineNavigator: (c) => {
        return SummerNoteOpen.OutlineNavigator(c)
      },
      SnippetInserter: (c) => {
        return SummerNoteOpen.SnippetInserter(c)
      },
      
      // -------
      
      imageSizeOriginal: (c) => {
        return SummerNoteImage.imageSizeOriginal(c)
      },
      imageSizeDefault: (c) => {
        return SummerNoteImage.imageSizeDefault(c)
      },
      insertMore: (c) => {
        return SummerNoteCode.insertMore(c)
      },
      transSelected: (c) => {
        return SummerNoteOpen.transSelected(c)
      },
      downloadImageTemplate: (c) => {
        return SummerNoteImage.downloadImageTamplate(c)
      },
      CleanCode: (c) => {
        return SummerNoteCode.CleanCode(c)
      },
      toggleMenu: (c) => {
        return SummerNoteOpen.toggleMenu(c)
      },
      
      // ---------------
      // Buttons on Popover
      // ---------------
      
      popoverImageSizeOriginal: (c) => {
        return SummerNoteImage.popoverImageSizeOriginal(c)
      },
      popoverImageSizeDefault: (c) => {
        return SummerNoteImage.popoverImageSizeDefault(c)
      },
      popoverImageSave: (c) => {
        return SummerNoteImage.popoverImageSave(c)
      },
      popoverImageOpen: (c) => {
        return SummerNoteImage.popoverImageOpen(c)
      },
    }
  },  
  
}

export default SummerNoteButtons