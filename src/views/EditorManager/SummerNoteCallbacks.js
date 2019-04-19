let SummerNoteCallbacks = {
  blockList: ['li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'],
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
        DelayExecHelper.exec('postBody', 5, () => {
          $v.EditorManager.FieldPostDate.set()
          $v.PostManager.updateEditingPostBody(contents)
          ScrollHelper.save()
          //$v.EditorManager.FieldPostBody.save()
        })
      },
      onEnter: (e) => {
        //console.log('onEnter')
        //console.log(e)
        let postBody = $v.EditorManager.FieldPostBody
        let target = postBody.getSelectTarget()
        //console.log($(target).html())
        let parent = target.sc.parentNode
        //console.log(target)

        //target = $(target.sc)
        parent = $(parent)
        if (parent.hasClass('note-editing-area') === true 
                || parent.hasClass('note-editable') === true) {
          //console.log('has class note-editing-area')
          return
        }
        let content = parent.html()
        //let grandParent = parent.parent()
        let tagName = parent.prop('tagName').toLowerCase()
        //console.log(['parent tagName', tagName])
        
        let disableList = ['td', 'tr', 'th', 'caption', 'code']
        if (disableList.indexOf(tagName) > -1) {
          return
        }
        
        //let grandTagName = grandParent.prop('tagName').toLowerCase()
        //console.log(['firstTagName', tagName])
        let blockList = this.blockList
        
        let skip = false
        //let pass = false
        let targetParent
        parent.parents().each((i, ele) => {
          if (skip === true || targetParent !== undefined) {
            return
          }
          if (typeof(ele.className) === 'string' 
                  && ele.className.indexOf('note-editable') > -1) {
            skip = true
            return
          }
          
          let tn = ele.tagName.toLowerCase()
          //console.log(tn)
          
          if (blockList.indexOf(tn) > -1) {
            tagName = tn
            targetParent = $(ele)
            return
          }
        })
        
        if (targetParent === undefined) {
          return
        }
        
        /*
        
        if (blockList.indexOf(grandTagName) > -1) {
          tagName = grandTagName
          parent = grandParent
        }
        else if (blockList.indexOf(tagName) === -1) {
          while (grandParent.hasClass('note-editing-area') === false 
                  && grandParent.hasClass('note-editable') === false) {
            parent = grandParent
            grandParent = parent.parent()
            if (parent.prop('tagName') !== 'undefined') {
              tagName = parent.prop('tagName')
            }
          }
        }
        */
        let newParent = $(`<${tagName}>${content}</${tagName}>`)
        targetParent.replaceWith(newParent)
        //$(() => {
        //  parent.focus()
        //  newParent.focus()
        //})
        //parent.replaceWith(newParent)
        let p = newParent[0]
        let s = window.getSelection()
        let r = document.createRange()
        r.setStart(p, p.childElementCount)
        r.setEnd(p, p.childElementCount)
        s.removeAllRanges()
        s.addRange(r)
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
    //console.log(['onDrop', files])
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