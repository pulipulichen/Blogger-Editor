//import { TesseractWorker } from 'tesseract.js';

let TesseractHelper = {
  worker: null,
  init: function (callback) {
    if (this.worker === null) {
      this.worker = new Tesseract.TesseractWorker()
      let langs = $v.EditorManager.OCRImageLang
      Tesseract.utils.loadLang({ langs: langs, langPath: this.worker.options.langPath })
        .then(() => {
          EventManager.on($v.EditorManager, 'OCRImageLangChanged', () => {
            this.worker = null
          })
          FunctionHelper.triggerCallback(callback)
        })
    }
    else {
      FunctionHelper.triggerCallback(callback)
    }
    return this
  },
  recognize: function (image, callback) {
    
    if (typeof(image.attr) === 'function') {
      image = image[0]
    }
    if (image instanceof HTMLElement) {
      FileSystemHelper.read(image.src, (file) => {
        //console.log(file)
        this.recognize(file, callback)
      })
      return this
    }
    
    //console.log(image)
    return this.init(() => {
      //console.log('go')
      let langs = $v.EditorManager.OCRImageLang
      this.worker.recognize(image, langs)
        //.progress(progress => {
        //  console.log('progress', progress);
        //})
        .then(result => {
          //console.log('result', result);
          FunctionHelper.triggerCallback(callback, result.text)
        });
    })
   /*
    Tesseract.recognize(image)
        .progress(progress => {
          console.log('progress', progress);
        })
        .then(function(result){
          console.log(result.text);
        //alert(result.text);
      });
      */
  },
  /**
   * @deprecated 20190713 Pulipuli Chen 
   * @param {type} imageFile
   * @param {type} callback
   * @returns {TesseractHelper}
   */
  /*
  recognizeFilename: function (imageFile, callback) {
    
    return this.recognize(imageFile, result => {
      let terms = result.text.trim().match(/[A-Za-z]{2,}/g).map(term => {return term})
      
      let output = ''
      let softLimit = 15
      let hardLimit = 30
      
      for (let i = 0; i < terms.length; i++) {
        if (output !== '') {
          output = output + '-'
        }
        output = output + terms[i]
        
        if (output.length > softLimit) {
          break
        }
      }
      
      if (output.length > hardLimit) {
        output = output.slice(0, hardLimit)
      }
      //console.log(output)
      FunctionHelper.triggerCallback(callback, output)
    })
  }
  */
}

window.TesseractHelper = TesseractHelper
export default TesseractHelper