import mime from 'mime-types'

let CONFIG = {
  quotaInMB: 5
}

let triggerCallback = function (callback) {
  if (typeof (callback) === 'function') {
    callback()
  }
}

export default {
  type: window.PERSISTENT,
  //type: window.PERSISTENT,
  quota: CONFIG.quotaInMB * 1024 * 1024 /*5MB*/,
  fs: null,
  base: '',
  currentBaseUrl: null,
  // inited: false,
  init: function (base) {
    return new Promise((resolve, reject) => {
      try {
        // Note: The file system has been prefixed as of Google Chrome 12:
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

        // window.webkitStorageInfo.queryUsageAndQuota()
        // window.StorageInfo.queryUsageAndQuota()

        let requestFS = (quota) => {
          window.requestFileSystem(this.type,
            quota,
            (fs) => {
              this.fs = fs
              // this.inited = true
              if (base) {
                this.base = base
              }
              resolve()
            },
            (e) => {
              reject(e)
            });
        }

        if (this.type === window.TEMPORARY) {
          requestFS(this.quota)
        }
        else {
          navigator.webkitPersistentStorage.requestQuota(this.quota, (grantedBytes) => {
            requestFS(grantedBytes)
            //window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
          }, function (e) {
            // console.log('Error', e);
            reject(e)
          });
        }

        // resolve()
      }
      catch (e) {
        reject(e)
      }
    })
  },
  // onInitFs: function (fs, callback) {
  //   this.fs = fs
  //   //this.statsticQuotaUsage()
  //   //console.log('FileSystem inited')
  //   /*
  //   console.log('Opened file system: ' + fs.name);

  //   this.write('log.txt', 'ok', () => {
  //     this.read('log.txt', (result) => {
  //       console.log(result)
  //     })
  //   })
  //   */
  //   triggerCallback(callback)
  // },
  errorHandler: function (e) {
    //console.log('Filesystem error')
    //console.trace(e)
    if (typeof (e.code) === 'undefined') {
      return
    }

    let message = `Error code: ${e.code}<br />
Name: ${e.name}<br />
Message: ${e.message}`
    window.alert(message)

    //let errorObject = new Error(e.message);
    //console.log(errorObject.stack);
    console.trace(`FileSystem error: ${e.message}`)
    /*
    var msg = '';
    console.log(['errorHandler', e.code])
    // https://developer.mozilla.org/zh-TW/docs/Web/API/FileError#Error_codes
    switch (e.code) {
      case 10: //case FileError.QUOTA_EXCEEDED_ERR:
      case 22: //case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        WindowHelper.alert('Quota Exceeded. Please delete data.')
        break;
      case 1: //case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case 2: //case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case 9: //case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case 7: //case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      case 13:
        msg = 'FILE_EXISTED'
        break;
      default:
        msg = 'Unknown Error ' + e.code;
        break;
    }
    ;

    //console.log('Error: ' + msg);
    throw 'Error: ' + msg
    */
  },
  createDir: function (rootDirEntry, folders) {
    if (rootDirEntry && !folders) {
      folders = this.parsePath(rootDirEntry)
      if (folders.endsWith('/') === false && 
        folders.indexOf('/') > -1) {
        folders = folders.slice(0, folders.lastIndexOf('/') + 1)
      }
      rootDirEntry = this.fs.root
    }

    if (typeof (folders) === 'string') {
      folders = folders.split('/')
    }

    return new Promise((resolve, reject) => {

      //let errorHandler = this.errorHandler
      let errorHandler = (e) => {
        //console.log(['createDir error'])
        //console.log(folders)
        //console.log(['createDir', e])
        //triggerCallback(callback)
        console.log(['createDir', folders])
        // this.errorHandler(e)
        reject(e)
      }

      // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
      while (folders[0] === '.' ||
        folders[0] === '') {
        if (folders.length > 1) {
          folders = folders.slice(1)
        }
        else {
          // return triggerCallback(callback)
          return resolve()
        }
      }

      //console.log(folders[0])
      rootDirEntry.getDirectory(folders[0],
        { create: true },
        async (dirEntry) => {
          // Recursively add the new subfolder (if we still have another to create).
          if (folders.length) {
            await this.createDir(dirEntry, folders.slice(1))
            resolve()
          }
          else {
            // triggerCallback(callback)
            resolve()
          }
        }, errorHandler);
    })

  },
  removeDir: function (dirPath) {
    // if (InitHelper.ready === false) {
    if (!this.fs) {
      console.log('wait init ready')
      return
    }

    let fs = this.fs
    return new Promise((resolve, reject) => {
      fs.root.getDirectory(dirPath, {}, (dirEntry) => {

        dirEntry.removeRecursively(() => {
          //console.log('Directory removed.');
          // triggerCallback(callback)
          resolve()
        }, resolve);

      }, resolve);
    })

  },
  writeFromString: function (filePath, content) {
    // if (InitHelper.ready === false) {
    if (!this.fs) {
      console.log('wait init ready')
      return
    }

    let fs = this.fs

    if (filePath.startsWith('/') === false) {
      filePath = '/' + filePath
    }

    //console.log()
    return new Promise((resolve, reject) => {

      //let errorHandler = this.errorHandler
      let errorHandler = async (e) => {
        let dirPath = filePath.slice(0, filePath.lastIndexOf('/') + 1).trim()
        //if (dirPath === '') {
        //  this.errorHandler(e)
        //  return
        //}

        //console.log(dirPath)
        let dirExists = await this.isExists(dirPath)

        if (dirExists === false) {
          await this.createDir(dirPath)
          let result = await this.writeFromString(filePath, content)
          return resolve(result)
        }
        else {
          let fileExists = await this.isExists(filePath)
          if (fileExists === true) {
            await this.remove(filePath)
            let result = await this.writeFromString(filePath, content)
            return resolve(result)
          }
          else {
            // this.errorHandler(e)
            reject('writeFromString error')
          }

        }

      }

      // we have to check dir is existed.
      //console.log(['write', filePath])
      fs.root.getFile(filePath,
        { create: true, exclusive: true },
        (fileEntry) => {

          // Create a FileWriter object for our FileEntry (log.txt).
          fileEntry.createWriter((fileWriter) => {

            fileWriter.onwriteend = (e) => {
              filePath = this.getFileSystemUrl(filePath)
              console.log('Write completed: ' + filePath);
              //console.log(content)
              // triggerCallback(callback)
              resolve(filePath)
            };

            fileWriter.onerror = (e) => {
              //console.log('Write failed: ' + filePath + ': ' + e.toString());
              // triggerCallback(callback)
              reject()
            };

            // Create a new Blob and write it to log.txt.
            //var bb = new BlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
            //bb.append(content);
            //fileWriter.write(bb.getBlob('text/plain'));

            fileWriter.write(new Blob([content]));
            //fileWriter.write(new Blob([content], {type: 'text/html'}));

          }, errorHandler);

        }, errorHandler);
    })
  },
  isPlainText: function (path) {
    return (path.endsWith('.txt') ||
      path.endsWith('.html') ||
      path.endsWith('.htm') ||
      path.endsWith('.xhtml') ||
      path.endsWith('.xml') ||
      path.endsWith('.json'))
  },
  extractSafeFilename: function (filename, safeMaxLength, maxLength) {
    //console.log(filename)
    let list = filename.trim().match(/[\w\-\.]+/g)
    if (list !== null) {
      list = list.map((m) => { return m })
    }
    else {
      list = []
    }
    let output = ''
    for (let i = 0; i < list.length; i++) {
      if (output !== '') {
        output = output + '_'
      }
      output = output + list[i].trim()
      if (typeof (safeMaxLength) === 'number'
        && output.length > safeMaxLength) {
        break
      }
    }

    if (typeof (maxLength) === 'number' && output.length > maxLength) {
      output = output.slice(0, maxLength).trim()
    }

    return output
  },
  read: function (filePath) {
    let fs = this.fs
    filePath = this.resolveFileSystemUrl(filePath)
    filePath = this.parsePath(filePath)
    // console.log(['read', filePath])
    //let errorHandler = this.errorHandler
    return new Promise((resolve, reject) => {

      let errorHandler = (e) => {
        if (e.code === 8) {
          // Error code: 8
          // Name: NotFoundError
          // Message: A requested file or directory could not be found at the time an operation was processed.

          //console.log('File not found: ' + filePath)
          // triggerCallback(callback)
          return reject('File not found: ' + filePath)
        }
        else {
          // this.errorHandler(e)
          return reject(e)
        }
      }
      fs.root.getFile(filePath, {}, (fileEntry) => {

        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fileEntry.file((file) => {
          let reader = new FileReader();

          reader.onloadend = function (e) {
            //var txtArea = document.createElement('textarea');
            //txtArea.value = this.result;
            //document.body.appendChild(txtArea);

            // if (typeof(callback) === 'function') {
            //   callback(this.result)
            // }
            resolve(this.result)
          };

          if (this.isPlainText(filePath)) {
            reader.readAsText(file)
          }
          else {
            reader.readAsDataURL(file)
          }
        }, errorHandler);

      }, errorHandler);
    })
  },
  readBase64: async function (filePath) {
    let uri = await this.read(filePath)
    let idx = uri.indexOf('base64,') + 'base64,'.length
    let base64 = uri.substring(idx)
    return base64
  },
  writeFromFile: function (dirPath, files, filename) {
    // if (InitHelper.ready === false) {
    if (!this.fs) {
      console.log('wait init ready')
      return
    }

    // if (typeof (filename) === 'function') {
    //   callback = filename
    //   filename = null
    // }

    return new Promise(async (resolve, reject) => {
      let output = []
      //console.log(typeof(files.name))
      if (typeof (files.name) === 'string') {
        //if (files.length > 1) {
        let list = await this.writeFromFile(dirPath, [files], filename)
        return resolve(list[0])
      }

      // let fs = this.fs
      // let errorHandler = (e) => {
      //   // this.errorHandler(e)
      //   return reject(e)
      // }

      await this.createDir(dirPath)

      for (let i = 0; i < files.length; i++) {
        let file = files[i]
        //console.log(file.name)
        let specificFilename = filename
        if (specificFilename === null) {
          specificFilename = file.name
        }

        //filename = this.filterSafeFilename(filename)
        specificFilename = this.extractSafeFilename(specificFilename)

        let baseFilePath = dirPath + filename

        let url = await this.writeFile(baseFilePath)
        output.push(url)

        if (filename) {
          break
        }
      } // for (let i = 0; i < files.length; i++) {
      resolve(output)
    })



  },
  writeFile(filePath, file, dupCount = 0) {

    if (filePath.startsWith('./')) {
      filePath = filePath.slice(2)
    }
    if (filePath.startsWith('/')) {
      filePath = filePath.slice(1)
    }

    if (this.base !== '' && filePath.startsWith('/' + this.base + '/') === false) {
      filePath = '/' + this.base + '/' + filePath
    }

    // filePath = '/tmp.txt'
    // console.log('go write file', filePath)

    return new Promise(async (resolve, reject) => {
      await this.createDir(filePath)

      this.fs.root.getFile(filePath, {
        create: true, exclusive: true
      }, (fileEntry) => {
        //console.log(filePath)
        fileEntry.createWriter(function (fileWriter) {
          //console.log(file.name)
          fileWriter.write(file); // Note: write() can take a File or Blob object.

          let url = fileEntry.toURL()
          // output.push(url)

          resolve(url)
        }, reject);
      }, async (e) => {
        if (e.code === 13) {
          // code: 13
          // message: "An attempt was made to create a file or directory where an element already exists."
          // name: "InvalidModificationError"
          dupCount++

          let reg = /_[0-9]+\.[a-zA-Z0-9]+$/
          if (reg.test(filePath)) {
            let pathPart1 = filePath.slice(0, filePath.lastIndexOf('_'))
            let pathPart2 = filePath.slice(filePath.lastIndexOf('.'))
            filePath = pathPart1 + '_' + dupCount + pathPart2
          }
          else {
            let pathPart1 = filePath.slice(0, filePath.lastIndexOf('.'))
            let pathPart2 = filePath.slice(filePath.lastIndexOf('.'))
            filePath = pathPart1 + '_' + dupCount + pathPart2
          }
            
          let url = await this.writeFile(filePath, file, dupCount)
          return resolve(url)
        }
        else {
          // console.log('error2', e)
          // this.errorHandler(e)
          return reject(e)
        }
      });
    })
  },
  writeFileReplace: async function (filePath, file) {
    console.log('writeFileReplace', filePath)
    await this.remove(filePath)
    return await this.writeFile(filePath, file)
  },
  parsePath (path) {
    if (typeof(path) === 'number') {
      path = String(path)
    }
    else {
      path = decodeURIComponent(path)
    }

    if (path.startsWith('./')) {
      path = path.slice(1)
    }

    if (!path.startsWith('/')) {
      path = '/' + path
    }

    if (this.base !== '' && path.startsWith('/' + this.base + '/') === false) {
      path = '/' + this.base + '/' + path
    }

    return path
  },
  remove: function (path) {
    // if (InitHelper.ready === false) {
    if (!this.fs) {
      console.log('wait init ready')
      return
    }

    let fs = this.fs
    path = this.parsePath(path)
    //let errorHandler = this.errorHandler
    return new Promise(async (resolve, reject) => {

      let errorHandler = (e) => {
        //let link = this.getFileSystemUrl(path)
        //e.message = e.message + `<a href="${link}" target="_blank">${path}</a>`
        //console.trace(JSON.stringify(e))
        this.errorHandler(e.message)
        // triggerCallback(callback)
        return resolve()
      }

      fs.root.getFile(path, { create: false }, (fileEntry) => {
        fileEntry.remove(resolve, errorHandler)
      }, errorHandler)
    })

  },
  getFileName: function (url) {
    if (url.lastIndexOf('/') > -1) {
      url = url.slice(url.lastIndexOf('/') + 1)
    }
    //url = this.filterSafeFilename(url)
    url = this.extractSafeFilename(url)
    return url
  },
  isExists: function (filePath) {
    if (filePath === '/') {
      // return triggerCallback(callback, true)
      return true
    }

    let fs = this.fs

    return new Promise(async (resolve, reject) => {
      let errorHandler = (e) => {
        fs.root.getDirectory(filePath,
          { create: false },
          (dirEntry) => {
            // triggerCallback(callback, true)
            return resolve(true)
          }, () => {
            // triggerCallback(callback, false)
            return resolve(false)
          });
      }

      fs.root.getFile(filePath, {}, (fileEntry) => {

        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fileEntry.file((file) => {
          // triggerCallback(callback, true)
          return resolve(true)
        }, errorHandler);

      }, errorHandler);
    })
      
  },
  getFileSystemUrl: function (path) {
    let fsType = 'temporary'
    if (this.type !== window.TEMPORARY) {
      fsType = 'persistent'
    }

    if (path.startsWith('/') === false) {
      path = '/' + path
    }
    if (this.base !== '' && 
      path.startsWith('/' + this.base) === false) {
      path = '/' + this.base + path
    }

    return 'filesystem:' + location.protocol + '//' + location.host + '/' + fsType + path
  },
  resolveFileSystemUrl: function (path) {
    if (path.startsWith('filesystem:')) {
      let parts = path.split('/')
      path = '/' + parts.slice(4).join('/')
    }
    path = decodeURIComponent(path)
    return path
  },
  basename: function (path) {
    path = this.resolveFileSystemUrl(path)
    if (path.lastIndexOf('/') > -1) {
      path = path.slice(path.lastIndexOf('/') + 1)
      }
    return path
  },
  // readEventFilesText: function (files) {
  //   //console.log(typeof(files.name))
  //   let isArray = true
  //   if (typeof (files.name) === 'string') {
  //     //if (files.length > 1) {
  //     files = [files]
  //     isArray = false
  //   }

  //   let output = []
  //   let i = 0

  //   let reader = new FileReader();

  //   return new Promise(async (resolve, reject) => {
  //     reader.onload = function (event) {
  //       let result = event.target.result
  //       output.push(result)
  //       i++
  //       loop(i)
  //     };

  //     let loop = (i) => {
  //       if (i < files.length) {
  //         let file = files[i]
  //         //console.log(file);
  //         //reader.readAsDataURL(file);
  //         reader.readAsText(file)
  //       }
  //       else {
  //         if (isArray === false) {
  //           output = output[0]
  //         }
  //         // triggerCallback(callback, output)
  //         resolve(output)
  //       }
  //     }
  //     loop(i)
  //   })

      
  // },
  // stripAssetFileSystemPrefix: function (url) {
  //   if (url === null || 
  //     typeof (url) !== 'string' || 
  //     !url.startsWith('filesystem:') || 
  //     url.lastIndexOf('/assets/') === -1) {
  //     return url
  //   }

  //   return url.slice(url.lastIndexOf('/assets/') + 1)

  // },
  // appendAssetFileSystemPrefix: function (url, postId) {
  //   if (typeof (url) !== 'string') {
  //     return ''
  //   }

  //   if (this.currentBaseUrl === null) {
  //     let currentBaseUrl = location.href
  //     this.currentBaseUrl = currentBaseUrl.slice(0, currentBaseUrl.lastIndexOf('/') + 1)
  //   }

  //   //console.log(['filterImageListToFileSystem url 1:', url])
  //   if (url.startsWith(this.currentBaseUrl) === false && 
  //     (url.startsWith('//') || url.startsWith('http://') || url.startsWith('https://'))) {
  //     return url
  //   }
  //   // filesystem:http://localhost:8383/temporary/2/assets/2019-0406-062107.png
  //   url = url.slice(url.lastIndexOf('/assets/') + 1)
  //   url = `/${postId}/${url}`
  //   //console.log(['filterImageListToFileSystem url 2:', this.getFileSystemUrl(url)])
  //   return this.getFileSystemUrl(url)
  // },
  statsticQuotaUsage: function () {
    let storage = navigator.webkitTemporaryStorage
    if (this.type === window.PERSISTENT) {
      storage = navigator.webkitPersistentStorage
    }

    return new Promise(async (resolve, reject) => {
      storage.queryUsageAndQuota((quoteUsed, quotaTotal) => {
        // triggerCallback(callback, quoteUsed, quotaTotal)
        resolve({quoteUsed, quotaTotal})
      })
    })
      
  },
  _list: function (path) {
    let fs = this.fs

    path = this.parsePath(path)

    return new Promise(async (resolve, reject) => {
      let errorHandler = (e) => {
        if (e.code === 8) {
          // Error code: 8
          // Name: NotFoundError
          // Message: A requested file or directory could not be found at the time an operation was processed.
          // console.log('list not found: ' + path)
          // triggerCallback(callback)
          reject('list not found: ' + path)
        }
        else {
          // this.errorHandler(e)
          reject(e)
        }
      } 
      let fileList = []
      fs.root.getDirectory(path, {}, (dirEntry) => {
        var dirReader = dirEntry.createReader()
        dirReader.readEntries((entries) => {
          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i]
            if (entry.isFile) {
              //console.log('File: ' + entry.fullPath);
              fileList.push(entry.fullPath)
            }
          }
          // triggerCallback(callback, fileList)
          return resolve(fileList)
        }, errorHandler)
      }, errorHandler)
    })

  },
  get list() {
    return this._list
  },
  set list(value) {
    this._list = value
  },
  copy: function (oldPath, newPath) {
    let fs = this.fs
    oldPath = this.resolveFileSystemUrl(oldPath)
    newPath = this.resolveFileSystemUrl(newPath)
    let newPathDir = newPath.slice(0, newPath.lastIndexOf('/'))
    let newName = newPath.slice(newPath.lastIndexOf('/') + 1)
    //console.log(['read', filePath])
    //let errorHandler = this.errorHandler

    return new Promise(async (resolve, reject) => {
      let errorHandler = (e) => {
        if (e.code === 8) {
          // Error code: 8
          // Name: NotFoundError
          // Message: A requested file or directory could not be found at the time an operation was processed.

          //console.log('File not found: ' + filePath)
          // triggerCallback(callback)
          resolve()
        }
        else {
          // this.errorHandler(e)
          reject(e)
        }
      }
      fs.root.getFile(oldPath, {}, (fileEntry) => {
        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fs.root.getDirectory(newPathDir, { create: true }, (dirEntry) => {
          fileEntry.copyTo(dirEntry, newName, resolve, errorHandler)
        })

      }, errorHandler);
    })
  },
  move: function (oldPath, newPath) {
    let fs = this.fs
    oldPath = this.resolveFileSystemUrl(oldPath)
    newPath = this.resolveFileSystemUrl(newPath)
    let newPathDir = newPath.slice(0, newPath.lastIndexOf('/'))
    let newName = newPath.slice(newPath.lastIndexOf('/') + 1)
    //console.log(['read', filePath])
    //let errorHandler = this.errorHandler

    return new Promise(async (resolve, reject) => {
      let errorHandler = (e) => {
        if (e.code === 8) {
          // Error code: 8
          // Name: NotFoundError
          // Message: A requested file or directory could not be found at the time an operation was processed.

          //console.log('File not found: ' + filePath)
          return resolve()
        }
        else {
          // this.errorHandler(e)
          return reject(e)
        }
      }
      fs.root.getFile(oldPath, {}, (fileEntry) => {
        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fs.root.getDirectory(newPathDir, { create: true }, (dirEntry) => {
          fileEntry.moveTo(dirEntry, newName, resolve, errorHandler)
        })

      }, errorHandler);
    })
  },
  sleep: function (ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  getFileMetadata: async function (path) {
    while (!this.fs) {
      await this.sleep(100)
    }

    path = this.parsePath(path)

    return new Promise(async (resolve, reject) => {
      this.fs.root.getFile(path, {}, (fileEntry) => {
        fileEntry.getMetadata(({modificationTime, size}) => {
          let sizeNumber = size
          size = this.humanFileSize(size)
          let fileMIME = mime.lookup(path)
          let fileMIMEicon = 'gnome-mime-image'
          if (fileMIME) {
            fileMIMEicon = fileMIME.replace(/\//g, '-')
          }
            
          resolve({modificationTime, size, sizeNumber, mime: fileMIME, mimeIcon: fileMIMEicon})
        }, reject)
      })
    })
  },
  /**
 * Format bytes as human-readable text.
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
 * @return Formatted string.
 */
  humanFileSize: function (bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }

    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;

    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
  },
  reset: async function () {
    if (this.base !== '') {
      await this.removeDir(this.base)
    }
    else {
      let list = await this.list('')
      for (let i = 0; i < list.length; i++) {
        await this.remove(list[i])
      }
    }
  },
  popupPreview: async function (path) {
    while (!this.fs) {
      await this.sleep(100)
    }

    path = this.parsePath(path)

    let windowName = 'popup' + (new Date()).getTime()
    let bodyHTML = `
<div style="display: flex; align-items: center; justify-content: center; ">
  <img src="${this.getFileSystemUrl(path)}" />
</div>

<style>
body { padding: 0; height: 100vh; }
</style>`
    let title = this.getFileName(path)
    let size = 'fullscreen' // 'fullscreen', 'left', 'right'
    
    let top = 0
    let left = 0
    let width = window.screen.availWidth
    let height = window.screen.availHeight
    
    
    if (size === 'left') {
      width = parseInt(width / 2, 10)
    }
    else if (size === 'right') {
      width = parseInt(width / 2, 10)
      left = width
    }
    
    let parameters = [
      'toolbar=no',
      'location=no',
      'status=no',
      'menubar=no',
      'scrollbars=yes',
      'resizable=yes',
      'width=' + width,
      'height=' + height,
      'top=' + top,
      'left=' + left
    ]
    //console.log(windowName)
    let win = window.open('', windowName, parameters.join(','))
    
    // ------------------------------
    
    let isReady = false
    
    let doc = win.document
    
    if (bodyHTML) {
      doc.body.innerHTML = bodyHTML
      isReady = true
    }
    
    if (title) {
      doc.title = title
    }
    
    win.setHTML = (html) => {
      doc.body.innerHTML = html
      isReady = true
    }
    
    win.clearHTML = () => {
      doc.body.innerHTML = ''
    }
    
    win.setTitle = (title) => {
      doc.title = title
    }
    
    let waitReady = async () => {
      while (isReady === false) {
        await this.sleep()
      }
    }
    
    win.scrollToCenter = async () => {
      //console.log('1')
      await waitReady()
      //console.log('2', win.document.body.scrollWidth, win.innerWidth)
      let scrollLeft =  parseInt((win.document.body.scrollWidth - win.innerWidth) / 2, 10)
      //console.log(scrollLeft)
      win.scrollTo(scrollLeft, null)
    }
    
    win.scrollToTop = async () => {
      await waitReady()
      win.scrollTo(null, 0)
    }
    return win
  }
}

//FileSystemHelper.init()