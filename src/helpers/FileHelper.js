import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'

let FileHelper = {
  download: function (url, filename) {
    /*
    if (!url.startsWith('filesystem:') 
            && !url.startsWith('http://')
            && !url.startsWith('https://')
            && !url.startsWith('//')) {
      let link = document.createElement("a");
      link.href = url;
      url = link.href;
    }
    
    console.log(url)
    */
    //return
    if (typeof(filename) !== 'string') {
      filename = url.slice(url.lastIndexOf('/') + 1)
    }
    
    /*
    $.get(url, (data) => {
      //console.log(data)
      let blob = new Blob([data])
      saveAs(blob, filename)
    })
    */
    let link = document.createElement("a");
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //delete link;
    
    /*
    link = document.createElement("a");
    link.target = "aaa";
    link.href = "filesystem:http://localhost:8383/temporary/2/assets/2019-0415-034405.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
     */
  },
  save: function (content, filename) {
    let blob = new Blob([content])
    saveAs(blob, filename)
    return this
  },
  triggerInput: function (e) {
    $(e.target).parent().children('input:file:first').click()
  },
  readZip: function (file, readCallback, callback) {
    JSZip.loadAsync(file) // 1) read the Blob
      .then((zip) => {
        //console.log(zip.files)
        let key = []
        zip.forEach((relativePath) => {
          if (relativePath.endsWith('/')) {
            return
          }
          key.push(relativePath)
        })
        
        let loop = (i) => {
          if (i < key.length) {
            let path = key[i]
            let filename = path.slice(path.lastIndexOf('/') + 1)
            let zipEntry = zip.files[path]
            
            let type = 'blob'
            if (filename.endsWith('.html')
                    || filename.endsWith('.css')
                    || filename.endsWith('.htm')
                    || filename.endsWith('.json')
                    || filename.endsWith('.txt')) {
              type = 'string'
            }
            
            zipEntry.async(type).then((content) => {
              FunctionHelper.triggerCallback(readCallback, {
                filename: filename,
                path: path,
                content, content
              }, () => {
                i++
                loop(i)
              })
              //console.log(data)
            })
          }
          else {
            FunctionHelper.triggerCallback(callback)
          }
        }
        loop(0)
      });
    return this
  },
  extractSafeFilename: function (filename, safeMaxLength, maxLength) {
    let list = filename.trim().match(/[\w\-\.]+/g).map((m) => {return m})
    let output = ''
    for (let i = 0; i < list.length; i++) {
      if (output !== '') {
        output = output + '_'
      }
      output = output + list[i].trim()
      if (typeof(safeMaxLength) === 'number' 
              && output.length > safeMaxLength) {
        break
      }
    }
    
    if (typeof(maxLength) === 'number' && output.length > maxLength) {
      output = output.slice(0, maxLength).trim()
    }
    
    return output
  },
  saveCSV: function (content, filename) {
    if (Array.isArray(content) === false || content.length === 0) {
      return
    }
    
    let fieldNameList = []
    let firstRowObject = content[0]
    for (let fieldName in firstRowObject) {
      if (fieldName.indexOf('"')) {
        fieldName = fieldName.split('"').join('\\"')
      }
      fieldNameList.push(`"${fieldName}"`)
    }
    
    let rows = [fieldNameList.join(',')]
    content.forEach(rowObject => {
      let row = []
      for (let fieldName in rowObject) {
        let value = rowObject[fieldName]
        if (typeof(value) !== 'string') {
          value = JSON.stringify(value)
        }
        if (value.indexOf('"')) {
          value = value.split('"').join('\\"')
        }
        row.push(`"${value}"`)
      }
      rows.push(row.join(','))
    })
    
    if (filename.endsWith('.csv') === false) {
      filename = filename + '.csv'
    }
    
    return this.save(rows.join('\n'), filename)
  }
}

window.FileHelper = FileHelper
export default FileHelper