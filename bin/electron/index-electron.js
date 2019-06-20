
const path = require('path')
const url = require('url')
const fs = require('fs')

// -----------

const {
  app,
  BrowserWindow,
} = require('electron')

// ------------

app.on('ready', createWindow)

let mode = 'production'
if (process.argv.indexOf('--mode') - process.argv.indexOf('development') === -1) {
  mode = "development"
}
//console.log(mode)
//mode = "development"
//mode = 'production'

// --------------------


const contextMenu = require('electron-context-menu');

let contextMenuOptions = {
  // Change the labels of the predefined context menu
  // e.g Cut, Copy, Paste
  labels: {
      cut: 'Cut',
      copy: 'Copy',
      paste: 'Paste',
      //save: 'Save Image',
      saveImageAs: 'Save Image As...',
      copyLink: 'Copy Link',
      copyImageAddress: 'Copy Image Address',
      //inspect: 'Inspect Element'
  }
}

if (mode === "development") {
  contextMenuOptions['showInspectElement'] = true
}

contextMenu(contextMenuOptions);

// --------------------

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
      nodeIntegration: true,
      webviewTag: true,
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
    pathname: path.join(__dirname, '../../', 'index.html'),
    //pathname: path.join(__dirname, '../[document]/20190619-in-search/', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  if (mode === 'development') {
    win.webContents.openDevTools()
  }
  
  // When Window Close.
  win.on('closed', () => {
    win = null
  })

}

require('./index-electron-ipc.js')