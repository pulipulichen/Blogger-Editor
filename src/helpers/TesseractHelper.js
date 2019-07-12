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
  },
  recognize: function (image, callback) {
    
    console.log(image)
    this.init(() => {
      console.log('go')
      this.worker.recognize(image)
        .progress(progress => {
          console.log('progress', progress);
        }).then(result => {
          console.log('result', result);
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
  }
}

window.TesseractHelper = TesseractHelper
export default TesseractHelper