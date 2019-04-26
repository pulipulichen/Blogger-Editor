let PostManagerCache = {
  key: 'PostManagerCache.postBody',
  set: function (postBody) {
    try {
      localStorage.setItem(this.key, postBody)
    }
    catch (e) {}
  },
  get: function () {
    let cache = localStorage.getItem(this.key)
    if (cache !== null
            && typeof(cache) === 'string'
            && cache.trim() !== '') {
      return cache
    }
    return
  }
}

export default PostManagerCache