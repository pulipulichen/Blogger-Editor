import SummerNoteConfig from './SummerNoteConfig.js'

let FieldPostBody = {
  ui: null,
  debug: {
    disableSummerNode: false
  },
  init: function (callback) {
    this.debug.disableSummerNode = ConfigHelper.get('debug').disableSummerNode
    
    if (this.debug.disableSummerNode === true) {
      FunctionHelper.triggerCallback(callback)
      return this
    }
    
    //console.log('FieldPostBody init')
    this.get().summernote(SummerNoteConfig.fullConfig(callback))
    //console.log(SummerNoteConfig.fullConfig())
    return this
  },
  reload: function (callback) {
    this.ui = null
    this.get().summernote(SummerNoteConfig.fullConfig(callback))
    return this
  },
  get: function () {
    if (this.ui === null
            || this.ui.length === 0) {
      this.ui = $('#summernotePostBody')
    }
    return this.ui
  },
  getHTML: function () {
    if (this.debug.disableSummerNode === true) {
      return this.get().html()
    }
    
    return this.get().summernote('code');
  },
  getSelectTarget: function () {
    if (this.debug.disableSummerNode === true) {
      return
    }
    
    return this.get().summernote('restoreTarget')
  },
  getElement: function () {
    if (this.debug.disableSummerNode === true) {
      return this.get()
    }
    
    return this.get().next().find('.note-editing-area .note-editable')
  },
  insert: function (html) {
    if (this.debug.disableSummerNode === true) {
      this.get().append(html)
      return this
    }
    
    this.get().summernote('insertNode', html);
    return this
  },
  set: function (value) {
    if (this.debug.disableSummerNode === true) {
      this.get().html(value)
      return this
    }
    
    //console.log('postBody: ', value)
    this.get().summernote('code', value);
    return this
  },
  getImageList: function (postBody) {
    if (postBody === undefined) {
      postBody = this.getElement()
    }
    else if (postBody === '') {
      return []
    }
    else if (typeof(postBody) === 'string') {
      postBody = $(`<div>${postBody}</div>`)
    }
    
    let output = []
    postBody.find('img[src^="filesystem:"]').each((i, img) => {
      output.push(img.src)
    })
    return output
  },
  filterImageListToRelative: function (postBodyString) {
    let postBody = $(`<div>${postBodyString}</div>`)
    
    let filterUrl = function (url) {
      return url.slice(url.lastIndexOf('/assets/') + 1)
    }
    
    postBody.find('img[src^="filesystem:"]').each((i, img) => {
      img.src = filterUrl(img.src)
    })
    postBody.find('a[href^="filesystem:"]').each((i, aTag) => {
      aTag.href = filterUrl(aTag.href)
    })
    
    return postBody.html()
  },
  filterImageListToFileSystem: function (postBodyString, postId) {
    let postBody = $(`<div>${postBodyString}</div>`)
    
    let currentBaseUrl = location.href
    currentBaseUrl = currentBaseUrl.slice(0, currentBaseUrl.lastIndexOf('/') + 1)
    
    let filterUrl = function (url) {
      console.log(['filterImageListToFileSystem url 1:', url])
      if (url.startsWith(currentBaseUrl) === false 
              && (
              url.startsWith('//')
              || url.startsWith('http://')
              || url.startsWith('https://'))) {
        return url
      }
      // filesystem:http://localhost:8383/temporary/2/assets/2019-0406-062107.png
      url = url.slice(url.lastIndexOf('/assets/') + 1)
      url = `/${postId}/${url}`
      console.log(['filterImageListToFileSystem url 2:', FileSystemHelper.getFileSystemUrl(url)])
      return FileSystemHelper.getFileSystemUrl(url)
    }
    
    postBody.find('img[src]').each((i, img) => {
      img.src = filterUrl(img.src)
    })
    postBody.find('a[href]').each((i, aTag) => {
      aTag.href = filterUrl(aTag.href)
    })
    
    console.log(['filterImageListToFileSystem', postBody.find('a[href]').length])
    
    return postBody.html()
  },
  setImageList: function (imageList) {
    let postBody = this.getElement()
    let doSave = false
    let count = 0
    for (let name in imageList) {
      let link = imageList[name]
      //console.log([name, link])
      let fullsize = BloggerImageHelper.getFullSize(link)
      postBody.find('img[src^="filesystem:"][src$="' + name + '"]').each((i, imgTag) => {
        // we need to change the URL size to fit the image
        imgTag.src = BloggerImageHelper.getSize(link, imgTag)

        if (typeof(imgTag.title) !== 'string') {
          imgTag.title = name
        }
        doSave = true
        count++
      })
      postBody.find('a[href^="filesystem:"][href$="' + name + '"]').each((i, aTag) => {
        aTag.href = fullsize
        doSave = true
      })
    }

    if (doSave === true) {
      this.save(true)
      this.clearFileSystemAsset()
    }
    return count
  },
  hasFileSystemImage: function () {
    let postBody = this.getElement()
    return (postBody.find('img[src^="filesystem:"]:first').length === 1)
  },
  countFileSystemImage: function () {
    let postBody = this.getElement()
    return postBody.find('img[src^="filesystem:"]').length
  },
  clearFileSystemAsset: function () {
    if (this.hasFileSystemImage()) {
      console.log('Filesystem Images are still used. You cannot remove them.')
      return
    }

    let id = $v.PostManager.editingPostId
    let path = `/${id}/assets`
    return FileSystemHelper.removeDir(path)
  },
  save: function (callback) {
    $v.PostManager.updateEditingPostBody(this.getHTML(), callback)
  }
}

export default FieldPostBody