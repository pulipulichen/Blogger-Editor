let PostManagerFile = {
  PostManager: null,
  init: function (PostManager, callback) {
    this.PostManager = PostManager
    EventManager.on(PostManager, ['open', 'updateEditingPostBody', 'createPostBodyFile', 'clonePost', 'readPostsZip'], () => {
      this.statisticQuota()
    })

    FunctionHelper.triggerCallback(callback)
  },
  statisticQuota: function (callback) {
    FileSystemHelper.statsticQuotaUsage((quotaUsed, quotaTotal) => {
      this.PostManager.quotaUsed = quotaUsed
      this.PostManager.quotaTotal = quotaTotal
      FunctionHelper.triggerCallback(callback)
    })
  },
  removePost: function (id, callback) {
    let dirPath = `/${id}`
    FileSystemHelper.removeDir(dirPath, callback)
  },
  writePostBody: function (id, postBody, callback) {
    let path = `/${id}/postBody.html`
    FileSystemHelper.writeFromString(path, postBody, () => {
      FunctionHelper.triggerCallback(callback)
    })
  },
  getPostBody: function (id, callback) {
    if (typeof (id) === 'function') {
      callback = id
      id = undefined
    }

    let path = `/${id}/postBody.html`
    FileSystemHelper.read(path, (postBody) => {
      if (postBody === undefined) {
        postBody = ''
      }
      //console.log(['getPostBody', postBody])
      FunctionHelper.triggerCallback(callback, postBody)
    })
  },
  /**
   * 
   * @author Pulipuli Chen 20190705 強迫覆蓋
   * @param {number} id
   * @param {string} content
   * @param {function} callback
   * @returns {PostManagerFile}
   */
   writePostBodyFile: function (id, content, callback) {
    let path = `/${id}/postBody.html`
    
    FileSystemHelper.write(path, content, callback)
    return this
  },
  /**
   * 
   * @author Pulipuli Chen 20190705 確認沒資料再覆蓋
   * @param {number} id
   * @param {string} content
   * @param {function} callback
   * @returns {PostManagerFile}
   */
  createPostBodyFile: function (id, content, callback) {
    let path = `/${id}/postBody.html`
    
    FileSystemHelper.isExists(path, (isExists) => {
      if (isExists === true) {
        FunctionHelper.triggerCallback(callback)
      } else {
        FileSystemHelper.writeFromString(path, content, callback)
      }

      //EventManager.trigger(this, 'createPostBodyFile')
    })
    return this
  },
  extractPostBodyFeatures: function (postBody) {

    if (typeof (postBody) !== 'string') {
      if (typeof (postBody.html) === 'function') {
        postBody = postBody.html()
      } else {
        postBody = JSON.stringify(postBody)
      }
    }

    postBody = postBody.trim()
    if (!postBody.startsWith('<') && !postBody.endsWith('>')) {
      postBody = `<div>${postBody}</div>`
    }
    let postBodyObject = $(postBody)
    let abstract = postBodyObject.text().trim()
    //let maxAbstractLength = 500
    //if (abstract.length > maxAbstractLength) {
    //  abstract = abstract.slice(0, maxAbstractLength).trim()
    //}

    //let sql = 'insert into posts(createUnix, updateUnix, title, labels, abstract, thumbnail) values(?,?,?,?,?,?)'
    let thumbnail = null
    let img = postBodyObject.find('img:first')
    if (img.length > 0) {
      thumbnail = img.attr('src')
    }

    return {
      abstract: abstract,
      thumbnail: thumbnail
    }
  },
}

export default PostManagerFile
