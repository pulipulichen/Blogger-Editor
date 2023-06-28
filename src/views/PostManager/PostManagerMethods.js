import PostManagerMethodsPosts from './PostManagerMethodsPosts.js'

export default function (app) {
  if (!app.methods) {
    app.methods = {}
  }

  
  app.methods.getUI = function () {
    if (typeof(this.ui) === 'undefined') {
      //console.log('find ui')
      this.ui = $(this.$refs.modal)
      this.ui.find('.ui.progress').progress()
    }
    return this.ui
  }
  app.methods.init = function (callback) {
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
  }
  
  app.methods.getEditingPostId = function (callback) {
    if (isNaN(this.editingPostId) === false 
            && typeof(this.editingPostId) === 'number') {
      FunctionHelper.triggerCallback(callback, this.editingPostId)
    }
    else {
      this.PostManagerDatabase.getLastUpdatePost((post) => {
        this.editingPostId = post.id
        EventManager.trigger(this, 'changeEditingPostId')
        this.persist()
        FunctionHelper.triggerCallback(callback, this.editingPostId)
      })
    }
  }
  app.methods.getPost = function (id, callback) {
    //console.log(['getPost', this.editingPostId, PostManager.editingPostId])
    if (typeof(id) === 'function') {
      callback = id
      id = undefined
    }
    
    if (id === undefined) {
      id = this.editingPostId
    }
    let post = this.posts.filter((post) => post.id === id)[0]
    
    if (post === undefined) {
      post = this.posts[0]
      this.editingPostId = post.id
      EventManager.trigger(this, 'changeEditingPostId')
      this.persist()
    }
    
    FunctionHelper.triggerCallback(callback, post)
    return post
    
    //return this.posts.filter((post) => post.id === id)[0]
  }

  app.methods.getPostAsync = function (id) {
    return new Promise((resolve, reject) => {
      this.getPost(id, (post) => {
        resolve(post)
      })
    })
  }

  app.methods.getPostBody = function (id, callback) {
    if (typeof(id) === 'function') {
      callback = id
      id = undefined
    }
    
    if (id === undefined) {
      id = this.editingPostId
    }
    this.PostManagerFile.getPostBody(id, callback)
  }

  app.methods.getPostBodyAsync = function (id) {
    return new Promise((resolve, reject) => {
      this.getPostBody(id, (...result) => {
        // console.log(result);
        if (Array.isArray(result) && result.length === 1) {
          result = result[0]
        }
        resolve(result)
      })
    })
  }


  app.methods.createPostBodyFile = function (id, content, callback) {
    if (typeof(content) === 'function') {
      callback = content
      content = ''
    }
    
    this.PostManagerFile.createPostBodyFile(id, content, () => {
      EventManager.trigger(this, 'createPostBodyFile')
      FunctionHelper.triggerCallback(callback)
    })
  }
  app.methods.writePostBodyFile = function (id, content, callback) {
    if (typeof(content) === 'function') {
      callback = content
      content = ''
    }
    
    this.PostManagerFile.writePostBodyFile(id, content, () => {
      EventManager.trigger(this, 'createPostBodyFile')
      FunctionHelper.triggerCallback(callback)
    })
  }
  
  
  app.methods.updateEditingPost = function (field, value, callback) {
    // console.log(field, value)

    this.getPost((post) => {
      //if (field === "timeSpentSecond") {
      //  console.trace([field, post[field], value])
      //}
      //console.log([field, post[field], value])
      
      /*
      if (typeof(value) === "string" && value.endsWith('&nbsp;')) {
        value = value.slice(0, -6)
      }
      */
      
      if (post[field] !== value) {
        post[field] = value
        this.update(post, callback)
        GoogleAnalyticsHelper.send('PostManager.updateEditingPost', {
          field: field,
          value: value
        })
      }
      else {
        FunctionHelper.triggerCallback(callback, post)
      }
    })
  }
  app.methods.updateEditingPostBody = function (postBody, callback) {
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
  }
  app.methods.update = function (post, callback) {
    return this.PostManagerDatabase.updatePost(post, callback)
  }
  app.methods.open = function () {
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
  }
  app.methods.close = function () {
    this.getUI().modal('hide')
    EventManager.trigger(this, 'close')
  }

  app.methods.persist = function () {
    //this.getEditingPostId((id) => {
    //  localStorage.editingPostId = id
    //})
    //localStorage.editingPostId = this.editingPostId
    VueHelper.persistLocalStorage(this, 'editingPostId')
    
    //console.log('now pretend I did more stuff...');
  }
  /*
  forceRerender = function () {
    if (this.componentRerenderKey === undefined) {
      this.componentRerenderKey = 0
    }
    //console.log('forceRerender 1: ',  this.componentRerenderKey)
    this.componentRerenderKey += 1;
    //console.log('forceRerender 2: ',  this.componentRerenderKey)
  }
  */
  app.methods.displayDate = function (unix) {
    return DayjsHelper.postDate(unix)
  }
  app.methods.backupPost = function (id, callback) {
    if (typeof(id) === 'undefined' 
            || typeof(id) === 'function') {
      callback = id
      id = this.editingPostId
    }
    
    this.getPostAndPostBody(id, (post, postBody) => {
      this.PostManagerBackup.backupPost(post, postBody, callback)
    })
    return this
  }
  app.methods.getPostAndPostBody = function (id, callback) {
    this.getPost(id, (post) => {
      this.getPostBody(id, (postBody) => {
        FunctionHelper.triggerCallback(callback, post, postBody)
      })
    })
  }
  app.methods.createBackupZip = function (id, callback) {
    if (typeof(id) === 'undefined' 
            || typeof(id) === 'function') {
      callback = id
      id = this.editingPostId
    }
    
    this.getPost(id, post => {
      this.getPostBody(id, postBody => {
        this.PostManagerBackup.createBackupZip(post, postBody, cabllback)
      })
    })
  }
  
  app.methods.backupAllPosts = function (callback) {
    this.PostManagerBackup.backupAllPosts(callback)
  }
  app.methods.triggerUploadPosts = function (e) {
    //FileHelper.triggerInput(e)
    this.uploadPostId = parseInt(e.target['data-post-id'], 10)
    //console.log($(e.target).parent.attr('data-post-id'))
    let target = $(e.target)
    if (target.attr('data-post-id') === undefined) {
      target = target.parents('[data-post-id]:first')
    }
    this.uploadPostId = parseInt(target.attr('data-post-id'), 10)
    //console.log(this.uploadPostId)
    this.getUI().find('input:file[name="uploadPosts"]').click()
    return this
  }
  app.methods.uploadPosts = function (e, postId, callback) {
    if (postId === undefined) {
      postId = this.uploadPostId
    }
    return this.PostManagerBackup.uploadPosts(e, postId, (post) => {
      //console.log(post)
      if (postId === this.editingPostId) {
        $v.EditorManager.setupPostData(() => {
          FunctionHelper.triggerCallback(callback, post)
        })
      }
      else {
        FunctionHelper.triggerCallback(callback, post)
      }
      this.resetUploadInput()
    })
  }
  app.methods.resetUploadInput = function () {
    this.getUI().find('input:file[name="uploadPosts"]').val('')
  }
  app.methods.dropPosts = function (e, postId, callback) {
    if (postId === undefined) {
      postId = this.uploadPostId
    }
    return this.PostManagerBackup.dropPosts(e, postId, callback)
  }
  app.methods.readPostsZip = function (files) {
    this.PostManagerDatabase.getLastPostId(id => {
      id++
      this.PostManagerBackup.readPostsZip(id, files)
    })
  }
  app.methods.readAllPostsZip = function (zip, callback) {
    this.PostManagerBackup.readAllPostsZip(zip, callback)
  }
  app.methods.readSinglePostZip = function (zip, callback) {
    this.PostManagerBackup.readSinglePostZip(zip, callback)
  }
  app.methods.clonePost = function (id, callback) {
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
  }
  app.methods.formatLabels = function (labels) {
    if (typeof(labels) === 'string') {
      labels = labels.trim()
      if (labels.endsWith(',')) {
        labels = labels.slice(0, -1)
      }
    }
    return labels
  }

  PostManagerMethodsPosts(app)
}