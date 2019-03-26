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
      this.getUI().find('.close.icon').click(() => {
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
      
      let sql = `Create Table posts
      (id INTEGER PRIMARY KEY, 
       createUnix INTEGER, 
       updateUnix INTEGER, 
       title TEXT, 
       labels TEXT, 
       abstract TEXT)`
      console.log(sql)
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
        if (rows.length > 0) {
          for (let i = 0; i < rows.length; i++) {
            let item = rows.item(i)
            this.posts.push(item)
          }
          console.log(this.posts)
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
      let title = ''
      let abstract = ''
      let labels = ''
      
      let sql = 'insert into posts(createUnix, updateUnix, title, labels, abstract) values(?,?,?,?,?)'
      WebSQLDatabaseHelper.exec(sql, [unix, unix, title, labels, abstract], (rows) => {
        this.getLastUpdatePost(callback)
      })
    },
    getLastUpdatePost: function (callback) {
      let sql = 'select * from posts order by updateUnix desc limit 0, 1'
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
    remove: function (id, callback) {
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
    }
  }
}

window.PostManager = PostManager
export default PostManager