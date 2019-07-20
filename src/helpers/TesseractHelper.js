//import { TesseractWorker } from 'tesseract.js';
/**
 * https://github.com/naptha/tesseract.js/blob/master/docs/api.md
 * @type type
 */
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
      //let langs = $v.EditorManager.OCRImageLang
      //Tesseract.utils.loadLang({ langs: langs, langPath: this.worker.options.langPath })
      //  .then(() => {
          EventManager.on($v.EditorManager, 'OCRImageLangChanged', () => {
            this.worker = null
          })
          this.getMemoryUsedPercent()
          FunctionHelper.triggerCallback(callback)
      //  })
    }
    else {
      FunctionHelper.triggerCallback(callback)
    }
    return this
  },
  isAttachedToDOM: function (element) {
    if ((element instanceof HTMLElement) === false) {
      element = element[0]
    }
    return document == element || Boolean(document.compareDocumentPosition(element) & 16);
  },
  recognize: function (image, callback) {
    if (image === undefined || (typeof(image) !== 'string' && this.isAttachedToDOM(image) === false)) {
      console.log('image is not found')
      FunctionHelper.triggerCallback(callback, '')
      return this
    }
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
      let doProgress = false
      let timer
      let startCountdown = () => {
        timer = setTimeout(() => {
          if (doProgress === false) {
            delete this.worker
            this.worker = null
          }
          this.retry++
          if (this.retry < 4) {
            this.getMemoryUsedPercent()
            console.log(`OCR is not finish. Retry ${this.retry} now.`)
            setTimeout(() => {
              this.recognize(image, callback)
            }, 3000)
          }
          else {
            this.getMemoryUsedPercent()
            console.log('OCR is not finish.')
            FunctionHelper.triggerCallback(callback, '')
          }
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
            doProgress = true
            resetCountdown()
            this.getMemoryUsedPercent()
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
          })
          // .finally(job1.finally(resultOrError => console.log(resultOrError));
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
  retry: 0,
  push: function (image, callback) {
    this.list.push({
      image: image,
      callback: callback
    })
    this.loop()
  },
  isLoopNow: false,
  memoryPercentLimit: 0.5,
  loop: function () {
    if (this.list.length > 0) {
      if (this.getMemoryUsedPercent() > this.memoryPercentLimit) {
        console.log('memory is occupied, we will do OCR later.')
        this.worker = null
        setTimeout(() => {
          loop()
        }, 3000)
        return
      }
      
      if (this.isLoopNow === true) {
        return
      }
      this.isLoopNow = true
      let job = this.list.shift()
      this.retry = 0
      this.recognize(job.image, (result) => {
        if (typeof(job.callback) === 'function') {
          //setTimeout(() => { job.callback(result) }, 10 * 1000)
          job.callback(result)
        }
        this.isLoopNow = false
        
        /*
        let nextExecuteTime = 3000
        if (this.getMemoryUsedPercent() > 0.5) {
          this.worker = null
          nextExecuteTime = nextExecuteTime * 10
        }
        */
        setTimeout(() => {
          this.loop()
        }, 1000)
      })
    }
    else {
      this.isLoopNow = false
    }
  },
  getMemoryUsedPercent: function () {
    let memory = window.performance.memory
    let limit  = memory.jsHeapSizeLimit
    let used = memory.usedJSHeapSize
    let percent = used / limit
    console.log(['memory used', used, limit, percent])
    return percent
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