/* global VueHelper, DayjsHelper, EventManager, FunctionHelper, BloggerImageHelper, FileSystemHelper, WindowHelper */

var config = {
  //name: "main-content",
  props: [
    'imageHTML', 
    // 這裡還要一個現在未上傳圖片的對應
  ],
  data: function () {
    return {
      
    }
  },
  mounted: function () {
    
  },
  computed: {
    htmlImageList () {
      let html = this.imageHTML
      console.log(html)
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
    
  }
}

//window.EditorManager = EditorManager
export default config