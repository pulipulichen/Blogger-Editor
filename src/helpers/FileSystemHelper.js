FileSystemHelper = {
  type: window.TEMPORARY,
  quota: 5 * 1024 * 1024 /*5MB*/,
  fs: null,
  
  init: function () {
    
    // Note: The file system has been prefixed as of Google Chrome 12:
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(this.type,
            this.quota,
            (fs) => this.onInitFs(fs),
            (e) => this.errorHandler(e));

  },
  onInitFs: function (fs) {
    this.fs = fs
    //console.log('FileSystem inited')
    /*
    console.log('Opened file system: ' + fs.name);

    this.write('log.txt', 'ok', () => {
      this.read('log.txt', (result) => {
        console.log(result)
      })
    })
    */
  },
  errorHandler: function (e) {
    var msg = '';
    // https://developer.mozilla.org/zh-TW/docs/Web/API/FileError#Error_codes
    switch (e.code) {
      case 10: //case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
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
  },
  createDir: function (rootDirEntry, folders, callback) {
    if (typeof(folders) === 'string') {
      folders = folders.split('/')
    }
    
    //let errorHandler = this.errorHandler
    let errorHandler = () => {
      //console.log(['createDir error'])
      //console.log(folders)
      FunctionHelper.triggerCallback(callback)
    }
    
    // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
    if (folders[0] === '.' 
            || folders[0] === '') {
      folders = folders.slice(1);
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
  write: function (filePath, content, callback) {
    let fs = this.fs
    
    if (filePath.startsWith('/') === false) {
      filePath = '/' + filePath
    }
    
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
            this.write(filePath, content, callback)
          }); // fs.root is a 
        }
        else {
          this.isExists(filePath, (fileExists) => {
            if (fileExists === true) {
              this.remove(filePath, () => {
                this.write(filePath, content, callback)
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
    
    fs.root.getFile(filePath, 
      {create: true, exclusive: true}, 
      (fileEntry) => {

      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter((fileWriter) => {

          fileWriter.onwriteend = (e) => {
            console.log('Write completed: ' + filePath);
            //console.log(content)
            FunctionHelper.triggerCallback(callback)
          };

          fileWriter.onerror = (e) => {
            //console.log('Write failed: ' + filePath + ': ' + e.toString());
            FunctionHelper.triggerCallback(callback)
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
  read: function (filePath, callback) {
    let fs = this.fs
    //let errorHandler = this.errorHandler
    let errorHandler = () => {
      FunctionHelper.triggerCallback(callback)
    }
    fs.root.getFile(filePath, {}, function (fileEntry) {

      // Get a File object representing the file,
      // then use FileReader to read its contents.
      fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function (e) {
          //var txtArea = document.createElement('textarea');
          //txtArea.value = this.result;
          //document.body.appendChild(txtArea);
          
          if (typeof(callback) === 'function') {
            callback(this.result)
          }
        };

        reader.readAsText(file);
      }, errorHandler);

    }, errorHandler);

  },
  copy: function (dirPath, files, filename, callback) {
    if (typeof(filename) === 'function') {
      callback = filename
      filename = null
    }
    
    //console.log(typeof(files.name))
    if (typeof(files.name) === 'string') {
    //if (files.length > 1) {
      this.copy(dirPath, [files], filename, (list) => {
        if (typeof(callback) === 'function') {
          callback(list[0])
        }
      })
      return
    }
    
    let fs = this.fs
    let errorHandler = this.errorHandler
    
    this.createDir(fs.root, dirPath, () => {
      let output = []
      let loop = (i) => {
        if (i < files.length) {
          let file = files[i]
          //console.log(file.name)
          let baseFilePath
          if (filename === null) {
            baseFilePath = dirPath + file.name
          }
          else {
            baseFilePath = dirPath + filename
          }

          let pathPart1 = baseFilePath.slice(0, baseFilePath.lastIndexOf('.'))
          let pathPart2 = baseFilePath.slice(baseFilePath.lastIndexOf('.'))

          let dupCount = 0
          let writeFile = (filePath) => {
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
            }, () => {
              dupCount++
              filePath = pathPart1 + '_' + dupCount + pathPart2
              writeFile(filePath)
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
    let fs = this.fs
    let errorHandler = this.errorHandler
    
    fs.root.getFile(path, {create: false}, function(fileEntry) {

      fileEntry.remove(function() {
        //console.log('File removed: ' + path);
        FunctionHelper.triggerCallback(callback)
      }, errorHandler);

    }, errorHandler);
  },
  getFileName: function (url) {
    if (url.lastIndexOf('/') > -1) {
      url = url.slice(url.lastIndexOf('/') + 1)
    }
    return url
  },
  isExists: function (filePath, callback) {
    let fs = this.fs
    let errorHandler = () => {
      
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
      fsType = 'persist'
    }
    
    if (path.startsWith('/') === false) {
      path = '/' + path
    }
    
    return 'filesystem:' + location.protocol + '//' + location.host + '/' + fsType + path
  }
}

FileSystemHelper.init()