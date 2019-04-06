let SummerNoteCallbacks = {
  config: function (callback) {
    return {
      onInit: () => {
        FunctionHelper.triggerCallback(callback)
      },
      onImageUpload: (files) => {
        this.onImageUpload(files)
      },
      onDrop: (files) => {
        this.onDrop(files)
      },
      onPaste: (e) => {
        this.onPaste(e)
      },
      onChange: (contents) => {
        DelayExecHelper.exec('postBody', 5, () => {
          $v.EditorManager.FieldPostDate.set()
          $v.PostManager.updateEditingPostBody(contents)
        })
      },
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
    let path = this.getAssetDirPath()
    
    let loop = (i) => {
      if (i < files.length) {
        let file = files[i];
        let type = file.type
        let name = file.name
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