import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import {saveAs} from 'file-saver';

let PostManagerBackup = {
  PostManager: null,
  init: function (PostManager, callback) {
    this.PostManager = PostManager
    FunctionHelper.triggerCallback(callback)
  },
  backupPost: function (id, callback) {
    $v.PageLoader.open()
    let nowFormat = DayjsHelper.nowFormat()
    let folderName = `blogger-editor-post-${id}-${nowFormat}`
    this.createBackupZip(id, (zip) => {
      saveAs(zip, `${folderName}.zip`)
      $v.PageLoader.close()
      FunctionHelper.triggerCallback(callback)
    })
  },
  createBackupZip: function (post, postBody, callback) {
    let id = post.id
    let FieldPostBody = $v.EditorManager.FieldPostBod
    post = JSON.parse(JSON.stringify(post))
    
      let zip = new JSZip()
      let nowFormat = DayjsHelper.nowFormat()
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

  readPostsZip: function (files, callback) {
    $v.PageLoader.open()

    let i = 0

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
              this.readSinglePostZip(zip, next)
            }
            break;
          }
        })
      } else {
        //this.statisticQuota()
        //EventManager.trigger(this, 'readPostsZip')
        
        $v.PageLoader.close()
        FunctionHelper.triggerCallback(callback)
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
    let PostManager = $v.PostManager
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
          } else if (path.endsWith('/postBody.html')) {
            zipEntry.async('string').then((content) => {
              //console.log(['readSinglePostZip 1', content])
              content = FieldPostBody.filterImageListToFileSystem(content, postId)
              //console.log(['readSinglePostZip 2', content])
              //let postBodyPath = `/${postId}/postBody.html`
              //FileSystemHelper.write(postBodyPath, content, next)
              PostManager.createPostBodyFile(postId, content, next)
            })
          } else {
            next()
          }
        } else {
          zipEntry.async('blob').then((content) => {
            let filename = path.slice(path.lastIndexOf('/') + 1)
            let assetPath = `/${postId}/assets/${filename}`
            FileSystemHelper.write(assetPath, content, next)
          })
        }
      } else {
        PostManager.createPost(post, callback)
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
}

export default PostManagerFile
