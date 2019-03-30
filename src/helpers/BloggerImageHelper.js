BloggerImageHelper = {
  protocol: 'http',
  size: {
    full: 1600,
    normal: 450
  },
  getFullSize: function (link) {
    return this.getSize(link, this.size.full)
  },
  getSize: function (link, size) {
    // https://4.bp.blogspot.com/-dXBwnmgzLOQ/XJ42gDJTqJI/AAAAAAAEE7g/UU6Oxd6JB0EZDPOix5oY6NqwjfTiA17eACK4BGAYYCw/s1600/home-icon.png
    // https://4.bp.blogspot.com/-dXBwnmgzLOQ/XJ42gDJTqJI/AAAAAAAEE7g/UU6Oxd6JB0EZDPOix5oY6NqwjfTiA17eACK4BGAYYCw/s400/home-icon.png
    if (size === undefined) {
      size = this.size.normal
    }
    else if (typeof(size) === 'object') {
      // it is a img element
      size = this.getImageElementSize(size)
    }
    
    if (link.indexOf('/s/' + size) > 10) {
      return this.changeProtocol(link)
    }
    
    let baseUrl = this.getBaseUrl(link)
    let name = this.getFilename(link)
    return baseUrl + '/s' + size + '/' + name
  },
  changeProtocol: function (link) {
    if (typeof(this.protocol) === 'string') {
      if (link.startsWith(this.protocol + '://') === false) {
        return this.protocol + link.slice(link.indexOf('://'))
      }
    }
    return link
  },
  getFilename: function (link) {
    return link.slice(link.lastIndexOf('/') + 1)
  },
  getBaseUrl: function (link) {
    link = this.changeProtocol(link)
    let slash1 = link.lastIndexOf('/')
    let slash2 = link.lastIndexOf('/', slash1 - 1)
    return link.slice(0, slash2)
  },
  getImageElementSize: function (img) {
    if (typeof(img.width) !== 'function') {
      img = $(img)
    }
    return Math.max(img.width(), img.height())
  },
  readyToResize: function (img) {
    let defaultSize = $v.EditorManager.imageSizeDefault
    console.log(img)
    console.log(defaultSize)
  }
}