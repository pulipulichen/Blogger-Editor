import SummerNoteConfig from './SummerNoteConfig.js'

let FieldPostBody = {
  ui: null,
  get: function () {
    if (this.ui === null
            || this.ui.length === 0) {
      this.ui = $('#summernotePostBody')
    }
    return this.ui
  },
  init: function () {
    //console.log('FieldPostBody init')
    this.get().summernote(SummerNoteConfig.fullConfig())
    //console.log(SummerNoteConfig.fullConfig())
    return this
  },
  getHTML: function () {
    return this.get().summernote('code');
  },
  getSelectTarget: function () {
    return this.get().summernote('restoreTarget')
  },
  getElement: function () {
    return this.get().next().find('.note-editing-area .note-editable')
  },
  insert: function (html) {
    this.get().summernote('insertNode', html);
    return this
  },
  set: function (value) {
    //console.log('postBody: ', value)
    this.get().summernote('code', value);
    return this
  },
  getImageList: function () {
    let postBody = this.getElement()
    let output = []
    postBody.find('img[src^="filesystem:"]').each((i, img) => {
      output.push(img.src)
    })
    return output
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
  save: function () {
    $v.PostManager.updateEditingPostBody(this.getHTML())
  }
}

export default FieldPostBody