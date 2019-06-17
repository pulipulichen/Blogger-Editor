
const path = require('path')
const url = require('url')
const fs = require('fs')

const pjson = require('./package.json');

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
  let height = 600
  if (mode === 'development') {
    height = height + 30
  }
  
  if (process.platform === 'linux') {
    height = height - 30
  }
  
  let optionBrowserWindow = {
    width: 800,
    height: height,
    maximizable: true,
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
  win.maximize()
  
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
  if (typeof(pjson) === 'object' && typeof(pjson.language) === 'string') {
    settings.set('language', pjson.language)
  }
  if (mode === 'development') {
    win.webContents.openDevTools()
  }
  
  // When Window Close.
  win.on('closed', () => {
    win = null
  })

}

