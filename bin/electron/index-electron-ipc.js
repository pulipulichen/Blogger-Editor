//listen to an open-file-dialog command and sending back selected information
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const fs = require('fs')
const path = require('path')
const openBrowsers = require('open-browsers');

ipc.on('open-url-in-browser', function (event, url) {
  openBrowsers(url)
})
