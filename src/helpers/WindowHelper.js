WindowHelper = {
  popup: function (url, name, width, height) {
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

    let newWindow = window.open(url, name, `width=${width},height=${height},top=${top},left=${left},toolbar=0,menubar=0,location=0`);
    if (window.focus) {
      newWindow.focus()
    }
    return newWindow
  }
}