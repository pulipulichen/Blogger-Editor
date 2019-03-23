let FileSystemHelper = {
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
    console.log('FileSystem inited')
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
  write: function (filePath, content, callback) {
    let errorHandler = this.errorHandler
    let fs = this.fs
    fs.root.getFile(filePath, {create: true}, function (fileEntry) {

      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function (e) {
          console.log('Write completed: ' + filePath);
        };

        fileWriter.onerror = function (e) {
          console.log('Write failed: ' + filePath + ': ' + e.toString());
        };

        // Create a new Blob and write it to log.txt.
        //var bb = new BlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
        //bb.append(content);
        //fileWriter.write(bb.getBlob('text/plain'));
        fileWriter.write(new Blob([content]));

        if (typeof (callback) === 'function') {
          callback()
        }
      }, errorHandler);

    }, errorHandler);
  },
  read: function (filePath, callback) {
    let fs = this.fs
    let errorHandler = this.errorHandler
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
            console.log(filePath)
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
  },
  getFileName: function (url) {
    if (url.lastIndexOf('/') > -1) {
      url = url.slice(url.lastIndexOf('/') + 1)
    }
    return url
  }
}

FileSystemHelper.init()