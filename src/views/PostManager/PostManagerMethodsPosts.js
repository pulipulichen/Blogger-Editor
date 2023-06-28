export default function (app) {
  if (!app.methods) {
    app.methods = {}
  }

  app.methods.createPost = function (post, callback) {
    if (typeof(post) === 'function') {
      callback = post
      post = undefined
    }
    
    //console.trace("createPost")
    return this.PostManagerDatabase.createPost(post, (post) => {
      //console.log("建立成功")
      //console.log(post)
      this.posts = [post].concat(this.posts)
      if (post !== null) {
        this.editingPostId = post.id
        EventManager.trigger(this, 'changeEditingPostId')
      }
      this.openPost(post.id)
      this.persist()
      //this.filterPosts()

      //this.enableRemovePost = (this.posts.length > 1)
      FunctionHelper.triggerCallback(callback, post)
    })
  }

  app.methods.updatePost = function (post, callback) {
    return this.PostManagerDatabase.updatePost(post, (post) => {
      for (let i = 0; i < this.posts.length; i++) {
        let existedPost = this.posts[i]
        if (existedPost.id === post.id) {
          for (let key in existedPost) {
            if (key === 'id') {
              continue
            }
            existedPost[key] = post[key]
          }

          if (post.id === this.editingPostId) {
            this.openPost(post.id)
          }
          break
        }
      }
      FunctionHelper.triggerCallback(callback, post)
    })
  }

  app.methods.newPost = function (callback) {
    let fieldPostTitle = $v.EditorManager.FieldPostTitle
    let postTitle = fieldPostTitle.getText()
    if (postTitle === '') {
      return false
    }

    this.createPost(callback)
    
    setTimeout(() => {
      let post = this.posts[0]
      this.editingPostId = post.id
      EventManager.trigger(this, 'changeEditingPostId')
      this.openPost(post.id)
    }, 500)
  }

  app.methods.openPost = function (id, callback) {
    //console.log(this.getPost(id))
    //FunctionHelper.triggerCallback(callback)
    
    this.editingPostId = id
    EventManager.trigger(this, 'changeEditingPostId')
    
    // 幫我把這個item挪到最高去
    // https://stackoverflow.com/a/23921775/6645399
    //var first = "role";
    this.posts.sort( function (x,y) { 
      return x.id === id ? -1 : y.id === id ? 1 : 0; 
    })
    
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
  }

  app.methods.removePost = function (id, callback) {
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
        EventManager.trigger(this, 'changeEditingPostId')
        this.persist()
      }
    })
  }

  app.methods.previewPost = async function (id) {
    if (!id) {
      id = this.editingPostId
    }
    let name = `preview_post_${id}`

    let post = await this.getPostAsync(id)
    let title = post.title
    title = `#${id} ${title}`
    let postBody = await this.getPostBodyAsync(id)

    postBody = `<h1>${title}</h1>
${postBody}`

    // console.log({name, title})
    // console.log('title', title)
    // console.log('postBody', postBody)
    WindowHelper.createNewWindow(name, title, postBody)
  }
}