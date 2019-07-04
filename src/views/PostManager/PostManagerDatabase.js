let PostManagerDatabase = {
  createTableDone: false,
  createTable: function () {
    if (this.createTableDone === true) {
      return
    } else {
      this.createTableDone = true
    }
    let sql = `Create Table if not exists posts
        (id INTEGER PRIMARY KEY, 
         createUnix INTEGER, 
         updateUnix INTEGER, 
         timeSpentSecond INTEGER, 
         title TEXT, 
         labels TEXT, 
         abstract TEXT,
         thumbnail TEXT,
         editURL TEXT,
         publicURL TEXT)`
    //console.log(sql)
    WebSQLDatabaseHelper.exec(sql)
  },
  updatePost: function (post, callback) {
    let id = post.id

    let unix = DayjsHelper.unix()
    let title = post.title
    let labels = post.labels
    let abstract = post.abstract
    let thumbnail = post.thumbnail
    let editURL = post.editURL
    let publicURL = post.publicURL
    let timeSpentSecond = post.timeSpentSecond

    //let sql = 'insert into posts(createUnix, updateUnix, title, labels, abstract, thumbnail) values(?,?,?,?,?,?)'

    let sql = `UPDATE posts SET 
        updateUnix = ?,
        title = ?,
        labels = ?,
        abstract = ?,
        thumbnail = ?,
        editURL = ?,
        publicURL = ?,
        timeSpentSecond = ?
        WHERE id = ${id}`
    //console.log(sql)

    let data = [
      unix,
      title,
      labels,
      abstract,
      thumbnail,
      editURL,
      publicURL,
      timeSpentSecond
    ]
    //console.log(data)

    WebSQLDatabaseHelper.exec(sql, data, () => {
      FunctionHelper.triggerCallback(callback, post)
    })
  },
  checkTableIsEmpty: function (callback) {
    let sql = 'select count(*) as count from posts'
    WebSQLDatabaseHelper.exec(sql, (rows) => {
      //console.log(rows)
      FunctionHelper.triggerCallback(callback)
    })
  },
  createPost: function (post, callback) {
    if (typeof (post) === 'function') {
      callback = post
      post = null
    }
    //console.log(post)
    
    if (typeof(post.id) === 'number') {
      return this.updatePost(post, callback)
    }

    let postId
    let unix = DayjsHelper.unix()
    let title = ''
    let abstract = ''
    let labels = ''
    let thumbnail = ''
    let editURL = ''
    let publicURL = ''
    let timeSpentSecond = 0
    let sql = `insert into 
                  posts(createUnix, updateUnix, timeSpentSecond, title, labels, abstract, thumbnail, editURL, publicURL) 
                  values(?,?,?,?,?,?,?,?,?)`
    let data = [unix, unix, timeSpentSecond, title, labels, abstract, thumbnail, editURL, publicURL]
    
    //console.log(sql)
    //console.log(data)

    if (post !== null
            && typeof (post) === 'object') {
      
      if (typeof (post.id) === 'number') {
        postId = post.id
      }
      if (typeof (post.title) === 'string') {
        title = post.title
      }
      if (typeof (post.abstract) === 'string') {
        abstract = post.abstract
      }
      if (typeof (post.labels) === 'string') {
        labels = post.labels
      }
      if (typeof (post.thumbnail) === 'string') {
        thumbnail = post.thumbnail
      }
      if (typeof (post.editURL) === 'string') {
        editURL = post.editURL
      }
      if (typeof (post.publicURL) === 'string') {
        publicURL = post.publicURL
      }
      if (typeof (post.timeSpentSecond) === 'number') {
        timeSpentSecond = post.timeSpentSecond
      }

      if (typeof (post.id) === 'number') {
        sql = `insert into 
                  posts(id, createUnix, updateUnix, timeSpentSecond, title, labels, abstract, thumbnail, editURL, publicURL) 
                  values(?,?,?,?,?,?,?,?,?,?)`
        data = [postId, unix, unix, timeSpentSecond, title, labels, abstract, thumbnail, editURL, publicURL]
      } else {
        data = [unix, unix, timeSpentSecond, title, labels, abstract, thumbnail, editURL, publicURL]
      }
    }

    //console.log(sql)
    //console.log(data)
    WebSQLDatabaseHelper.exec(sql, data, (rows) => {
      //console.log('after sql')
      this.getLastUpdatePost((post) => {
        //console.log(callback)
        FunctionHelper.triggerCallback(callback, post)
      })
    })
  },
  getLastPostId: function (callback) {
    let sql = 'select id from posts order by id desc limit 0, 1'
    WebSQLDatabaseHelper.exec(sql, (rows) => {
      FunctionHelper.triggerCallback(callback, rows[0].id)
    })
  },
  getLastUpdatePost: function (callback) {
    let sql = 'select * from posts order by id desc limit 0, 1'
    //console.log(sql)
    WebSQLDatabaseHelper.exec(sql, (rows) => {
      //console.log(rows)
      //console.log(rows.length)
      //console.log(rows[0])
      if (rows.length > 0) {
        //rows = rows.item(0)
        rows = rows[0]
      } else {
        rows = undefined
      }
      FunctionHelper.triggerCallback(callback, rows)
    })
  },
  retrieveAllPost: function (callback) {
    let sql = 'select * from posts order by updateUnix desc'
    //console.log(sql)
    WebSQLDatabaseHelper.exec(sql, callback)
  },
  removePost: function (id, callback) {
    let sql = `DELETE FROM posts WHERE id=${id}`
    WebSQLDatabaseHelper.exec(sql, callback)
  }
}

export default PostManagerDatabase