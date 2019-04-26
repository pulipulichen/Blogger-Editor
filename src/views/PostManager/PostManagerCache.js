let PostManagerCache = {
  key: 'PostManagerCache.postBody',
  set: function (postBody) {
    localStorage.setItem(this.key, postBody)
  },
  get: function () {
    let cache = localStorage.getItem(this.key)
    if (cache !== null) {
      return cache
    }
    return
  }
}

export default PostManagerCache