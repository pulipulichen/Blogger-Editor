//import { TesseractWorker } from 'tesseract.js';

let TesseractHelper = {
  worker: null,
  init: function (callback) {
    if (this.worker === null) {
      this.worker = new Tesseract.TesseractWorker()
    }

    FunctionHelper.triggerCallback(callback)
  },
  recognize: function (image, callback) {
    
    //console.log(image)
    return this.init(() => {
      //console.log('go')
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
  },
  
  recognizeFilename: function (imageFile, callback) {
    /*
    if (typeof(image.src) === 'string' || typeof(image.attr) === 'function') {
      let imageObject = new Image()
      let _this = this
      imageObject.onload = function () {
        _this.recognizeFilename(this, callback)
      }
      if (typeof(image.src) === 'string') {
        imageObject.src = image.src
      }
      if (typeof(image.attr) === 'function') {
        imageObject.src = image.attr('attr')
      }
      
      return
    }
    */
    if (typeof(imageFile.attr) === 'function') {
      imageFile = imageFile[0]
    }
    if (imageFile instanceof HTMLElement) {
      /*
      fetch(imageFile.src)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'dot.png', blob)
          //console.log(file)
          this.recognizeFilename(file, callback)
        })
      */
      FileSystemHelper.read(imageFile.src, (file) => {
        console.log(file)
        this.recognizeFilename(file, callback)
      })
      return
    }
    
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
      console.log(output)
      FunctionHelper.triggerCallback(callback, output)
    })
  }
}

window.TesseractHelper = TesseractHelper
export default TesseractHelper