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
      selectedImageList: []
    }
  },
  mounted: function () {
    
  },
  watch: {
    imageHTML () {
      this.imageRemapList = this.htmlImageList.map(url => {
        return {
          url,
          mapPostBodyImage: null
        }
      })
      
      this.buildFieldPostBodyImageList()
    }
  },
  computed: {
    htmlImageList () {
      let html = this.imageHTML
      //console.log(html)
      if (!html) {
        return []
      }
      
      html = html.trim()
      
      let images = $(`<div>${this.imageHTML}</div>`)
      let list = []
      images.find('a[href] > img[src]').each((i, ele) => {
        list.push(ele.src)
      })
      
      return list
    }
  },
  created: function () {
    
  },
  methods: {
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
      
      return true
    },
    getFilename (url) {
      return url.slice(url.lastIndexOf('/') + 1)
    },
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
    updateSelectedImageList () {
      this.selectedImageList = []
      this.imageRemapList.forEach(item => {
        if (item.mapPostBodyImage
                && this.selectedImageList.indexOf(item.mapPostBodyImage) === -1) {
          this.selectedImageList.push(item.mapPostBodyImage)
        }
      })
      // selectedImageList
    },
    previewImage(url) {
      WindowHelper.popup(url, this.getFilename(url))
    }
  }
}

//window.EditorManager = EditorManager
export default config