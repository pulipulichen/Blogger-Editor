import dayjs from 'dayjs'
/*
PostManager = {
  template: `<div>okok</div>`,
  init: function () {
    $(() => {
      $('#postsManagerModal .modal-body').html(this.template)
    })
  }
}

PostManager.init()
*/


var PostManager = {
  //name: "main-content",
  data: function () {
    return {
      ui: undefined,
      posts: [],
      filterCondition: '',
      filteredPosts: [],
      createTableDone: false,
      //uploadImageDraft: '',
      //disableUploadImageDraft: true
    }
  },
  mounted() {
    /*
    if (localStorage.getItem('uploadImageDraft')) {
      try {
        this.uploadImageDraft = localStorage.getItem('uploadImageDraft');
      } catch(e) {
        localStorage.removeItem('uploadImageDraft');
      }
    }
    */
  },
  created: function () {
    //return
    $(() => {
      this.getUI().find('.close.icon:first').click(() => {
        //console.log(1)
        this.close()
      })
      
      this.open()
      this.initPosts()
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
    initPosts: function (callback) {
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
          this.filterPosts()
          FunctionHelper.triggerCallback(callback)
        }
        else {
          this.create()
        }
      })
    },
    checkTableIsEmpty: function (callback) {
      let sql = 'select count(*) as count from posts'
      WebSQLDatabaseHelper.exec(sql, (rows) => {
        console.log(rows)
        FunctionHelper.triggerCallback(callback)
      })
    },
    create: function (callback) {
      let unix = dayjs(new Date()).unix()
      let title = 'This is a title'
      let abstract = 'balabala'
      let labels = 'D'
      let thumbnail = 'icon.png'
      
      let sql = 'insert into posts(createUnix, updateUnix, title, labels, abstract, thumbnail) values(?,?,?,?,?,?)'
      WebSQLDatabaseHelper.exec(sql, [unix, unix, title, labels, abstract, thumbnail], (rows) => {
        this.getLastUpdatePost((post) => {
          console.log(post.id)
          this.posts = [post].concat(this.posts)
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
      this.create(callback)
    },
    editPost: function (id, callback) {
      console.log(id)
      FunctionHelper.triggerCallback(callback)
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
    update: function (post, callback) {
      FunctionHelper.triggerCallback(callback)
    },
    open: function () {
      //console.log(this.data)
      this.getUI().modal('show')
    },
    close: function () {
      this.getUI().modal('hide')
    },
    persist() {
      //localStorage.uploadImageDraft = this.uploadImageDraft;
      //console.log('now pretend I did more stuff...');
    },
    displayDate: function (unix) {
      //return dayjs(unix * 1000).format('YYYY MM/DD HH:mm')
      return dayjs(unix * 1000).format('MM/DD HH:mm')
    },
    filterPosts: function () {
      if (this.filterCondition.trim() === '') {
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