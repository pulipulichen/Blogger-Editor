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
    FileSystemHelper.write(path, postBody, () => {
      FunctionHelper.triggerCallback(callback, post)
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
  createPostBodyFile: function (id, content, callback) {
    let path = `/${id}/postBody.html`
    FileSystemHelper.isExists(path, (isExists) => {
      if (isExists === true) {
        FunctionHelper.triggerCallback(callback)
      } else {
        FileSystemHelper.write(path, content, callback)
      }

      //EventManager.trigger(this, 'createPostBodyFile')
    })
  },
}

export default PostManagerFile
