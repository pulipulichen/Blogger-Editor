
const path = require('path')
const url = require('url')
const fs = require('fs')

// -----------
/*
console.log('guya')
let sandboxPath = '/opt/chrome-webapp-shortcuts-creator/chrome-sandbox'

console.log([process.platform === 'linux' && fs.existsSync(sandboxPath)])
if (process.platform === 'linux' && fs.existsSync(sandboxPath)) {
  
  let stat = fs.statSync(sandboxPath)
  console.log(stat)
  if (stat.uid !== 0 || stat.mode !== 35309) {
    let terminalBinsCandicates = [
      //'/usr/bin/xfce4-terminal',
      '/usr/bin/xterm',
      '/usr/bin/gnome-terminal',
      '/usr/bin/konsole',
      '/usr/bin/terminal'
    ]

    let terminalPath
    for (let i = 0; i < terminalBinsCandicates.length; i++) {
      let p = terminalBinsCandicates[i]
      if (fs.existsSync(p)) {
        terminalPath = p
        break
      }
    }

    let command = 'echo "We need to change permission of ' + sandboxPath + '" &&'
      + ' sudo chown root ' + sandboxPath
      + ' sudo chmod 4755 ' + sandboxPath
  }
}
*/
// -----------

const {
  app,
  BrowserWindow,
} = require('electron')

const settings = require('electron-settings');

// ------------

app.on('ready', createWindow)

let mode = 'production'
if (process.argv.indexOf('--mode') - process.argv.indexOf('development') === -1) {
  mode = "development"
}
//console.log(mode)
//mode = "development"
//mode = 'production'

app.on('window-all-closed', () => {
  // darwin = MacOS
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

function createWindow() {
  // Create the browser window.
  let height = 570
  if (mode === 'development') {
    height = height + 30
  }
  
  if (process.platform === 'linux') {
    height = height - 30
  }
  
  let optionBrowserWindow = {
    width: 400,
    height: height,
    maximizable: false,
    icon: './icon.png',
    webPreferences: {
      nodeIntegration: true
    }
  }
  
  if (process.platform === 'win') {
    optionBrowserWindow.icon = optionBrowserWindow.icon.slice(0, optionBrowserWindow.icon.lastIndexOf('.')) 
            + '.ico'
  }
  
  
  win = new BrowserWindow(optionBrowserWindow)
  
  if (mode === 'production') {
    win.setMenu(null)
    win.setMenuBarVisibility(false)
  }
  
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  
  settings.set('mode', mode);
  if (mode === 'development') {
    win.webContents.openDevTools()
  }
  
  // When Window Close.
  win.on('closed', () => {
    win = null
  })

}
