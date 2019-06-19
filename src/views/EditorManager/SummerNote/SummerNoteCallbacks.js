let SummerNoteCallbacks = {
  blockList: ['li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'],
  moveDown: [13, 48, 34],
  moveUp: [38, 33],
  FieldPostBody: null,
  toolbar: null,
  toolbarHeight: null,
  config: function (callback) {
    return {
      onInit: () => {
        FunctionHelper.triggerCallback(callback)
      },
      onImageUpload: (files) => {
        this.onImageUpload(files)
      },
      onDrop: (files) => {
        //console.log('onDrop')
        this.onDrop(files)
      },
      onPaste: (e) => {
        this.onPaste(e)
      },
      onChange: (contents) => {
        $v.EditorManager.FieldPostBody.onChange(contents)
      },
      //onKeyup: (e) => {
      onCompositionend: (e) => {
        console.log('onCompositionend')
        this.scrollPositionToCenter(e)
      }
    }
  },
  scrollPositionToCenter: function (e) {
    if (this.FieldPostBody === null) {
      this.FieldPostBody = $v.EditorManager.FieldPostBody
    }

    if (this.toolbarHeight === null) {
      this.toolbar = $('.summernotePostBody-wrapper .note-toolbar')
      this.toolbarHeight = this.toolbar.height()
      window.addEventListener('resize', () => {
        this.toolbarHeight = this.toolbar.height()
      })
    }

    // enter: 13
    // arrow down: 48
    // page down: 34

    let keyCode = e.keyCode


    //if (this.moveDown.indexOf(keyCode) > -1
    //        || this.moveUp.indexOf(keyCode) > -1) {
    if (true) {
      let currentPositionTop
      let currentPosition = this.FieldPostBody.getCurrentPosition()
      if (currentPosition !== undefined) {
        currentPositionTop = currentPosition.top
      }
      if (currentPositionTop === undefined) {
        return
      }

      //console.log(currentPositionTop)
      if (window.innerHeight < 480) {
        return
      }

      let padding = (window.innerHeight - this.toolbarHeight) / 5

      //if (this.moveDown.indexOf(keyCode) > -1) {
        let bottomLimit = window.scrollY + window.innerHeight - padding
        //console.log(['bottom', currentPositionTop, bottomLimit, (currentPositionTop > bottomLimit)])
        if (currentPositionTop > bottomLimit) {
          //window.scrollTo(null, window.scrollY + padding)
          window.scrollBy({
            top: padding,
            behavior: 'smooth',
          })
        }
      //else if (this.moveUp.indexOf(keyCode) > -1) {
        let topLimit = window.scrollY + this.toolbarHeight + padding 
        //console.log(['top', currentPositionTop, topLimit, (currentPositionTop < topLimit)])
        if (currentPositionTop < topLimit) {
          //window.scrollTo(null, window.scrollY - padding)
          window.scrollBy({
            top: -1 * padding,
            behavior: 'smooth',
          })
        }
    }
  },
  getAssetDirPath: function () {
    //$v.PostManager.getEditingPostId((id) => {
    //  let path = `/${id}/assets/`
    //  FunctionHelper.triggerCallback(callback, path)
    //})
    let id = $v.PostManager.editingPostId
    return `/${id}/assets/`
  },
  onImageUpload: function (files) {
    let path = this.getAssetDirPath()
    FileSystemHelper.copy(path, files, (urlList) => {
      urlList.forEach(imgUrl => {
        let name = FileSystemHelper.getFileName(imgUrl)
        this.insertImageNode(imgUrl, name)
      })
    })
  },
  onDrop: function (files) {
    //console.log(['onDrop', files])
    let path = this.getAssetDirPath()
    
    let loop = (i) => {
      if (i < files.length) {
        let file = files[i];
        let type = file.type
        let name = file.name
        name = FileSystemHelper.filterSafeFilename(name)
        //console.log(imageFile)

        FileSystemHelper.copy(path, file, (url) => {
          let node
          if (type.startsWith('image')) {
            this.insertImageNode(url, name)
          } else {
            node = $(`<a href="${url}">${name}</a>`)[0]
            $v.EditorManager.FieldPostBody.insert(node)
          }
          i++
          loop(i)
        })
      }
    }

    loop(0)
  },
  onPaste: function (e) {
    var orgEvent = e.originalEvent;
    let path = this.getAssetDirPath()
    let items = orgEvent.clipboardData.items

    for (var i = 0; i < items.length; i++) {
      if (items[i].kind === "file"
              && items[i].type.startsWith('image/')) {
        let imageFile = items[i].getAsFile();
        let filename = DayjsHelper.nowFormat() + '.png'
        FileSystemHelper.copy(path, imageFile, filename, (imgUrl) => {
          this.insertImageNode(imgUrl, filename)
        })
        e.preventDefault();
        break;
      }
    }
  },
  insertImageNode: function (url, name) {
    let imgNode = $(`<a href="${url}">
      <img src="${url}" title="${name}" alt="${name}" onload="BloggerImageHelper.readyToResize(this)" />
    </a>`)[0]
    //this.getPostSummerNote().summernote('insertNode', imgNode);
    $v.EditorManager.FieldPostBody.insert(imgNode)
  },
}

export default SummerNoteCallbacks