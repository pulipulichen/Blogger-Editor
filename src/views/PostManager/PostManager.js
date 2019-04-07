import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'

let PostManager = {
  data: function () {
    return {
      ui: undefined,
      componentRerenderKey: 0,
      posts: [],
      filterCondition: '',
      filteredPosts: [],
      createTableDone: false,
      editingPostId: null
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
    //$(() => {
      //this.getUI().find('.close.icon:first').click(() => {
      //  //console.log(1)
      //  this.close()
      //})
      
    //this.init()
      
      //this.open()
    //})
    $v.PostManager = this
  },
  computed: {
    postsLegnth: function () {
      return this.posts.length
    }
  },
  methods: {
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $('.PostManager.ui.modal')
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
          //console.log('PostManager.init()')
          //console.log(this.posts)
          //this.filteredPosts = this.posts
          
          //console.log(rows.length)
          
          this.filterPosts()
          //console.log(this.filteredPosts)
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
    createPost: function (post ,callback) {
      if (typeof(post) === 'function') {
        callback = post
        post = null
      }
      
      let postId
      let unix = DayjsHelper.unix()
      let title = 'This is a title'
      let abstract = 'balabala'
      let labels = 'D'
      let thumbnail = 'icon.png'
      let sql = 'insert into posts(createUnix, updateUnix, title, labels, abstract, thumbnail) values(?,?,?,?,?,?)'
      let data = [unix, unix, title, labels, abstract, thumbnail]
      
      if (typeof(post) === 'object') {
        if (typeof(post.id) === 'number') {
          postId = post.id
        }
        if (typeof(post.title) === 'string') {
          title = post.title
        }
        if (typeof(post.abstract) === 'string') {
          abstract = post.abstract
        }
        if (typeof(post.labels) === 'string') {
          labels = post.labels
        }
        if (typeof(post.thumbnail) === 'string') {
          thumbnail = post.thumbnail
        }
        
        if (typeof(post.id) === 'number') {
          sql = 'insert into posts(id, createUnix, updateUnix, title, labels, abstract, thumbnail) values(?, ?,?,?,?,?,?)'
          data = [postId, unix, unix, title, labels, abstract, thumbnail]
        }
        else {
          data = [unix, unix, title, labels, abstract, thumbnail]
        }
      }
      
      WebSQLDatabaseHelper.exec(sql, data, (rows) => {
        this.getLastUpdatePost((post) => {
          //console.log(post.id)
          this.posts = [post].concat(this.posts)
          if (post === null) {
            this.editingPostId = post.id
          }
          this.persist()
          this.filterPosts()
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
      //if (this.editingPostId !== PostManager.editingPostId
      //        && typeof(PostManager.editingPostId) === 'number') {
      //  this.editingPostId = PostManager.editingPostId
      //}
      
      if (typeof(this.editingPostId) === 'number') {
        //console.log(this.editingPostId)
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
      //console.log(['getPost', this.editingPostId, PostManager.editingPostId])
      if (typeof(id) === 'function') {
        callback = id
        id = undefined
      }
      
      let post
      if (id === undefined) {
        //id = this.editingPostId
        //console.log(['getPost', this.editingPostId, PostManager.editingPostId])
        this.getEditingPostId((id) => {
          //console.log(['getPost', id])
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
        //let fsPath = FileSystemHelper.getFileSystemUrl(path)
        //FileSystemHelper.read(path, (postBody) => {
        //console.log(fsPath)
        //$.get(fsPath, (postBody) => {
        FileSystemHelper.read(path, (postBody) => {
          if (postBody === undefined) {
            postBody = ''
          }
          //console.log(['getPostBody', postBody])
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
    createPostBodyFile: function (id, content, callback) {
      if (typeof(content) === 'function') {
        callback = content
        content = ''
      }
      
      let path = `/${id}/postBody.html`
      FileSystemHelper.isExists(path, (isExists) => {
        if (isExists === true) {
          FunctionHelper.triggerCallback(callback)
        }
        else {
          FileSystemHelper.write(path, content, callback)
        }
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
      let message = `Are you sure to delete #${id}`
      WindowHelper.confirm(message, () => {
        id = parseInt(id, 10)
        
        this.posts = this.posts.filter(post => post.id !== id)
        this.filterPosts()
        
        let sql = `DELETE FROM posts WHERE id=${id}`
        WebSQLDatabaseHelper.exec(sql)
        
        if (this.editingPostId === id) {
          this.editingPostId = null
          this.persist()
        }
        
        // delete files in filesystem
        let dirPath = `/${id}`
        FileSystemHelper.removeDir(dirPath, callback)
        //FunctionHelper.triggerCallback(callback)
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
      
      if (typeof(postBody) !== 'string') {
        if (typeof(postBody.html) === 'function') {
          postBody = postBody.html()
        }
        else {
          postBody = JSON.stringify(postBody)
        }
      }
      
      postBody = postBody.trim()
      let postBodyObject = $(postBody)
      let abstract = postBodyObject.text().trim()
      if (abstract.length > 100) {
        abstract = abstract.slice(0, 100).trim() + '...'
      }
      
      //let sql = 'insert into posts(createUnix, updateUnix, title, labels, abstract, thumbnail) values(?,?,?,?,?,?)'
      let thumbnail = null
      let img = postBodyObject.find('img:first')
      if (img.length > 0) {
        thumbnail = img.attr('src') 
      }
      
      //console.log(['updateEditingPostBody'])
      this.getPost((post) => {
        //console.log(['updateEditingPostBody 2', post.id])
        
        post.abstract = abstract
        post.thumbnail = thumbnail
        
        this.update(post, () => {
          let id = post.id
          let path = `/${id}/postBody.html`
          //console.log(['updateEditingPostBody', path])
          FileSystemHelper.write(path, postBody, () => {
            FunctionHelper.triggerCallback(callback, post)
          })
        })
      })
    },
    update: function (post, callback) {
      let id = post.id 
      
      let unix = DayjsHelper.unix()
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
      
      if (typeof($v.EditorManager) !== 'undefined') {
        $v.EditorManager.save()
      }
      
      //this.getUI().find('.header:first').click()
      this.init()
      this.getUI().modal('show')
      //this.init()
      //this.init(() => {
       // this.filterPosts()
      //})
    },
    close: function () {
      this.getUI().modal('hide')
    },
    persist() {
      this.getEditingPostId((id) => {
        localStorage.editingPostId = id
      })
      
      //console.log('now pretend I did more stuff...');
    },
    filterPosts: function () {
      if (typeof(this.filterCondition) !== 'string' 
              || this.filterCondition.trim() === '') {
        this.filteredPosts = this.posts
        this.forceRerender()
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
      })  // this.posts.forEach((post) => {
      
      this.forceRerender() 
    },
    forceRerender: function () {
      if (this.componentRerenderKey === undefined) {
        this.componentRerenderKey = 0
      }
      //console.log('forceRerender 1: ',  this.componentRerenderKey)
      this.componentRerenderKey += 1;
      //console.log('forceRerender 2: ',  this.componentRerenderKey)
    },
    displayDate: function (unix) {
      return DayjsHelper.postDate(unix)
    },
    backupPost: function (id, callback) {
      $v.PageLoader.open()
      let folderName = `blogger-editor-post-${id}`
      this.createBackupZip(id, (zip) => {
        saveAs(zip, `${folderName}.zip`)
        $v.PageLoader.close()
        FunctionHelper.triggerCallback(callback)
      })
    },
    createBackupZip: function (id, callback) {
      let FieldPostBody = $v.EditorManager.FieldPostBody
      this.getPost(id, (post) => {
        post = JSON.parse(JSON.stringify(post))
        this.getPostBody(id, (postBody) => {
          
          let zip = new JSZip()
          let folderName = `blogger-editor-post-${id}`
          let folder = zip.folder(folderName);
          
          //let thumb = post.thumbnail
          //post.thumbnail = thumb.slice(thumb.lastIndexOf('/assets/') + 1)
          post.thumbnail = FileSystemHelper.stripAssetFileSystemPrefix(post.thumbnail)
          //console.log(post.thumbnail)
          //return
          folder.file('post.json', JSON.stringify(post))
          
          if (postBody === undefined) {
            postBody = ''
          }
          
          this.addFileSystemFiles(folder, postBody, () => {
            postBody = FieldPostBody.filterImageListToRelative(postBody)
            folder.file('postBody.html', postBody)
            zip.generateAsync({type: "blob"}).then((content) => {
            // see FileSaver.js
              //saveAs(content, `blogger-editor-posts.zip`)
              //$v.PageLoader.close()
              FunctionHelper.triggerCallback(callback, content)
            })
            //FunctionHelper.triggerCallback(callback, zip)
          })
        })
      })
      //console.log('backupPost', id)
    },
    addFileSystemFiles: function (folder, postBody, callback) {
      let FieldPostBody = $v.EditorManager.FieldPostBody
      
      // we need download images
      let imageList = FieldPostBody.getImageList(postBody)
      let assetFolder = folder.folder('assets')
      let loop = (i) => {
        if (i < imageList.length) {
          let path = imageList[i]
          let name = path.slice(path.lastIndexOf('/') + 1)
          JSZipUtils.getBinaryContent(path, (err, data) => {
            //console.log(data)
            assetFolder.file(name, data)
            i++
            loop(i)
          })
        }
        else {
          FunctionHelper.triggerCallback(callback)
        }
      }
      loop(0)
    },
    backupAllPosts: function (callback) {
      $v.PageLoader.open()
      //console.log('backupAllPosts')
      //FunctionHelper.triggerCallback(callback)
      let zip = new JSZip()
      
      let loop = (i) => {
        if (i < this.posts.length) {
          let id = this.posts[i].id
          let folderName = `blogger-editor-post-${id}`
          this.createBackupZip(id, (postZip) => {
            zip.file(`${folderName}.zip`, postZip)
            
            i++
            loop(i)
          })
        }
        else {
          zip.generateAsync({type: "blob"}).then((content) => {
          // see FileSaver.js
            saveAs(content, `blogger-editor-posts.zip`)
            $v.PageLoader.close()
            FunctionHelper.triggerCallback(callback)
          })
        }
      }
      loop(0)
    },
    triggerUploadPosts: function (e) {
      FileHelper.triggerInput(e)
    },
    uploadPosts: function (e) {
      let files = e.target.files
      //console.log('uploadPost')
      this.readPostsZip(files)
    },
    dropPosts: function (e) {
      let files = e.dataTransfer.files
      //console.log('uploadPost')
      this.readPostsZip(files)
    },
    readPostsZip: function (files) {
      $v.PageLoader.open()
      
      let i = 0
      
      let loop = (i) => {
        if (i < files.length) {
          let file = files[i]
          if (file.type !== 'application/zip') {
            next()
            return
          }
          
          JSZip.loadAsync(file) // 1) read the Blob
            .then((zip) => {
              for (let path in zip.files) {
                if (path.endsWith('/')) {
                  continue
                }
                
                //console.log(['readPostsZip', path])
                if (path.startsWith('blogger-editor-post-')
                        && path.endsWith('.zip')) {
                  this.readAllPostsZip(zip, next)
                }
                else {
                  this.readSinglePostZip(zip, next)
                }
                break;
              }
            })
        }
        else {
          $v.PageLoader.close()
        }
      }
      
      let next = () => {
        i++
        loop(i)
      }
      
      loop(i)
    },
    readAllPostsZip: function (zip, callback) {
      let pathList = []
      for (let path in zip.files) {
        if (path.endsWith('/')) {
          continue
        }
        pathList.push(path)
      }
      
      let i = 0
      let loop = (i) => {
        if (i < pathList.length) {
          let path = pathList[i]
          //console.log(['readAllPostsZip', path])
          let zipEntry = zip.files[path]
          zipEntry.async('blob').then((content) => {
            JSZip.loadAsync(content) // 1) read the Blob
              .then((zip) => {
                //console.log(zip.files)
                this.readSinglePostZip(zip, next)
              })
          })
        }
        else {
          FunctionHelper.triggerCallback(callback)
        }
      }
      
      let next = () => {
        i++
        loop(i)
      }
      
      loop(i)
    },
    readSinglePostZip: function (zip, callback) {
      let FieldPostBody = $v.EditorManager.FieldPostBody
      
      let postId
      let post = {}
      let postBody
      
      // -----------
      
      let pathList = []
      for (let path in zip.files) {
        if (path.endsWith('/')) {
          continue
        }
        pathList.push(path)
      }
      
      // -----------
      
      let i = 0
      let loop = (i) => {
        if (i < pathList.length) {
          let path = pathList[i]
          //console.log(['readSinglePostZip', path])
          let zipEntry = zip.files[path]
          
          if (path.indexOf('/assets/') === -1) {
            if (path.endsWith('/post.json')) {
              zipEntry.async('string').then((content) => {
                post = JSON.parse(content)
                post.id = postId
                //let thumb = post.thumbnail
                //thumb = thumb.slice(thumb.lastIndexOf('assets/'))
                //thumb = `/${postId}/${thumb}`
                post.thumbnail = FileSystemHelper.appendAssetFileSystemPrefix(post.thumbnail, postId)
                //console.log(['thumb', thumb])
                next()
              })
            }
            else if (path.endsWith('/postBody.html')) {
              zipEntry.async('string').then((content) => {
                //console.log(['readSinglePostZip 1', content])
                content = FieldPostBody.filterImageListToFileSystem(content, postId)
                //console.log(['readSinglePostZip 2', content])
                //let postBodyPath = `/${postId}/postBody.html`
                //FileSystemHelper.write(postBodyPath, content, next)
                this.createPostBodyFile(postId, content, next)
              })
            }
            else {
              next()
            }
          }
          else {
            zipEntry.async('blob').then((content) => {
              let filename = path.slice(path.lastIndexOf('/'))
              let assetPath = `/${postId}/assets/${filename}`
              FileSystemHelper.write(assetPath, content, next)
            })
          }
        }
        else {
          this.createPost(post, callback)
        }
      }
      
      let next = () => {
        i++
        loop(i)
      }
      
      this.getLastPostId((id) => {
        postId = (id + 1)
        loop(i)
      })
      
    },
    clonePost: function (id, callback) {
      $v.PageLoader.open()
      console.log('clonePost', id)
      this.getPostBody(id, (postBody) => {
        this.getPost(id, (post) => {
          post = JSON.parse(JSON.stringify(post))
          this.createPost(post, (post) => {
            let postId = post.id
            this.createPostBodyFile(postId, postBody, () => {
              $v.PageLoader.close()
              FunctionHelper.triggerCallback(callback)
            })
          })
        })
      })
    },
  }
}

//window.PostManager = PostManager
export default PostManager