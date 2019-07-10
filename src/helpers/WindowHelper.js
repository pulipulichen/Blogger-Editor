WindowHelper = {
  popup: function (url, name, width, height, forcePopup) {
    if (typeof(url) !== 'string' || url.length < 2) {
      return
    }
    
    if (ElectronHelper.isElectronEnvironment()) {
      ipc.send('open-url-in-browser', url)
      //console.log(url)
      return
    }
    
    if (forcePopup === undefined) {
      if (typeof(height) === 'boolean') {
        forcePopup = height
      }
      else if (typeof(width) === 'boolean') {
        forcePopup = width
      }
    }
    if (forcePopup === undefined) {
      forcePopup = false
    }
    
    //console.log([url, name, width, height])
    if (typeof(name) === 'number' && height === undefined) {
      height = width
      width = name
      name = '_blank'
    }
    
    if (name === undefined) {
      name = '_blank'
    }
    
    if (width === undefined) {
      width = 800
    }
    if (height === undefined) {
      height = 600
    }
    
    // ------------------
    
    let maxWidth = window.screen.availWidth - 100
    if (width > maxWidth) {
      width = maxWidth
    }

    let maxHeight = window.screen.availHeight - 50
    if (height > maxHeight) {
      height = maxHeight
    }
    
    // center the new Window
    let left = Math.ceil((window.screen.availWidth - width) / 2)
    let top = Math.ceil((window.screen.availHeight - height) / 2)

    let windowSetting = `width=${width},height=${height},top=${top},left=${left},toolbar=0,menubar=0,location=0`
    if (forcePopup === false && this.isRunningStandalone()) {
      windowSetting = undefined
    }
    //console.log(windowSetting)
    
    let newWindow
    
    if (url.startsWith('filesystem:') === false) {
      newWindow = window.open(url, name, windowSetting);
      if (newWindow === null) {
        this.alert('Please allow popup.')
        return
      }
      
      if (window.focus && newWindow !== null) {
        newWindow.focus()
      }
    }
    else {
      newWindow = window.open('', name, windowSetting);
      if (newWindow === null) {
        this.alert('Please allow popup.')
        return
      }
      
      if (url.endsWith('.html') 
              || url.endsWith('.css')
              || url.endsWith('.json')) {
        //console.log(newWindow)
        $.get(url, (content) => {
          //console.log(content)
          newWindow.document.write(content)
          if (window.focus && newWindow !== null) {
            newWindow.focus()
          }
        })
      }
      if (url.endsWith('.jpg') 
              || url.endsWith('.png')
              || url.endsWith('.jpeg')
              || url.endsWith('.gif')
              || url.endsWith('.svg')) {
        FileSystemHelper.read(url, (dataURI) => {
          let $doc = $(newWindow.document)
          if ($doc.find('body img').length === 0) {
            $doc.find('body').css('margin', 0).append(`<img />`)
          }
          $doc.find('body img').attr('src', dataURI)
          newWindow.document.title = decodeURIComponent(url.slice(url.lastIndexOf('/') + 1))
          //let mime = dataURI.slice(dataURI.indexOf(':') + 1, dataURI.indexOf(';'))
          //$(newWindow.document).find('head').append(`<link rel="icon" type="${mime}" href="${url}" />`)
          if (window.focus && newWindow !== null) {
            newWindow.focus()
          }
        })
      }
    }
    return newWindow
  },
  forcePopup: function (url, name, width, height) {
    return this.popup(url, name, width, height, true)
  },
  confirm: function (message, yesCallback, noCallback) {
    $v.WindowConfirm.open(message, yesCallback, noCallback)
    /*
    $(() => {
      if (window.confirm(message)) {
        FunctionHelper.triggerCallback(yesCallback)
      }
      else {
        FunctionHelper.triggerCallback(noCallback)
      }
    })
    */
  },
  alert: function (message, callback) {
    $v.WindowAlert.open(message, callback)
    
    /*
    $(() => {
      window.alert(message)
      FunctionHelper.triggerCallback(callback)
    })
    */
  },
  errorHandler: function (e) {
    let message = `Error code: ${e.code}<br />
Name: ${e.name}<br />
Message: ${e.message}`
    WindowHelper.alert(message)
  },
  isRunningStandalone () {
    return (window.matchMedia('(display-mode: standalone)').matches);
  }
}