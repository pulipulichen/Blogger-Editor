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
    $.get(url, (data) => {
      //console.log(data)
      let blob = new Blob([data])
      saveAs(blob, filename)
    })
  },
  save: function (content, filename) {
    let blob = new Blob([content])
    saveAs(blob, filename)
  }
}

window.FileHelper = FileHelper
export default FileHelper