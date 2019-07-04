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
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
        this.ui.find('.ui.progress').progress()
      }
      return this.ui
    },
    init: function (callback) {
      this.PostManagerFile.init(this)
      this.PostManagerBackup.init(this)
      this.PostManagerDatabase.createTable()
      //this.checkTableIsEmpty()
      //return
      
      this.PostManagerDatabase.retrieveAllPost((posts) => {
        //console.log(rows.length)
        this.posts = posts
        if (posts.length > 0) {
          //this.enableRemovePost = (this.posts.length > 1)
          
          //this.filterPosts()
          //console.log(this.filteredPosts)
          FunctionHelper.triggerCallback(callback)
        }
        else {
          //console.log('建立post')
          this.createPost(callback)
        }
      })
    },
    createPost: function (post, callback) {
      if (typeof(post) === 'function') {
        callback = post
        post = undefined
      }
      
      let mode = 'create'
      if (typeof(post.id) === 'number') {
        mode = 'update'
      }
      
      //console.trace("createPost")
      return this.PostManagerDatabase.createPost(post, (post) => {
        //console.log("建立成功")
        //console.log(post)
        if (mode === 'create') {
          this.posts = [post].concat(this.posts)
          if (post !== null) {
            this.editingPostId = post.id
          }
        }
        else {
          this.posts[(this.posts.length - 1)] = post
          console.log(this.posts)
          this.filterCondition = 'l'
        }
        this.persist()
        //this.filterPosts()

        //this.enableRemovePost = (this.posts.length > 1)
        FunctionHelper.triggerCallback(callback, post)
      })
    },
    newPost: function (callback) {
      this.createPost(callback)
      
      setTimeout(() => {
        let post = this.posts[0]
        this.editingPostId = post.id
        this.openPost(post.id)
      }, 500)
    },
    getEditingPostId: function (callback) {
      if (isNaN(this.editingPostId) === false 
              && typeof(this.editingPostId) === 'number') {
        FunctionHelper.triggerCallback(callback, this.editingPostId)
      }
      else {
        this.PostManagerDatabase.getLastUpdatePost((post) => {
          this.editingPostId = post.id
          this.persist()
          FunctionHelper.triggerCallback(callback, this.editingPostId)
        })
      }
    },
    getPost: function (id, callback) {
      //console.log(['getPost', this.editingPostId, PostManager.editingPostId])
      if (typeof(id) === 'function') {
        callback = id
        id = undefined
      }
      
      if (id === undefined) {
        id = this.editingPostId
      }
      let post = this.posts.filter((post) => post.id === id)[0]
      
      FunctionHelper.triggerCallback(callback, post)
      return post
      
      //return this.posts.filter((post) => post.id === id)[0]
    },
    getPostBody: function (id, callback) {
      if (typeof(id) === 'function') {
        callback = id
        id = undefined
      }
      
      if (id === undefined) {
        id = this.editingPostId
      }
      this.PostManagerFile.getPostBody(id, callback)
    },
    createPostBodyFile: function (id, content, callback) {
      if (typeof(content) === 'function') {
        callback = content
        content = ''
      }
      
      this.PostManagerFile.createPostBodyFile(id, content, () => {
        EventManager.trigger(this, 'createPostBodyFile')
        FunctionHelper.triggerCallback(callback)
      })
    },
    openPost: function (id, callback) {
      //console.log(this.getPost(id))
      //FunctionHelper.triggerCallback(callback)
      
      this.editingPostId = id
      //PostManager.editingPostId = parseInt(id, 10)
      //console.log([this.editingPostId, PostManager.editingPostId])
      this.persist()
      
      //this.getPost(id, (post) => {
        //console.log(post)
        //FunctionHelper.triggerCallback(callback)
      //})
      $v.EditorManager.setupPostData(() => {
        this.close()
        FunctionHelper.triggerCallback(callback)
      })
    },
    removePost: function (id, callback) {
      //console.log(id)
      let message = this.$t('Are you sure to delete post')
      message = message + ` #${id}`
      WindowHelper.confirm(message, () => {
        id = parseInt(id, 10)
        
        this.posts = this.posts.filter(post => post.id !== id)
        //this.filterPosts()
        
        this.PostManagerDatabase.removePost(id)
        this.PostManagerFile.removePost(id)
        
        if (this.editingPostId === id) {
          this.editingPostId = null
          this.persist()
        }
      })
    },
    updateEditingPost: function (field, value, callback) {
      this.getPost((post) => {
        //console.log([field, post[field], value])
        
        if (post[field] !== value) {
          post[field] = value
          this.update(post, callback)
        }
        else {
          FunctionHelper.triggerCallback(callback, post)
        }
      })
    },
    updateEditingPostBody: function (postBody, callback) {
      if (ConfigHelper.get('debug').disableEditorManager === true) {
        return FunctionHelper.triggerCallback(callback)
      }
      
      //if ($v.EditorManager.OutlineNavigator !== null) {
        //console.log('$v.EditorManager.OutlineNavigator.analyseHeadings()')
        //$v.EditorManager.OutlineNavigator.analyseHeadings()
      //}
      let {abstract, thumbnail} = this.PostManagerFile.extractPostBodyFeatures(postBody)
      
      //console.log(['updateEditingPostBody'])
      this.getPost((post) => {
        //console.log(['updateEditingPostBody 2', post.id])
        
        post.abstract = abstract
        post.thumbnail = thumbnail
        
        this.update(post, () => {
          let id = post.id
          this.PostManagerFile.writePostBody(id, postBody, () => {
            EventManager.trigger(this, 'updateEditingPostBody')
            FunctionHelper.triggerCallback(callback, post)
          })
        })
      })
    },
    update: function (post, callback) {
      return this.PostManagerDatabase.updatePost(post, callback)
    },
    open: function () {
      //console.log(this.data)
      
      //if (typeof($v.EditorManager) !== 'undefined') {
        //$v.EditorManager.save()
        //this.PostManagerFile.statisticQuota(this)
      //}
      
      //this.getUI().find('.header:first').click()
      //this.init()
      this.getUI().modal('show')
      //this.init()
      //this.init(() => {
       // this.filterPosts()
      //})
      
      EventManager.trigger(this, 'open')
    },
    close: function () {
      this.getUI().modal('hide')
      EventManager.trigger(this, 'close')
    },
    persist() {
      //this.getEditingPostId((id) => {
      //  localStorage.editingPostId = id
      //})
      //localStorage.editingPostId = this.editingPostId
      VueHelper.persistLocalStorage(this, 'editingPostId')
      
      //console.log('now pretend I did more stuff...');
    },
    /*
    forceRerender: function () {
      if (this.componentRerenderKey === undefined) {
        this.componentRerenderKey = 0
      }
      //console.log('forceRerender 1: ',  this.componentRerenderKey)
      this.componentRerenderKey += 1;
      //console.log('forceRerender 2: ',  this.componentRerenderKey)
    },
    */
    displayDate: function (unix) {
      return DayjsHelper.postDate(unix)
    },
    backupPost: function (id, callback) {
      if (typeof(id) === 'undefined' 
              || typeof(id) === 'function') {
        callback = id
        id = this.editingPostId
      }
      
      this.getPostAndPostBody(id, (post, postBody) => {
        this.PostManagerBackup.backupPost(post, postBody, callback)
      })
      return this
    },
    getPostAndPostBody: function (id, callback) {
      this.getPost(id, (post) => {
        this.getPostBody(id, (postBody) => {
          FunctionHelper.triggerCallback(callback, post, postBody)
        })
      })
    },
    createBackupZip: function (id, callback) {
      if (typeof(id) === 'undefined' 
              || typeof(id) === 'function') {
        callback = id
        id = this.editingPostId
      }
      
      this.getPost(id, post => {
        this.getPostBody(id, postBody => {
          this.PostManagerBackup.createBackupZip(post, postBody, cabllack)
        })
      })
    },
    
    backupAllPosts: function (callback) {
      this.PostManagerBackup.backupAllPosts(callback)
    },
    triggerUploadPosts: function (e) {
      //FileHelper.triggerInput(e)
      this.uploadPostId = parseInt(e.target['data-post-id'], 10)
      //console.log($(e.target).parent.attr('data-post-id'))
      let target = $(e.target)
      if (target.attr('data-post-id') === undefined) {
        target = target.parents('[data-post-id]:first')
      }
      this.uploadPostId = parseInt(target.attr('data-post-id'), 10)
      console.log(this.uploadPostId)
      this.getUI().find('input:file[name="uploadPosts"]').click()
    },
    uploadPosts: function (e) {
      this.PostManagerBackup.uploadPosts(e, this.uploadPostId)
    },
    dropPosts: function (e) {
      this.PostManagerBackup.dropPosts(e)
    },
    readPostsZip: function (files) {
      this.PostManagerDatabase.getLastPostId(id => {
        id++
        this.PostManagerBackup.readPostsZip(id, files)
      })
    },
    readAllPostsZip: function (zip, callback) {
      this.PostManagerBackup.readAllPostsZip(zip, callback)
    },
    readSinglePostZip: function (zip, callback) {
      this.PostManagerBackup.readSinglePostZip(zip, callback)
    },
    clonePost: function (id, callback) {
      $v.PageLoader.open(() => {
        //console.log('clonePost', id)
        this.getPostBody(id, (postBody) => {
          //console.log('getPostboy')
          this.getPost(id, (post) => {
            //console.log('getPost')
            post = JSON.parse(JSON.stringify(post))
            delete post.id
            this.createPost(post, (post) => {
              //console.log('createPost')
              let postId = post.id
              this.createPostBodyFile(postId, postBody, () => {
                //console.log('createPostBodyFile')
                //this.statisticQuota()
                
                EventManager.trigger(this, 'clonePost')
                
                $v.PageLoader.close(callback)
                
                //FunctionHelper.triggerCallback(callback)
              })
            })
          })
        })
      })
    },
    formatLabels: function (labels) {
      if (typeof(labels) === 'string') {
        labels = labels.trim()
        if (labels.endsWith(',')) {
          labels = labels.slice(0, -1)
        }
      }
      return labels
    }
  }
}

//window.PostManager = PostManager
export default PostManager
