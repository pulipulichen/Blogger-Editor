let PostManagerFile = {
  PostManager: null,
  init: function (callback) {
    this.PostManager = $v.PostManager
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
  }
}

export default PostManagerFile
