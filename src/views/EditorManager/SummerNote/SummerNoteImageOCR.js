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
    
  ],
  ocrImage: function (name) {
    //console.log($v.EditorManager.enableOCRImageFilename)
    //console.log(this.isNeedOCRFilename(name))
    if ($v.EditorManager.enableOCRImageFilename === true) {
      
      let postBody = $v.EditorManager.FieldPostBody.getElement()
      let aNode = postBody.find(`a[href^="filesystem:"][data-filename="${name}"]`)
      let imgNode = aNode.find(`img[src^="filesystem:"][data-filename="${name}"]`)
      //console.log([name, aNode.length, imgNode.length])
      if (aNode.length > 0 && imgNode.length > 0) {
        
        // 開始進入OCR的程序
        imgNode.attr('data-ocr', 'true')
        //console.log(name)
        DelayExecHelper.addForceWaiting(name)
        TesseractHelper.recognize(imgNode, (ocrText) => {
          ocrText = this.filterOCRText(ocrText)
          imgNode.attr('alt', ocrText)
          
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
                     .removeAttr('data-ocr')
              $v.EditorManager.FieldPostBody.save()
              DelayExecHelper.removeForceWaiting(name)
              // 完工
            })
          }
          else {
            $v.EditorManager.FieldPostBody.save()
            DelayExecHelper.removeForceWaiting(name)
            imgNode.removeAttr('data-ocr')
          }
        })
      }
    }
    return this
  },
  isNeedOCRFilename: function (name) {
    let terms = name.trim().match(/[A-Za-z]{2,}/g).map(term => {return term})
    return (terms.join('').length < 5)
  },
  parseOCRName: function (text) {
    let terms = text.trim().match(/[A-Za-z]{2,}/g).map(term => {return term})
      
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
      text = text.replace(/[  ]/g, ' ')
    }
    
    return text.trim()
  }
}

export default SummerNoteImageOCR