import dayjs from 'dayjs'
var PostManager = {
  //name: "main-content",
  data: function () {
    return {
      ui: undefined,
      posts: [],
      filterCondition: '',
      filteredPosts: [],
      createTableDone: false,
      editingPostId: null,
      //uploadImageDraft: '',
      //disableUploadImageDraft: true
    }
  },
  mounted() {
    if (localStorage.getItem('editingPostId')) {
      try {
        this.editingPostId = localStorage.getItem('editingPostId');
      } catch(e) {
        localStorage.removeItem('editingPostId');
      }
    }
  },
  created: function () {
    //return
    $(() => {
      this.getUI().find('.close.icon:first').click(() => {
        //console.log(1)
        this.close()
      })
      
      this.init()
      
      //this.open()
    })   
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = this.ui = $('.PostManager.ui.modal')
      }
      return this.ui
    },
    createTable: function () {
      if (this.createTableDone === true) {
        return
      }
      else {
        this.createTableDone = true
      }
      let sql = `Create Table posts
        (id INTEGER PRIMARY KEY, 
         createUnix INTEGER, 
         updateUnix INTEGER, 
         title TEXT, 
         labels TEXT, 
         abstract TEXT,
         thumbnail TEXT)`
      //console.log(sql)
      WebSQLDatabaseHelper.exec(sql)     
    },
    init: function (callback) {
      this.createTable()
      //this.checkTableIsEmpty()
      //return
      
      let sql = 'select * from posts order by updateUnix desc'
      //console.log(sql)
      WebSQLDatabaseHelper.exec(sql, (rows) => {
        //console.log(rows.length)
        this.posts = []
        if (rows.length > 0) {
          for (let i = 0; i < rows.length; i++) {
            let item = rows.item(i)
            this.posts.push(item)
          }
          //console.log(this.posts)
          //this.filteredPosts = this.posts
          
          //console.log(rows.length)
          
          this.filterPosts()
          FunctionHelper.triggerCallback(callback)
        }
        else {
          this.createPost(callback)
        }
      })
    },
    checkTableIsEmpty: function (callback) {
      let sql = 'select count(*) as count from posts'
      WebSQLDatabaseHelper.exec(sql, (rows) => {
        //console.log(rows)
        FunctionHelper.triggerCallback(callback)
      })
    },
    createPost: function (callback) {
      let unix = dayjs(new Date()).unix()
      let title = 'This is a title'
      let abstract = 'balabala'
      let labels = 'D'
      let thumbnail = 'icon.png'
      
      //let sql = 'insert into posts(createUnix, updateUnix, title, labels, abstract, thumbnail) values(?,?,?,?,?,?)'
      WebSQLDatabaseHelper.exec(sql, [unix, unix, title, labels, abstract, thumbnail], (rows) => {
        this.getLastUpdatePost((post) => {
          //console.log(post.id)
          this.posts = [post].concat(this.posts)
          this.editingPostId = post.id
          this.persist()
          this.filterPosts()
          FunctionHelper.triggerCallback(callback, post)
        })
      })
    },
    getLastUpdatePost: function (callback) {
      let sql = 'select * from posts order by id desc limit 0, 1'
      WebSQLDatabaseHelper.exec(sql, (rows) => {
        if (rows.length > 0) {
          rows = rows.item(0)
        }
        else {
          rows = undefined
        }
        FunctionHelper.triggerCallback(callback, rows)
      })
    },
    newPost: function (callback) {
      this.createPost(callback)
    },
    getEditingPostId: function (callback) {
      if (typeof(this.editingPostId) === 'number') {
        FunctionHelper.triggerCallback(callback, this.editingPostId)
      }
      else {
        this.getLastUpdatePost((post) => {
          this.editingPostId = post.id
          this.persist()
          FunctionHelper.triggerCallback(callback, this.editingPostId)
        })
      }
    },
    getPost: function (id, callback) {
      if (typeof(id) === 'function') {
        callback = id
        id = undefined
      }
      
      let post
      if (id === undefined) {
        //id = this.editingPostId
        this.getEditingPostId((id) => {
          post = this.posts.filter((post) => post.id === id)[0]
          FunctionHelper.triggerCallback(callback, post)
        })
      }
      else {
        post = this.posts.filter((post) => post.id === id)[0]
        FunctionHelper.triggerCallback(callback, post)
      }
      
      //return this.posts.filter((post) => post.id === id)[0]
    },
    getPostBody: function (id, callback) {
      if (typeof(id) === 'function') {
        callback = id
        id = undefined
      }
      
      let retrievePostBody = (id) => {
        let path = `/${id}/postBody.html`
        let fsPath = FileSystemHelper.getFileSystemUrl(path)
        //FileSystemHelper.read(path, (postBody) => {
        console.log(fsPath)
        $.get(fsPath, (postBody) => {
          if (postBody === undefined) {
            postBody = ''
          }
          console.log(['getPostBody', postBody])
          FunctionHelper.triggerCallback(callback, postBody)
        })
      }
      
      if (id === undefined) {
        //id = this.editingPostId
        this.getEditingPostId(retrievePostBody)
      }
      else {
        retrievePostBody(id)
      }
    },
    editPost: function (id, callback) {
      //console.log(this.getPost(id))
      //FunctionHelper.triggerCallback(callback)
      this.getPost(id, (post) => {
        console.log(post)
        FunctionHelper.triggerCallback(callback)
      })
    },
    removePost: function (id, callback) {
      //console.log(id)
      if (window.confirm(`Are you sure to delete #${id}`)) {
        id = parseInt(id, 10)
        
        this.posts = this.posts.filter(post => post.id !== id)
        this.filterPosts()
        
        let sql = `DELETE FROM posts WHERE id=${id}`
        WebSQLDatabaseHelper.exec(sql)
      }
      FunctionHelper.triggerCallback(callback)
    },
    updateEditingPost: function (field, value, callback) {
      this.getPost((post) => {
        console.log([field, post[field], value])
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
      postBody = postBody.trim()
      let postBodyObject = $(postBody)
      let abstract = postBodyObject.text()
      if (abstract.length > 100) {
        abstract = abstract.slice(0, 100) + '...'
      }
      
      //let sql = 'insert into posts(createUnix, updateUnix, title, labels, abstract, thumbnail) values(?,?,?,?,?,?)'
      let thumbnail = null
      let img = postBodyObject.find('img:first')
      if (img.length > 0) {
        thumbnail = img.attr('src') 
      }
      
      this.getPost((post) => {
        post.abstract = abstract
        post.thumbnail = thumbnail
        
        this.update(post, () => {
          let id = post.id
          let path = `/${id}/postBody.html`
          FileSystemHelper.write(path, postBody, () => {
            FunctionHelper.triggerCallback(callback, post)
          })
        })
      })
    },
    update: function (post, callback) {
      let id = post.id 
      
      let unix = dayjs(new Date()).unix()
      let title = post.title
      let labels = post.labels
      let abstract = post.abstract
      let thumbnail = post.thumbnail
      
      //let sql = 'insert into posts(createUnix, updateUnix, title, labels, abstract, thumbnail) values(?,?,?,?,?,?)'
      
      let sql = `UPDATE posts SET 
        updateUnix = ?,
        title = ?,
        labels = ?,
        abstract = ?,
        thumbnail =?
        WHERE id = ${id}`
      //console.log(sql)
      
      WebSQLDatabaseHelper.exec(sql, [
        unix,
        title,
        labels,
        abstract,
        thumbnail
      ], () => {
        FunctionHelper.triggerCallback(callback, post)
      })
    },
    open: function () {
      //console.log(this.data)
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    },
    persist() {
      localStorage.editingPostId = this.editingPostId;
      //console.log('now pretend I did more stuff...');
    },
    displayDate: function (unix) {
      //return dayjs(unix * 1000).format('YYYY MM/DD HH:mm')
      return dayjs(unix * 1000).format('MM/DD hh:mm')
    },
    filterPosts: function () {
      if (typeof(this.filterCondition) !== 'string' 
              || this.filterCondition.trim() === '') {
        this.filteredPosts = this.posts
        return
      }
      
      let conds = this.filterCondition.trim().split(' ')
      this.filteredPosts = []
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
          this.filteredPosts.push(post)
        }
      })
    }
  }
}

window.PostManager = PostManager
export default PostManager