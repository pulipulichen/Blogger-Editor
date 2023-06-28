/* global FunctionHelper, EventManager, FileSystemHelper, VueHelper, DayjsHelper, GoogleAnalyticsHelper, WindowHelper */

import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'

import PostManagerDatabase from './PostManagerDatabase.js'
import PostManagerBackup from './PostManagerBackup.js'
import PostManagerFile from './PostManagerFile.js'

let PostManager = {
  data: function () {
    return {
      name: 'PostManager',
      ui: undefined,
      componentRerenderKey: 0,
      posts: [],
      filterCondition: '',
      filteredPosts: [],
      createTableDone: false,
      editingPostId: null,
      uploadPostId: null,
      //uploadImageDraft: '',
      //disableUploadImageDraft: true,
      quotaUsed: 0,
      quotaTotal: FileSystemHelper.quota,
      //enableRemovePost: true,
      quotaProgressBar: null,
      
      PostManagerDatabase: PostManagerDatabase,
      PostManagerBackup: PostManagerBackup,
      PostManagerFile: PostManagerFile
    }
  },
  mounted() {
    VueHelper.mountLocalStorageInt(this, 'editingPostId')
    //console.log('mount editingPostId')
    //console.log(this.editingPostId)
  },
  created: function () {
    //return
    //$(() => {
      //this.getUI().find('.close.icon:first').click(() => {
      //  //console.log(1)
      //  this.close()
      //})
      
    //this.init()
      
      //this.open()
    //})
    $v.PostManager = this
    //console.log(this.editingPostId)
  },
  computed: {
    quotaUsage: function () {
      let usage = Math.round( (this.quotaUsed / this.quotaTotal) * 100 )
      //this.getUI().find('.ui.progress > .bar').css('width', `${usage}%`)
      if (this.ui !== undefined
              && this.quotaProgressBar === null) {
        this.quotaProgressBar = this.ui.find('.ui.progress > .bar')
      }
      if (this.quotaProgressBar !== null) {
        this.quotaProgressBar.css('width', `${usage}%`)
      }
      return usage
    },
    quotaUsedMB: function () {
      let data = this.quotaUsed / 1024 / 1024
      data = Math.round(data * 100) / 100
      return data
    },
    quotaTotalMB: function () {
      let data = this.quotaTotal / 1024 / 1024
      data = Math.round(data * 100) / 100
      return data
    },
    enableRemovePost: function () {
      return (this.posts.length > 1)
    },
    filterPosts: function () {
      let filteredPosts = []
      if (typeof(this.filterCondition) !== 'string' 
              || this.filterCondition.trim() === '') {
        filteredPosts = this.posts
        //this.forceRerender()
        return filteredPosts
      }
      
      let conds = this.filterCondition.trim().split(' ')
      //filteredPosts = []
      this.posts.forEach((post) => {
        let match = false
        conds.forEach(cond => {
          if (match === true) {
            return
          }
          
          if (post.title.indexOf(cond) > -1
                  || post.abstract.indexOf(cond) > -1
                  || post.labels.indexOf(cond) > -1) {
            match = true
          }
        })
        
        if (match === true) {
          filteredPosts.push(post)
        }
      })  // this.posts.forEach((post) => {
      
      //this.forceRerender() 
      return filteredPosts
    },
  },
  methods: {
    // PostManagerMethods.js
  }
}

import PostManagerMethods from './PostManagerMethods.js'
PostManagerMethods(PostManager)

//window.PostManager = PostManager
export default PostManager
