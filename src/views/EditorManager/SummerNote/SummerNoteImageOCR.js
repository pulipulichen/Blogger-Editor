let SummerNoteImageOCR = {
  stopWords: [
    '~@®',
    '﹁',
    '>',
    '<',
    '|',
    '“',
    '﹕',
    'HH',
    '®',
    '@',
    'o0',
    '8%',
    '»',
    '°',
    'ol',
    '(',
    ')',
    '&amp;',
    '﹍',
    '﹣',
    '﹩',
    ' %',
    '乙逄',
    'U3',
    '﹥',
    '~',
    '《',
    '。',
    '*',
    ' s ',
    'O O ',
    '©',
    '=',
    '"',
    ': :',
    'i&i',
    '[J',
    '[8',
    '\\n',
    '」',
    '+',
    '區曙',
    '，'
  ],
  nameQueue: [],
  ocrImage: function (name) {
    //console.log($v.EditorManager.enableOCRImageFilename)
    //console.log(this.isNeedOCRFilename(name))
    
    if ($v.EditorManager.enableOCRImageFilename === true) {
      
      let postBody = $v.EditorManager.FieldPostBody.getElement()
      let aNode = postBody.find(`a[href^="filesystem:"][data-filename="${name}"]`)
      let imgNode = aNode.find(`img[src^="filesystem:"][data-filename="${name}"]`)
      
      if (this.nameQueue.indexOf(name) > -1) {
        console.log('this image is already doing OCR.')
        return
      }
      this.nameQueue.push(name)
      //imgNode.addClass('ocr-lock')
      
      // 20190719 測試用
      //if (imgNode.attr('data-ocr-lock') === undefined) {
      //  imgNode.attr('data-ocr-lock', 'true')
      //  return
      //}
      
      //console.log([name, aNode.length, imgNode.length])
      if (aNode.length > 0 && imgNode.length > 0) {
        
        // 開始進入OCR的程序
        imgNode.attr('data-ocr', 'waiting')
        //console.log(name)
        DelayExecHelper.addForceWaiting(name)
        
        // --------------------
        // 以下會等很久
        // --------------------
        TesseractHelper.push(imgNode, (ocrText) => {
          if (postBody.find(`a[href^="filesystem:"][data-filename="${name}"]`).length === 0) {
            console.log('image is deleted. stop ocr')
            this.ocrImageComplete(name)
            return
          }
          
          ocrText = this.filterOCRText(ocrText)
          //console.log([ocrText, name])
          if (typeof(ocrText) === 'string' && ocrText.trim() !== '') {
            imgNode.attr('alt', ocrText)
            imgNode.attr('data-ocr', 'finish')
          }
          else {
            imgNode.removeAttr('data-ocr')
          }
          
          let ocrName = this.parseOCRName(ocrText)
          
          if (this.isNeedOCRFilename(name) && ocrName !== '') {
            // 複製檔案
            let oldPath = imgNode.attr('src')
            let oldName = oldPath.slice(oldPath.lastIndexOf('/') + 1, oldPath.lastIndexOf('.'))
            if (oldName.length > 30) {
              oldName = oldName.slice(0, 30)
            }
            let nameExt = oldPath.slice(oldPath.lastIndexOf('.'))
            let newName = oldName + '-' + ocrName + nameExt
            let newPath = oldPath.slice(0, oldPath.lastIndexOf('/') + 1) + newName
            //console.log([oldPath, newName, newPath])
            
            FileSystemHelper.copy(oldPath, newPath, () => {
              aNode.attr('href', newPath)
                   .attr('data-filename', newName)
              imgNode.attr('src', newPath)
                     .attr('title', newName)
                     //.attr('alt', ocrText)
                     .attr('data-filename', newName)
                     //.removeClass('ocr-lock')
              this.ocrImageComplete(name, newName)
              // 完工
            })
          }
          else {
            imgNode.removeClass('ocr-lock')
            this.ocrImageComplete(name)
          }
        })
      }
    }
    return this
  },
  ocrImageComplete: function (name, newName) {
    $v.EditorManager.FieldPostBody.save()
    DelayExecHelper.removeForceWaiting(name)
    
    if (newName === undefined) {
      newName = name
    }
    
    GoogleAnalyticsHelper.send('SummerNoteImageOCR.ocrImageComplete', {
      'newName': newName
    })
    
    for (let i = this.nameQueue.length - 1; i >= 0; i--) {
      if (this.nameQueue[i] === name) {
        this.nameQueue.splice(i, 1);
        // break;       //<-- Uncomment  if only the first term has to be removed
      }
    }
    
    return this
  },
  isNeedOCRFilename: function (name) {
    // 移除掉一些特殊字元
    name = name.replace(/image/g, '')
    name = name.replace(/screenshot/g, '')
    name = name.replace(/Screenshot/g, '')
    
    let terms = name.trim().match(/[A-Za-z]{2,}/g).map(term => {return term})
    return (terms.join('').length < 5)
  },
  parseOCRName: function (text) {
    if (typeof(text) !== 'string') {
      return ''
    }
    let matched = text.trim().match(/[A-Za-z]{2,}/g)
    
    let terms = []
    if (matched !== null) {
      terms = matched.map(term => {return term})
    }
      
    let output = ''
    let softLimit = 30
    let hardLimit = 50

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
    
    return output
  },
  filterOCRText: function (text) {
    text = text.replace(/ [\u4e00-\u9fa5] /g, (match, offset) => {return match.slice(1,2)})
    text = text.replace(/[\u4e00-\u9fa5] /g, (match, offset) => {return match.slice(0,1)})
    text = text.replace(/ [\u4e00-\u9fa5]/g, (match, offset) => {return match.slice(1)})
    
    this.stopWords.forEach(word => {
      text = text.split(word).join(' ')
    })
    
    text = text.replace(/[\t|\n]/g, ' ')
    while (text.indexOf('  ') > -1) {
      text = text.split('  ').join(' ')
    }
    
    return text.trim()
  }
}

export default SummerNoteImageOCR