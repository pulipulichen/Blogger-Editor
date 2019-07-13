//import { TesseractWorker } from 'tesseract.js';

let TesseractHelper = {
  worker: null,
  init: function (callback) {
    let enable = true
    /*
    this.worker = new Tesseract.TesseractWorker({ 
      //corePath: '../../node_modules/tesseract.js-core/tesseract-core.wasm.js' 
    });
    */
    if (enable === false) {
      return
    }
    
    if (this.worker === null) {
      this.worker = new Tesseract.TesseractWorker();
    }

    FunctionHelper.triggerCallback(callback)
    return this
  },
  recognize: function (image, callback) {
    
    //console.log(image)
    return this.init(() => {
      //console.log('go')
      this.worker.recognize(image)
        .progress(progress => {
          //console.log('progress', progress);
        }).then(result => {
          //console.log('result', result);
          FunctionHelper.triggerCallback(callback, result)
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
  
  recognizeFilename: function (image, callback) {
    return this.recognize(image, result => {
      let terms = result.trim().match(/[A-Za-z]{2,}/g).map(term => {return term})
      
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
      
      FunctionHelper.triggerCallback(callback, output)
    })
  }
}

window.TesseractHelper = TesseractHelper
export default TesseractHelper