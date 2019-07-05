import SummerNoteConfig from './SummerNote/SummerNoteConfig.js'
import FieldPostBodyCache from './FieldPostBodyCache.js'

let FieldPostBody = {
  ui: null,
  firstSet: true,
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
    SummerNoteConfig.loadLocale(() => {
      this.get().summernote(SummerNoteConfig.postBodyConfig(callback))
    })
    //console.log(SummerNoteConfig.postBodyConfig())
    return this
  },
  reload: function (callback) {
    this.ui = null
    this.get().summernote(SummerNoteConfig.postBodyConfig(callback))
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
  getText: function () {
    return $(this.getHTML()).text().trim()
  },
  getSelectTarget: function () {
    if (this.debug.disableSummerNode === true) {
      return
    }
    
    let target = this.get().summernote('restoreTarget')
    if (target === undefined) {
      target = this.get().summernote('createRange')
    }
    return target
  },
  getCurrentPosition: function () {
    let target = this.getSelectTarget()
    if (target !== undefined) {
      let node = $(target.sc.parentElement)
      //console.log(node.prop('className'))
      if (node.hasClass('note-editable')) {
        try {
          return $(target.sc).offset()
        }
        catch (e) {
          return
        }
      }
      return node.offset()
    }
  },
  getSelectText: function () {
    if (this.debug.disableSummerNode === true) {
      return
    }
    
    let range = this.get().summernote('createRange')
    return range.toString() // your selected text
  },
  getElement: function () {
    if (this.debug.disableSummerNode === true) {
      return this.get()
    }
    
    return this.get().next().find('.note-editing-area .note-editable')
  },
  getSelectedNodeAndRemove: function () {
    return this.get().summernote('editor.getSelectedNodeAndRemove')
  },
  hasSelectedRange: function () {
    return this.get().summernote('editor.hasSelectedRange')
  },
  isNode: function (html) {
    return ( (html.startsWith('<') && html.endsWith('>')) )
  },
  insert: function (html) {
    if (this.debug.disableSummerNode === true) {
      if (typeof(html) === 'string') {
        html = html.trim()
        if (this.isNode(html) === false) {
          html = `<span>${html}</span>`
        }
        html = $(html)
      }
      this.get().append(html)
      return this
    }
    
    let s = this.get()
    s.summernote('insert', html)
    
    return this
  },
  change: function () {
    this.insert('')
  },
  set: function (value, doCache) {
    if (this.debug.disableSummerNode === true) {
      this.get().html(value)
      return this
    }
    
    if (this.firstSet === true) {
      if (typeof(value) !== 'string' || value.trim() === '') {
        let cache = FieldPostBodyCache.get()
        if (cache !== undefined) {
          value = cache
        }
      }
      this.firstSet = false
    }
    
    
    //console.log('postBody: ', value)
    this.get().summernote('code', value)
    this.get().summernote('editor.commit')
    
    if (doCache !== false) {
      FieldPostBodyCache.set(value)
    }
    
    //if ($v.EditorManager.OutlineNavigator !== null) {
    //  $v.EditorManager.OutlineNavigator.analyseHeadings()
    //}
    
    EventManager.trigger(this, 'set')
    
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
      return FileSystemHelper.stripAssetFileSystemPrefix(url)
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
    
    let filterUrl = function (url) {
      return FileSystemHelper.appendAssetFileSystemPrefix(url, postId)
    }
    
    postBody.find('img[src]').each((i, img) => {
      img.src = filterUrl(img.src)
    })
    postBody.find('a[href]').each((i, aTag) => {
      aTag.href = filterUrl(aTag.href)
    })
    
    //console.log(['filterImageListToFileSystem', postBody.find('a[href]').length])
    
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
      
      let tmpName = decodeURIComponent(name).split('+').join(' ')
      while (tmpName !== name) {
        name = tmpName
        tmpName = decodeURIComponent(name).split('+').join(' ')
      }
      name = encodeURIComponent(tmpName)
      
      // '1-Webpack%2B_%25282%2529.png'
      
      postBody.find('img[src^="filesystem:"][src$="' + name + '"]').each((i, imgTag) => {
        // we need to change the URL size to fit the image
        if ($(imgTag).hasClass('original-size') === false) {
          imgTag.src = BloggerImageHelper.getSize(link, imgTag)
        }
        else {
          imgTag.src = BloggerImageHelper.getFullSize(link)
        }

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
  countImage: function () {
    let postBody = this.getElement()
    return postBody.find('img[src]').length
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
  onChange: function (contents) {
    EventManager.trigger(this, 'beforechange')
    DelayExecHelper.exec('postBody', 5, 30, () => {
      $v.EditorManager.FieldPostDate.set()
      $v.PostManager.updateEditingPostBody(contents)
      //ScrollHelper.save()
      //$v.EditorManager.FieldPostBody.save()
      EventManager.trigger(this, 'change')
    })
  },
  save: function (callback) {
    this.deactivateCodeView()
    
    let postBody = this.getHTML()
    if (typeof(postBody) !== 'string' || postBody.trim() === '') {
      return
    }
    
    this.cleanUnusedFileSystem(() => {
      $v.PostManager.updateEditingPostBody(postBody, callback)
      EventManager.trigger(this, 'save')
    })
  },
  deactivateCodeView: function () {
    let ui = this.get()
    if (ui.summernote('codeview.isActivated') === true) {
      ui.summernote('codeview.toggle')
    }
  },
  activateCodeView: function () {
    let ui = this.get()
    if (ui.summernote('codeview.isActivated') === false) {
      ui.summernote('codeview.toggle')
    }
  },
  cleanUnusedFileSystem: function (callback) {
    // list the files in postBody
    let postBodyList = []
    
    let pushPostBodyList = (url) => {
      url = url.slice(url.lastIndexOf('/') + 1)
      if (postBodyList.indexOf(url) === -1) {
        postBodyList.push(url)
      }
    }
    
    let postBody = this.getElement()
    postBody.find('img[src^="filesystem:"]').each((i, img) => {
      pushPostBodyList(img.src)
    })
    postBody.find('a[href^="filesystem:"]').each((i, aTag) => {
      pushPostBodyList(aTag.href)
    })
    
    //console.log(filesystemList)
    
    // list the files under filesystem folder
    let postId = $v.PostManager.editingPostId
    let path = `/${postId}/assets/`
    FileSystemHelper.list(path, (files) => {
      if (files === undefined) {
        return FunctionHelper.triggerCallback(callback)
      }
      
      let i = 0
      
      let loop = (i) => {
        if (i < files.length) {
          let file = files[i]
          let filename = file.slice(file.lastIndexOf('/') + 1)
          filename = encodeURI(filename)
          if (postBodyList.indexOf(filename) === -1) {
            //console.log(['auto clean', file])
            FileSystemHelper.remove(file, next)
          }
          else {
            next()
          }
        }
        else {
          FunctionHelper.triggerCallback(callback)
        }
      }
      
      let next = () => {
        i++
        loop(i)
      }
      
      loop(i)
    })
  }
}

export default FieldPostBody