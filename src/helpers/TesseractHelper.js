//import { TesseractWorker } from 'tesseract.js';

let TesseractHelper = {
  worker: null,
  init: function (callback) {
    if (this.worker === null) {
      this.worker = new Tesseract.TesseractWorker({
        //workerPath: 'https://unpkg.com/tesseract.js@v2.0.0-alpha.11/dist/worker.min.js',
        workerPath: './static/tesseract/worker.min.js',
        
        //langPath: 'https://tessdata.projectnaptha.com/4.0.0',
        //corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0-beta.10/tesseract-core.wasm.js',
        corePath: './static/tesseract/tesseract-core.wasm.js',
      })
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
      let timer
      let startCountdown = () => {
        timer = setTimeout(() => {
          console.log('OCR is not finish.')
          FunctionHelper.triggerCallback(callback, '')
        }, 10000)
      }
      let stopCountdown = () => {
        clearTimeout(timer)
      }
      let resetCountdown = () => {
        stopCountdown()
        startCountdown()
      }
      //console.log('go')
      let langs = $v.EditorManager.OCRImageLang
      //console.log(image)
      try {
        startCountdown()
        this.worker.recognize(image, langs)
          .progress(progress => {
            resetCountdown()
            console.log('progress', progress);
          })
          .then(result => {
            //console.log('result', result);
            stopCountdown()
            FunctionHelper.triggerCallback(callback, result.text)
          }).catch(err => {
            console.log(err)
            stopCountdown()
            FunctionHelper.triggerCallback(callback, '')
          });
      }
      catch (e) {
        console.error(e)
        stopCountdown()
        FunctionHelper.triggerCallback(callback, '')
      }
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
  list: [],
  push: function (image, callback) {
    this.list.push({
      image: image,
      callback: callback
    })
    this.loop()
  },
  isLoopNow: false,
  loop: function () {
    if (this.list.length > 0) {
      if (this.isLoopNow === true) {
        return
      }
      this.isLoopNow = true
      let job = this.list.shift()
      this.recognize(job.image, (result) => {
        if (typeof(job.callback) === 'function') {
          job.callback(result)
        }
        this.isLoopNow = false
        this.loop()
      })
    }
    else {
      this.isLoopNow = false
    }
  }
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