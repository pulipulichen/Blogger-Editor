/* global FunctionHelper, ConfigHelper, InitHelper, WindowHelper, WindowHelper */

FileSystemHelper = {
  type: window.PERSISTENT,
  //type: window.PERSISTENT,
  quota: ConfigHelper.get('quotaInMB') * 1024 * 1024 /*5MB*/,
  fs: null,
  currentBaseUrl: null,
  init: function (callback) {
    
    // Note: The file system has been prefixed as of Google Chrome 12:
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    
    // window.webkitStorageInfo.queryUsageAndQuota()
    // window.StorageInfo.queryUsageAndQuota()
    
    let requestFS = (quota) => {
      window.requestFileSystem(this.type,
            quota,
            (fs) => this.onInitFs(fs, callback),
            (e) => this.errorHandler(e));
    }
    
    if (this.type === window.TEMPORARY) {
      requestFS(this.quota)
    }
    else {
      navigator.storage.persist().then(granted => {
        if (!granted) {
          console.warn("⚠️ 使用者未授權 persistent storage，資料可能不會永久保存。");
          // console.log('Error', e);
        } else if (this.debug) {
          console.log("✅ 已取得 persistent storage 授權");
        }
        let grantedBytes = 1024 * 1024 * 1024 * 5 // 5MB
        requestFS(grantedBytes)
      });
      // navigator.webkitPersistentStorage.requestQuota(this.quota, (grantedBytes) => {
        
      //   //window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
      // }, function(e) {
      // });
    }

  },
  onInitFs: function (fs, callback) {
    this.fs = fs
    //this.statsticQuotaUsage()
    //console.log('FileSystem inited')
    /*
    console.log('Opened file system: ' + fs.name);

    this.write('log.txt', 'ok', () => {
      this.read('log.txt', (result) => {
        console.log(result)
      })
    })
    */
    FunctionHelper.triggerCallback(callback)
  },
  errorHandler: function (e) {
    //console.log('Filesystem error')
    //console.trace(e)
    if (typeof(e.code) === 'undefined') {
      return undefined
    }
    
    let message = `Error code: ${e.code}<br />
Name: ${e.name}<br />
Message: ${e.message}`
    WindowHelper.alert(message)
    
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
  createDir: function (rootDirEntry, folders, callback) {
    if (typeof(folders) === 'string') {
      folders = folders.split('/')
    }
    
    //let errorHandler = this.errorHandler
    let errorHandler = (e) => {
      //console.log(['createDir error'])
      //console.log(folders)
      //console.log(['createDir', e])
      //FunctionHelper.triggerCallback(callback)
      console.log(['createDir', folders])
      this.errorHandler(e)
    }
    
    // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
    while (folders[0] === '.' 
            || folders[0] === '') {
      if (folders.length > 1) {
        folders = folders.slice(1)
      }
      else {
        return FunctionHelper.triggerCallback(callback)
      }
    }
    
    //console.log(folders[0])
    rootDirEntry.getDirectory(folders[0], 
      {create: true}, 
      (dirEntry) => {
      // Recursively add the new subfolder (if we still have another to create).
      if (folders.length) {
        this.createDir(dirEntry, folders.slice(1), callback);
      }
      else {
        FunctionHelper.triggerCallback(callback)
      }
    }, errorHandler);
  },
  removeDir: function (dirPath, callback) {
    if (InitHelper.ready === false) {
      console.log('wait init ready')
      return undefined
    }
    
    let fs = this.fs
    fs.root.getDirectory(dirPath, {}, function(dirEntry) {

      dirEntry.removeRecursively(function() {
        //console.log('Directory removed.');
        FunctionHelper.triggerCallback(callback)
      }, callback);

    }, callback);
  },
  
  writeFromString: function (filePath, content, callback) {
    if (InitHelper.ready === false) {
      console.log('wait init ready')
      return
    }
    
    let fs = this.fs
    
    if (filePath.startsWith('/') === false) {
      filePath = '/' + filePath
    }
    
    //console.log()
    
    //let errorHandler = this.errorHandler
    let errorHandler = (e) => {
      let dirPath = filePath.slice(0, filePath.lastIndexOf('/') + 1).trim()
      //if (dirPath === '') {
      //  this.errorHandler(e)
      //  return
      //}
      
      //console.log(dirPath)
      this.isExists(dirPath, (dirExists) => {
        if (dirExists === false) {
          this.createDir(fs.root, dirPath.split('/'), () => {
            this.writeFromString(filePath, content, callback)
          }); // fs.root is a 
        }
        else {
          this.isExists(filePath, (fileExists) => {
            if (fileExists === true) {
              this.remove(filePath, () => {
                this.writeFromString(filePath, content, callback)
              })
            }
            else {
              this.errorHandler(e)
            }
          })
        }
      })
    }
    
    // we have to check dir is existed.
    //console.log(['write', filePath])
    fs.root.getFile(filePath, 
      {create: true, exclusive: true}, 
      (fileEntry) => {

      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter((fileWriter) => {

          fileWriter.onwriteend = (e) => {
            console.log('Write completed: ' + filePath);
            //console.log(content)
            FunctionHelper.triggerCallback(callback, this.getFileSystemUrl(filePath))
          };

          fileWriter.onerror = (e) => {
            //console.log('Write failed: ' + filePath + ': ' + e.toString());
            FunctionHelper.triggerCallback(callback, this.getFileSystemUrl(filePath))
          };

          // Create a new Blob and write it to log.txt.
          //var bb = new BlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
          //bb.append(content);
          //fileWriter.write(bb.getBlob('text/plain'));

          fileWriter.write(new Blob([content]));
          //fileWriter.write(new Blob([content], {type: 'text/html'}));

      }, errorHandler);

    }, errorHandler);
  },
  writeFromBase64: function (filePath, content, callback) {
    if (InitHelper.ready === false) {
      console.log('wait init ready')
      return
    }
    
    let fs = this.fs
    
    if (filePath.startsWith('/') === false) {
      filePath = '/' + filePath
    }
    
    //console.log()
    
    //let errorHandler = this.errorHandler
    let errorHandler = (e) => {
      let dirPath = filePath.slice(0, filePath.lastIndexOf('/') + 1).trim()
      //if (dirPath === '') {
      //  this.errorHandler(e)
      //  return
      //}
      
      //console.log(dirPath)
      this.isExists(dirPath, (dirExists) => {
        if (dirExists === false) {
          this.createDir(fs.root, dirPath.split('/'), () => {
            this.writeFromBase64(filePath, content, callback)
          }); // fs.root is a 
        }
        else {
          this.isExists(filePath, (fileExists) => {
            if (fileExists === true) {
              this.remove(filePath, () => {
                this.writeFromBase64(filePath, content, callback)
              })
            }
            else {
              this.errorHandler(e)
            }
          })
        }
      })
    }
    
    // we have to check dir is existed.
    //console.log(['write', filePath])
    fs.root.getFile(filePath, 
      {create: true, exclusive: true}, 
      (fileEntry) => {

      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(async (fileWriter) => {

          fileWriter.onwriteend = (e) => {
            console.log('Write completed: ' + filePath);
            //console.log(content)
            // console.log(fileEntry.toURL())
            FunctionHelper.triggerCallback(callback, fileEntry.toURL())
          };

          fileWriter.onerror = (e) => {
            console.log('Write failed: ' + filePath + ': ' + e.toString());
            FunctionHelper.triggerCallback(callback, fileEntry.toURL())
          };

          // Create a new Blob and write it to log.txt.
          //var bb = new BlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
          //bb.append(content);
          //fileWriter.write(bb.getBlob('text/plain'));

          // let res = await fetch(content)
          // let blob = await res.blob()
          // let fileName = filePath.slice(filePath.lastIndexOf('/') + 1)
          // let blob = this.b64toBlob(content, fileName)
          // console.log(blob)
          let blob = await (await fetch(content)).blob()
          fileWriter.write(blob)
          //fileWriter.write(new Blob([content], {type: 'text/html'}));
          
      }, errorHandler);

    }, errorHandler);
  },
  b64toBlob: function (b64Data, filename, contentType, sliceSize) {
    if (b64Data.startsWith('data:') && b64Data.indexOf(';base64,') > 0) {
      contentType = b64Data.slice(5, b64Data.indexOf(';base64,'))
      b64Data = b64Data.slice(b64Data.indexOf(';base64,') + 8)
    }

    contentType = contentType || "";
    sliceSize = sliceSize || 512;
  
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
  
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
  
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      var byteArray = new Uint8Array(byteNumbers);
  
      byteArrays.push(byteArray);
    }
  
    // console.log(byteArrays);
  
    return new File(byteArrays, filename, { type: contentType });
  },
  isPlainText: function (path) {
    return (path.endsWith('.txt') 
            || path.endsWith('.html')
            || path.endsWith('.htm')
            || path.endsWith('.xhtml')
            || path.endsWith('.xml')
            || path.endsWith('.json')
            )
  },
  read: function (filePath, callback) {
    let fs = this.fs
    filePath = this.resolveFileSystemUrl(filePath)
    //console.log(['read', filePath])
    //let errorHandler = this.errorHandler
    let errorHandler = (e) => {
      if (e.code === 8) {
        // Error code: 8
        // Name: NotFoundError
        // Message: A requested file or directory could not be found at the time an operation was processed.
        
        //console.log('File not found: ' + filePath)
        FunctionHelper.triggerCallback(callback)
      }
      else {
        this.errorHandler(e)
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
          
          if (typeof(callback) === 'function') {
            callback(this.result)
          }
        };

        if (this.isPlainText(filePath)) {
          reader.readAsText(file)
        }
        else {
          reader.readAsDataURL(file)
        }
      }, errorHandler);

    }, errorHandler);

  },
  writeFromFile: function (dirPath, files, filename, callback) {
    if (InitHelper.ready === false) {
      console.log('wait init ready')
      return
    }
    
    if (typeof(filename) === 'function') {
      callback = filename
      filename = null
    }
    
    //console.log(typeof(files.name))
    if (typeof(files.name) === 'string') {
    //if (files.length > 1) {
      this.writeFromFile(dirPath, [files], filename, (list) => {
        if (typeof(callback) === 'function') {
          callback(list[0])
        }
      })
      return
    }
    
    let fs = this.fs
    let errorHandler = (e) => {
      this.errorHandler(e)
    }
    
    //console.log('go createDir')
    this.createDir(fs.root, dirPath, () => {
      let output = []
      let loop = (i) => {
        if (i < files.length) {
          let file = files[i]
          //console.log(file.name)
          let baseFilePath
          if (filename === null) {
            filename = file.name
          }
          
          //filename = this.filterSafeFilename(filename)
          filename = FileHelper.extractSafeFilename(filename)
          
          baseFilePath = dirPath + filename

          let pathPart1 = baseFilePath.slice(0, baseFilePath.lastIndexOf('.'))
          let pathPart2 = baseFilePath.slice(baseFilePath.lastIndexOf('.'))

          let dupCount = 0
          let writeFile = (filePath) => {
            //console.log(['go write file', filePath])
            fs.root.getFile(filePath, {create: true, exclusive: true}, function(fileEntry) {
              //console.log(filePath)
              fileEntry.createWriter(function(fileWriter) {
                //console.log(file.name)
                fileWriter.write(file); // Note: write() can take a File or Blob object.

                let url = fileEntry.toURL()
                output.push(url)

                i++
                loop(i)
              }, errorHandler);
            }, (e) => {
              if (e.code === 13) {
                // code: 13
                // message: "An attempt was made to create a file or directory where an element already exists."
                // name: "InvalidModificationError"
                dupCount++
                filePath = pathPart1 + '_' + dupCount + pathPart2
                writeFile(filePath)
              }
              else {
                //console.log(['error2', e])
                this.errorHandler(e)
              }
            });
          }
          writeFile(baseFilePath)

        }
        else {
          if (typeof(callback) === 'function') {
            callback(output)
          }
        }
      }
      loop(0)
    })  // this.createDir(fs.root, dirPath, () => {
  },
  remove: function (path, callback) {
    if (InitHelper.ready === false) {
      console.log('wait init ready')
      return
    }
    
    let fs = this.fs
    //let errorHandler = this.errorHandler
    let errorHandler = (e) => {
      //let link = this.getFileSystemUrl(path)
      //e.message = e.message + `<a href="${link}" target="_blank">${path}</a>`
      //console.trace(JSON.stringify(e))
      this.errorHandler(e.message)
      FunctionHelper.triggerCallback(callback)
    }
    
    fs.root.getFile(path, {create: false}, function(fileEntry) {

      fileEntry.remove(function() {
        //console.log('File removed: ' + path);
        FunctionHelper.triggerCallback(callback)
      }, errorHandler)

    }, errorHandler)
  },
  getFileName: function (url) {
    if (url.lastIndexOf('/') > -1) {
      url = url.slice(url.lastIndexOf('/') + 1)
    }
    //url = this.filterSafeFilename(url)
    url = FileHelper.extractSafeFilename(url)
    return url
  },
  isExists: function (filePath, callback) {
    if (filePath === '/') {
      return FunctionHelper.triggerCallback(callback, true)
    }
    
    let fs = this.fs
    let errorHandler = (e) => {
      
      fs.root.getDirectory(filePath, 
        {create: false}, 
        (dirEntry) => {
          FunctionHelper.triggerCallback(callback, true)
      }, () => {
        FunctionHelper.triggerCallback(callback, false)
      });
    }
    
    fs.root.getFile(filePath, {}, function (fileEntry) {

      // Get a File object representing the file,
      // then use FileReader to read its contents.
      fileEntry.file(function (file) {
        FunctionHelper.triggerCallback(callback, true)
      }, errorHandler);

    }, errorHandler);
  },
  getFileSystemUrl: function (path) {
    let fsType = 'temporary'
    if (this.type !== window.TEMPORARY) {
      fsType = 'persistent'
    }
    
    if (path.startsWith('/') === false) {
      path = '/' + path
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
  readEventFilesText: function (files, callback) {
    //console.log(typeof(files.name))
    let isArray = true
    if (typeof(files.name) === 'string') {
    //if (files.length > 1) {
      files = [files]
      isArray = false
    }
    
    let output = []
    let i = 0
    
    let reader = new FileReader();
    reader.onload = function (event) {
      let result = event.target.result
      output.push(result)
      i++
      loop(i)
    };
    
    let loop = (i) => {
      if (i < files.length) {
        let file = files[i]
        //console.log(file);
        //reader.readAsDataURL(file);
        reader.readAsText(file)
      }
      else {
        if (isArray === false) {
          output = output[0]
        }
        FunctionHelper.triggerCallback(callback, output)
      }
    }
    loop(i)
  },
  stripAssetFileSystemPrefix: function (url) {
    if (url === null
            || typeof(url) !== 'string'
            || !url.startsWith('filesystem:')
            || url.lastIndexOf('/assets/') === -1) {
      return url
    }
    
    return url.slice(url.lastIndexOf('/assets/') + 1)
    
  },
  appendAssetFileSystemPrefix: function (url, postId) {
    if (typeof(url) !== 'string') {
      return ''
    }
    
    if (url.startsWith(location.href)) {
      url = url.slice(location.href.length)
    }
    
    if (url.startsWith('#')) {
      return url
    }
    
    if (this.currentBaseUrl === null) {
      let currentBaseUrl = location.href
      this.currentBaseUrl = currentBaseUrl.slice(0, currentBaseUrl.lastIndexOf('/') + 1)
    }
      
    //console.log(['filterImageListToFileSystem url 1:', url])
    if (url.startsWith(this.currentBaseUrl) === false 
            && (
            url.startsWith('//')
            || url.startsWith('http://')
            || url.startsWith('https://'))) {
      return url
    }
    // filesystem:http://localhost:8383/temporary/2/assets/2019-0406-062107.png
    url = url.slice(url.lastIndexOf('/assets/') + 1)
    url = `/${postId}/${url}`
    //console.log(['filterImageListToFileSystem url 2:', this.getFileSystemUrl(url)])
    return this.getFileSystemUrl(url)
  },
  statsticQuotaUsage: function (callback) {
    let storage = navigator.webkitTemporaryStorage
    if (this.type === window.PERSISTENT) {
      storage = navigator.webkitPersistentStorage
    }
    
    storage.queryUsageAndQuota((quoteUsed, quotaTotal) => {
      FunctionHelper.triggerCallback(callback, quoteUsed, quotaTotal)
    })
  },
  list: function (path, callback) {
    let fs = this.fs
    let errorHandler = (e) => {
      if (e.code === 8) {
        // Error code: 8
        // Name: NotFoundError
        // Message: A requested file or directory could not be found at the time an operation was processed.
        console.log('list not found: ' + path)
        FunctionHelper.triggerCallback(callback)
      }
      else {
        this.errorHandler(e)
      }
    }
    let fileList = []
    /*
    var dirReader = fs.root.createReader();
    var entries = [];

    // Call the reader.readEntries() until no more results are returned.
    var readEntries = function() {
       dirReader.readEntries (function(results) {
        if (!results.length) {
          listResults(entries.sort());
        } else {
          entries = entries.concat(toArray(results));
          readEntries();
        }
      }, errorHandler);
    };

    readEntries(); // Start reading dirs.
    */
    fs.root.getDirectory(path, {}, function(dirEntry){
      var dirReader = dirEntry.createReader();
      dirReader.readEntries(function(entries) {
        for(var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (entry.isFile){
            //console.log('File: ' + entry.fullPath);
            fileList.push(entry.fullPath)
          }
        }
        FunctionHelper.triggerCallback(callback, fileList)
      }, errorHandler);
    }, errorHandler);
  },
  /*
  filterSafeFilename: function (filename) {
    if (filename.indexOf('+') > -1) {
      filename = filename.split('+').join('_')
    }
    return filename
  }
  */
  /*
  copy: function (oldPath, newPath, callback) {
    console.log(oldPath)
    return this.read(oldPath, (fileContent) => {
      console.log(newPath)
      this.writeFromString(newPath, fileContent, callback)
    })
  },
  move: function (oldPath, newPath, callback) {
    return this.copy(oldPath, newPath, () => {
      this.remove(oldPath, callback)
    })
  }
  */
  copy: function (oldPath, newPath, callback) {
    let fs = this.fs
    oldPath = this.resolveFileSystemUrl(oldPath)
    newPath = this.resolveFileSystemUrl(newPath)
    let newPathDir = newPath.slice(0, newPath.lastIndexOf('/'))
    let newName = newPath.slice(newPath.lastIndexOf('/') + 1)
    //console.log(['read', filePath])
    //let errorHandler = this.errorHandler
    let errorHandler = (e) => {
      if (e.code === 8) {
        // Error code: 8
        // Name: NotFoundError
        // Message: A requested file or directory could not be found at the time an operation was processed.
        
        //console.log('File not found: ' + filePath)
        FunctionHelper.triggerCallback(callback)
      }
      else {
        this.errorHandler(e)
      }
    }
    fs.root.getFile(oldPath, {}, (fileEntry) => {
      // Get a File object representing the file,
      // then use FileReader to read its contents.
      fs.root.getDirectory(newPathDir, {create: true}, (dirEntry) => {
        fileEntry.copyTo(dirEntry, newName, callback, errorHandler)
      })

    }, errorHandler);
  },
  
  move: function (oldPath, newPath, callback) {
    let fs = this.fs
    oldPath = this.resolveFileSystemUrl(oldPath)
    newPath = this.resolveFileSystemUrl(newPath)
    let newPathDir = newPath.slice(0, newPath.lastIndexOf('/'))
    let newName = newPath.slice(newPath.lastIndexOf('/') + 1)
    //console.log(['read', filePath])
    //let errorHandler = this.errorHandler
    let errorHandler = (e) => {
      if (e.code === 8) {
        // Error code: 8
        // Name: NotFoundError
        // Message: A requested file or directory could not be found at the time an operation was processed.
        
        //console.log('File not found: ' + filePath)
        FunctionHelper.triggerCallback(callback)
      }
      else {
        this.errorHandler(e)
      }
    }
    fs.root.getFile(oldPath, {}, (fileEntry) => {
      // Get a File object representing the file,
      // then use FileReader to read its contents.
      fs.root.getDirectory(newPathDir, {create: true}, (dirEntry) => {
        fileEntry.moveTo(dirEntry, newName, callback, errorHandler)
      })

    }, errorHandler);
  },
  getURLScreenshot (dirPath, url) {
    let appsScriptURL = $v.ConfigManager.apiKeysURLScreenshot
    console.log('0', appsScriptURL)

    if (!appsScriptURL || appsScriptURL === '') {
      // 錯誤的圖片
      return `https://i.ibb.co/Qpm8Qpw/6-Ways-to-Fix-Configuration-System-Failed-to-Initialize-in-Windows.jpg`
    }

    let safeURL = encodeURIComponent(url)
    let requestURL = appsScriptURL + `?url=${safeURL}`
    console.log('1', requestURL)

    let shortenSafeURL = safeURL
    if (shortenSafeURL.indexOf('://') > -1) {
      shortenSafeURL = shortenSafeURL.slice(shortenSafeURL.indexOf('://') + 3)
    }
    shortenSafeURL = shortenSafeURL.replace(/[\W]/g, '-')
    while (shortenSafeURL.indexOf('--') > -1) {
      shortenSafeURL = shortenSafeURL.replace(/--/g, '-')
    }
    if (shortenSafeURL.startsWith('-')) {
      shortenSafeURL = shortenSafeURL.slice(1)
    }
    if (shortenSafeURL.endsWith('-')) {
      shortenSafeURL = shortenSafeURL.slice(0, -1)
    }
    
    if (shortenSafeURL.length > 30) {
      shortenSafeURL = shortenSafeURL.slice(0, 10) + '-' + shortenSafeURL.slice(-10) + (new Date()).getTime()
    }
    console.log('2', shortenSafeURL)

    if (dirPath.endsWith('/')) {
      dirPath = dirPath.slice(0, -1)
    }

    console.log('3', shortenSafeURL)

    return new Promise((resolve) => {
      console.log(4, requestURL)
      $.getJSON(requestURL, async (json) => {
        let base64 = json.output
        // console.log(base64)

        // let res = await fetch(url)
        // let blob = await res.blob()
        let filePathToWrite = dirPath + '/' + shortenSafeURL + '.png'
        console.log('5', filePathToWrite)
        
        this.writeFromBase64(filePathToWrite, base64, (filePath) => {
          // console.log(filePath)
          resolve(filePath)
        })
      })
    })
      
  }
}

//FileSystemHelper.init()