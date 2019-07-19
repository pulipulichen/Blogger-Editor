import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import {saveAs} from 'file-saver';

let PostManagerBackup = {
  PostManager: null,
  init: function (PostManager, callback) {
    this.PostManager = PostManager
    FunctionHelper.triggerCallback(callback)
  },
  backupPost: function (post, postBody, callback) {
    let id = post.id
    $v.PageLoader.open()
    let nowFormat = DayjsHelper.nowMMDDFormat()
    let title = this.getPostTitleAbstract()
    let folderName = `blogger-editor-post-${id}-${title}-${nowFormat}`
    this.createBackupZip(post, postBody, (zip) => {
      saveAs(zip, `${folderName}.zip`)
      $v.PageLoader.close()
      FunctionHelper.triggerCallback(callback)
      
      GoogleAnalyticsHelper.send('PostManagerBackup.backupPost', {
        'filename': `${folderName}.zip`
      })
    })
  },
  getPostTitleAbstract: function () {
    let title = this.PostManager.getPost().title
    //console.log(title)
    
    return FileHelper.extractSafeFilename(title, 15, 30)
  },
  createBackupZip: function (post, postBody, callback) {
    console.log(post)
    let id = post.id
    let FieldPostBody = $v.EditorManager.FieldPostBody
    post = JSON.parse(JSON.stringify(post))

      let zip = new JSZip()
      let nowFormat = DayjsHelper.nowMMDDFormat()
      let folderName = `blogger-editor-post-${id}-${nowFormat}`
      let folder = zip.folder(folderName);

      //let thumb = post.thumbnail
      //post.thumbnail = thumb.slice(thumb.lastIndexOf('/assets/') + 1)
      if (post.thumbnail !== null) {
        post.thumbnail = FileSystemHelper.stripAssetFileSystemPrefix(post.thumbnail)
      }
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
        name = decodeURIComponent(name)
        JSZipUtils.getBinaryContent(path, (err, data) => {
          //console.log(data)
          assetFolder.file(name, data)
          i++
          loop(i)
        })
      } else {
        FunctionHelper.triggerCallback(callback)
      }
    }
    loop(0)
  },

  backupAllPosts: function (posts, callback) {
    $v.PageLoader.open()
    //console.log('backupAllPosts')
    //FunctionHelper.triggerCallback(callback)
    let zip = new JSZip()

    let loop = (i) => {
      if (i < posts.length) {
        let id = posts[i].id
        let folderName = `blogger-editor-post-${id}`
        this.createBackupZip(posts[i], (postZip) => {
          zip.file(`${folderName}.zip`, postZip)

          i++
          loop(i)
        })
      } else {
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

  uploadPosts: function (e, postId, callback) {
    let files = e.target.files
    //console.log('uploadPost')
    //console.log(callback)
    this.readPostsZip(files, postId, callback)
  },
  dropPosts: function (e, postId, callback) {
    let files = e.dataTransfer.files
    //console.log('uploadPost')
    this.readPostsZip(files, postId, callback)
  },

  readPostsZip: function (files, postId, callback) {
    $v.PageLoader.open()

    if (typeof(postId) === 'function' && callback === undefined) {
      callback = postId
      postId = -1
    }

    let i = 0
    let uploadedPost

    let loop = (i) => {
      if (i < files.length) {
        let file = files[i]
        if (file.type !== 'application/zip') {
          next()
          return
        }

        JSZip.loadAsync(file).then((zip) => {
          for (let path in zip.files) {
            if (path.endsWith('/')) {
              continue
            }

            //console.log(['readPostsZip', path])
            if (path.startsWith('blogger-editor-post-')
                    && path.endsWith('.zip')) {
              this.readAllPostsZip(zip, next)
            } else {
              this.readSinglePostZip(zip, postId, (post) => {
                if (post !== undefined) {
                  uploadedPost = post
                }
                next()
              })
            }
            break;
          }
        })
      } else {
        //this.statisticQuota()
        //EventManager.trigger(this, 'readPostsZip')

        $v.PageLoader.close()
        //console.log(callback)
        FunctionHelper.triggerCallback(callback, uploadedPost)
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
          JSZip.loadAsync(content).then((zip) => {
            //console.log(zip.files)
            this.readSinglePostZip(zip, next)
          })
        })
      } else {
        GoogleAnalyticsHelper.send('PostManagerBackup.readAllPostsZip', {
          'pathListCount': pathList.length
        })
        FunctionHelper.triggerCallback(callback)
      }
    }

    let next = () => {
      i++
      loop(i)
    }

    loop(i)
  },
  readSinglePostZip: function (zip, postId, callback) {
    //console.log('readSinglePostZip')

    let mode
    if (typeof(postId) === 'function' && callback === undefined) {
      callback = postId
      postId = -1
    }

    let PostManager = this.PostManager
    let PostManagerDatabase = PostManager.PostManagerDatabase
    let FieldPostBody = $v.EditorManager.FieldPostBody

    let post = {}
    //let postBody
    //let postId

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
              //console.log(['postId', postId])
              //let thumb = post.thumbnail
              //thumb = thumb.slice(thumb.lastIndexOf('assets/'))
              //thumb = `/${postId}/${thumb}`
              post.thumbnail = FileSystemHelper.appendAssetFileSystemPrefix(post.thumbnail, postId)
              //console.log(['thumb', thumb])
              next()
            })
          } else if (path.endsWith('/postBody.html')) {
            zipEntry.async('string').then((content) => {
              //console.log(['readSinglePostZip 1', content])
              content = FieldPostBody.filterImageListToFileSystem(content, postId)
              //console.log(['readSinglePostZip 2', content])
              //let postBodyPath = `/${postId}/postBody.html`
              //FileSystemHelper.write(postBodyPath, content, next)
              PostManager.writePostBodyFile(postId, content, next)
            })
          } else {
            next()
          }
        } else {
          zipEntry.async('blob').then((content) => {
            let filename = path.slice(path.lastIndexOf('/') + 1)
            filename = decodeURIComponent(filename)
            let assetPath = `/${postId}/assets/${filename}`
            FileSystemHelper.writeFromString(assetPath, content, next)
          })
        }
      } else {
        // 檔案全部讀取完畢之後，才會post
        //console.log(post)
        GoogleAnalyticsHelper.send('PostManagerBackup.readSinglePostZip', {
          'postId': postId
        })
        if (mode === 'create') {
          PostManager.createPost(post, callback)
        }
        else if (mode === 'update') {
          PostManager.updatePost(post, callback)
        }
      }
    }

    let next = () => {
      i++
      loop(i)
    }

    if (postId === undefined || postId === -1) {
      mode = 'create'
      PostManagerDatabase.getLastPostId(id => {
        postId = id + 1
        loop(i)
      })
    }
    else {
      mode = 'update'
      loop(i)
    }
  },
}

export default PostManagerBackup
