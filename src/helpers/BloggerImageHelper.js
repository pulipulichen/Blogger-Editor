/* global ElectronHelper */

let BloggerImageHelper = {
  //protocol: 'http',
  size: {
    full: 1600,
    normal: 450
  },
  getFullSize: function (link) {
    if (link.startsWith('https://blogger.googleusercontent.com/img/a/')) {
      return link
    }
    return this.getSize(link, this.size.full)
  },
  getSize: function (link, size) {
    // https://4.bp.blogspot.com/-dXBwnmgzLOQ/XJ42gDJTqJI/AAAAAAAEE7g/UU6Oxd6JB0EZDPOix5oY6NqwjfTiA17eACK4BGAYYCw/s1600/home-icon.png
    // https://4.bp.blogspot.com/-dXBwnmgzLOQ/XJ42gDJTqJI/AAAAAAAEE7g/UU6Oxd6JB0EZDPOix5oY6NqwjfTiA17eACK4BGAYYCw/s400/home-icon.png
    //console.log([link, size])
    if (size === undefined) {
      size = this.size.normal
    }
    else if (typeof(size) === 'object') {
      // it is a img element
      size = this.getImageElementSize(size)
    }
    
    if (link.startsWith('https://blogger.googleusercontent.com/img/a/')) {
      return this.getSize2021(link, size)
    }
    
    if (link.indexOf('/s' + size + '/') > 10) {
      return this.changeProtocol(link)
    }
    let baseUrl = this.getBaseUrl(link)
    let name = this.getFilename(link)
    link = baseUrl + '/s' + size + '/' + name
    //console.log(link)
    return link
  },
  /**
   * https://blogger.googleusercontent.com/img/a/AVvXsEgnpxfsLEwLmyCvqqTaNmS6dK5fw26Tzg2gcsk5agew6CfocTsfRWr14ROejq3bCcr_T2g23NfaKzVQwHNi60K2iAIBe3UQU2qFBFuUmhf5u9PJqjkEfea3-gR0OIzTtBOri9BR-tMkMIm6xJhsg6ycmtiBHNe9R_43PKV-1Ziw77_eRjSto_Y
   * https://blogger.googleusercontent.com/img/a/AVvXsEgnpxfsLEwLmyCvqqTaNmS6dK5fw26Tzg2gcsk5agew6CfocTsfRWr14ROejq3bCcr_T2g23NfaKzVQwHNi60K2iAIBe3UQU2qFBFuUmhf5u9PJqjkEfea3-gR0OIzTtBOri9BR-tMkMIm6xJhsg6ycmtiBHNe9R_43PKV-1Ziw77_eRjSto_Y=s280
   * @param {type} link
   * @param {type} size
   * @returns {undefined}
   */
  getSize2021 (link, size) {
    // 先確定有沒有縮放參數
    let resizeParameter = link.lastIndexOf('=s')
    if (resizeParameter > link.length - 7) {
      link = link.slice(0, resizeParameter)
    }
    
    return link + '=s' + size
  },
  changeProtocol: function (link) {
    //if (typeof(this.protocol) === 'string') {
      //if (link.startsWith())
      //if (link.startsWith(this.protocol + '://') === false) {
      //  return this.protocol + link.slice(link.indexOf('://'))
      //}
    //}
    if (ElectronHelper.isElectronEnvironment() === false) {
      if (typeof(link) === 'string' 
              && (link.startsWith('http://') || link.startsWith('https://'))
              && !link.startsWith('https://blogger.googleusercontent.com/img/a/')
              ) {
        // 排除 https://blogger.googleusercontent.com/img/a/AVvXsEhPDOJwwZqvyYrW6xR2A7JrTnvqmNZVdH73PGC3Nxy9k16oqUmG02QuDgXePDcRVY58QQyfE1-yj5sMuyrA17CDnpgXiF-2hfiLhvDoiewS8FnWV4GmZHIMXXuKc1P-CApX4pk0TMmY8ziKF-1vFLPTABbKT-Six7UmGNbT8AifuJmP6jXXOSU
        link = link.slice(link.indexOf('//'))
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
    if (slash1 - slash2 > 10) {
      return link.slice(0, slash1)
    }
    else {
      return link.slice(0, slash2)
    }
  },
  getImageElementSize: function (img) {
    /*
    console.log(img)
    console.log(img.width)
    console.log(img.height)
    if (typeof(img.width) !== undefined && isNaN(img.width) === false) {
      let size = parseInt(img.width, 10)
      console.log(size)
      if (typeof(img.height) !== undefined && isNaN(img.height) === false) {
        let height = parseInt(img.height, 10)
        console.log(height)
        size = Math.max(size, height)
      }
      return size
    }
    */
    if (typeof(img.width) !== 'function') {
      img = $(img)
    }
    if (typeof(img.attr('width')) !== 'undefined') {
      return parseInt(Math.max(img.attr('width'), img.attr('height')), 10)
    }
    return parseInt(Math.max(img.width(), img.height()), 10)
  },
  readyToResize: function (img) {
    let defaultSize = $v.EditorManager.imageSizeDefault
    //console.log(img)
    //console.log(defaultSize)
    //delete img.onload
    //$v.EditorManager.removeImageOnLoad()
    
    img = $(img)
    img.removeAttr('onload')
    
    let resize = this.calcResize(defaultSize, img)
    if (resize !== undefined) {
      img.attr('width', resize.width)
         .attr('height', resize.height)
    }
  },
  calcResize: function (defaultSize, width, height) {
    if (typeof(width.width) === 'function') {
      let img = width
      width = img.width()
      height = img.height()
    }
    
    if (width > defaultSize 
            || height > defaultSize) {
      // we have to resize them
      if (width > height) {
        height = Math.round(height * (defaultSize / width))
        width = Math.round(defaultSize)
      }
      else {
        width = Math.round(width * (defaultSize / height))
        height = Math.round(defaultSize)
      }
      return {
        width: width,
        height: height
      }
    }
  },
  isBloggerImageLink: function (link) {
    return (!link.startsWith('filesystem:') 
            && link.indexOf('.bp.blogspot.com/') > 1)
  },
  isFullSizeLink: function (link) {
    if (this.isBloggerImageLink(link)) {
      return (link.indexOf('/s' + this.size.full + '/') > 10)
    }
    else {
      return false
    }
  },
  removeProtocol: function (url) {
    if (typeof(url) === 'string' && url.indexOf('//') > 0) {
      url = url.slice(url.indexOf('//'))
    }
    return url
  },
  filterPostBody: function (postBody) {
    //console.log(postBody)
    if (ElectronHelper.isElectronEnvironment()) {
      postBody.find('a[href*=".bp.blogspot.com/"]').each((i, ele) => {
        ele.href = this.removeProtocol(ele.href)
      })
      postBody.find('img[src*=".bp.blogspot.com/"]').each((i, ele) => {
        ele.src = this.removeProtocol(ele.src)
      })
    }
    return postBody
  }
}

window.BloggerImageHelper = BloggerImageHelper

export default BloggerImageHelper