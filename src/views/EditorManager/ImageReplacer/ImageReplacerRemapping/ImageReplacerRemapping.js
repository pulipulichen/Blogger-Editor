/* global VueHelper, DayjsHelper, EventManager, FunctionHelper, BloggerImageHelper, FileSystemHelper, WindowHelper, FieldPostBody */

import FieldPostBody from './../../FieldPostBody.js'

var config = {
  //name: "main-content",
  props: [
    'imageHTML', 
    // 這裡還要一個現在未上傳圖片的對應
  ],
  data: function () {
    return {
      imageRemapList: [],
      postBodyImageList: [],
      currentPairingItem: null,
      currentPairingItemPost: null,
      selectedImageList: [],
      imageSize: {}
    }
  },
//  mounted: function () {
//    
//  },
  watch: {
    imageHTML () {
      this.buildImageRemapList()
      this.buildFieldPostBodyImageList()
      
      this.checkOneImagePair()
    }
  },
  computed: {
    fullPaired () {
      //console.log(this.selectedImageList.length, this.postBodyImageList.length)
      return (this.selectedImageList.length === this.postBodyImageList.length)
    },
    postBodyImageListReverse () {
      return this.postBodyImageList.reverse()
    }
  },
  methods: {
    buildImageRemapList () {
      let html = this.imageHTML
      //console.log(html)
      if (!html) {
        return []
      }
      
      html = html.trim()
      
      let images = $(`<div>${this.imageHTML}</div>`)
      let list = []
      images.find('a[href] > img[src]').each((i, ele) => {
        list.push({
          mapPostBodyImage: null,
          url: ele.src,
          height: Number(ele.getAttribute('data-original-height')),
          width: Number(ele.getAttribute('data-original-width'))
        })
      })

      this.imageRemapList = list
      
      setTimeout(async () => {
        for (let i = 0; i < this.imageRemapList.length; i++) {
          // let url = this.imageRemapList[i].url
          // this.imageSize[url] = await this.getImageSizeInfo(this.postBodyImageList[i].url)
          this.imageRemapList[i].sizeInfo = await this.getImageSizeInfo(this.imageRemapList[i].url)
        }
        this.$forceUpdate();
      }, 0)
      
    },
    buildFieldPostBodyImageList () {
      let list = FieldPostBody.getImageList()
      
      this.postBodyImageList = []
      list.map(url => {
        if (!url.startsWith('filesystem:')) {
          return false
        }
        
        let filename = url.slice(url.lastIndexOf('/') + 1)
        this.postBodyImageList.push({
          filename,
          url
        })
      })

      setTimeout(async () => {
        for (let i = 0; i < this.postBodyImageList.length; i++) {
          // let url = this.postBodyImageList[i].url
          // this.imageSize[url] = await this.getImageSizeInfo(this.postBodyImageList[i].url)
          this.postBodyImageList[i].sizeInfo = await this.getImageSizeInfo(this.postBodyImageList[i].url)
        }
        this.$forceUpdate();
      }, 0)
      
      return true
    },
    getFilename (url) {
      return url.slice(url.lastIndexOf('/') + 1)
    },
    /*
    selectToPair (i) {
      if (this.currentPairingItem === i) {
        this.currentPairingItem = null
        return false
      }
      
      this.currentPairingItem = i
    },
    toPair (url) {
      if (this.currentPairingItem === null) {
        return false
      }
      
      this.imageRemapList[this.currentPairingItem].mapPostBodyImage = url
      
      this.currentPairingItem = null
      this.updateSelectedImageList()
    },
    */
    selectUploadedItem (uploadI) {
      if (this.currentPairingItemPost === null) {
        if (this.currentPairingItem === uploadI) {
          this.currentPairingItem = null
          return false
        }

        this.currentPairingItem = uploadI
      }
      else {
        this.imageRemapList[uploadI].mapPostBodyImage = this.postBodyImageList[this.currentPairingItemPost].url
        this.resetSelected()
      }
    },
    selectPostItem (postI) {
      if (this.currentPairingItem === null) {
        if (this.currentPairingItemPost === postI) {
          this.currentPairingItemPost = null
          return false
        }

        this.currentPairingItemPost = postI
      }
      else {
        this.imageRemapList[this.currentPairingItem].mapPostBodyImage = this.postBodyImageList[postI].url
        this.resetSelected()
      }
    },
    updateSelectedImageList () {
      
      this.selectedImageList = []
      this.imageRemapList.forEach(item => {
        if (item.mapPostBodyImage
                && this.selectedImageList.indexOf(item.mapPostBodyImage) === -1) {
          this.selectedImageList.push(item.mapPostBodyImage)
        }
      })
      // selectedImageList
      
      // console.log(this.imageRemapList)
    },
    previewImage(url) {
      WindowHelper.popup(url, this.getFilename(url))
    },
    getImageList () {
      let output = {}
      this.imageRemapList.forEach(item => {
        if (item.mapPostBodyImage) {
          let filename = this.getFilename(item.mapPostBodyImage)
          output[filename] = item.url
        }
      })
      return output
    },
    resetSelected () {
      this.updateSelectedImageList()
      this.currentPairingItemPost = null
      this.currentPairingItem = null
    },
    resetPairred () {
      this.imageRemapList[this.currentPairingItem].mapPostBodyImage = null
      this.resetSelected()
    },
    checkOneImagePair () {
      if (this.imageRemapList.length === 1 && 
          this.imageRemapList.length === this.postBodyImageList.length) {
        this.imageRemapList[0].mapPostBodyImage = this.postBodyImageList[0].url
        this.updateSelectedImageList()
      }
    },
    getImageSizeInfo: async function (url) {
      let {width, height, ratio} = await this.getImageSizePromise(url)
      return `${width} / ${height} (${ratio})`
    },
    getImageSizePromise (url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
          let ratio = (this.width / this.height)
          ratio = Math.round(ratio * 100) / 100
          resolve({ width: this.width, height: this.height, ratio  });
        };
        img.onerror = function() {
          reject(new Error('Failed to load image'));
        };
        img.src = url;
      });
    }
  }
}

//window.EditorManager = EditorManager
export default config