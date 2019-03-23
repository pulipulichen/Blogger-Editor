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

    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      default:
        msg = 'Unknown Error';
        break;
    }
    ;

    console.log('Error: ' + msg);
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
  copy: function (files, callback) {
    if (Array.isArray(files) === false) {
      this.copy([files], (list) => {
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
        fs.root.getFile(file.name, {create: true, exclusive: true}, function(fileEntry) {
          fileEntry.createWriter(function(fileWriter) {
            fileWriter.write(file); // Note: write() can take a File or Blob object.

            let url = fileEntry.toURL()
            output.push(url)

            i++
            loop(i)
          }, errorHandler);
        }, errorHandler);
      }
      else {
        if (typeof(callback) === 'function') {
          callback(output)
        }
      }
    }
    loop(0)
  }

}

FileSystemHelper.init()