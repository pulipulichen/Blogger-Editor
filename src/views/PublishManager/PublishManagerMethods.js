import SummerNoteCode from './../EditorManager/SummerNote/SummerNoteCode.js'

import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'

import PublishManagerMethodsChatGPT from './PublishManagerMethodsChatGPT'
import PublishManagerMethodsMarkdown from './PublishManagerMethodsMarkdown'

export default function (app) {
  if (!app.methods) {
    app.methods = {}
  }


  // ---------------------
    // Methods of Modal
    // ---------------------
    
  app.methods.getUI = function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    }
  app.methods.open = function () {
      
      this.loadPostData(() => {
        $v.ImageReplacer.validateHasFileSystemImage()
        //console.log(this.filesystemImageCount)
        this.bloggerConsoleURL = $v.ConfigManager.bloggerConsoleURL
        this.urlChatGPTBlogger = $v.ConfigManager.urlChatGPTBlogger

        this.buildPrompts() // 還行20230709-2339 
        this.getUI().modal('show')
      })
    }
  app.methods.close = function () {
      this.getUI().modal('hide')
    }
    app.methods.loadPostData = function (callback) {
      if (ConfigHelper.get('debug').disablePublishManager !== false) {
        return FunctionHelper.triggerCallback(callback)
      }
      
      let post = $v.PostManager.getPost()
      if (post === undefined) {
        console.error('post is not found')
        FunctionHelper.triggerCallback(callback)
        return false
      }
      
      this.postId = post.id
      this.editURL = post.editURL
      this.publicURL = post.publicURL
      this.editNote = post.editNote
      this.postSEOLink = post.postSEOLink
      
      let fieldPostTitle = $v.EditorManager.FieldPostTitle
      this.postTitle = fieldPostTitle.getText()
      
      let fieldPostLabels = $v.EditorManager.FieldPostLabels
      this.postLabels = fieldPostLabels.getText()

      if (!this.postSEOLink || 
          this.postSEOLink === '') {
        this.generateSEOLink()
      }
      
      FunctionHelper.triggerCallback(callback)
    }
    app.methods.persist = function () {
      // VueHelper.persistLocalStorage(this, 'bloggerConsoleURL')
    }
    app.methods.persistPost = function (key) {
      let pm = $v.PostManager
      let value = this[key]
      console.log([key, value])
      pm.updateEditingPost(key, value)
    }
    app.methods.popup = function (name) {
      let url = this[name]
      WindowHelper.forcePopup(url, name)
    }
    app.methods.openImageReplacer = function () {
      $v.EditorManager.ImageReplacer.open()
      return this
    }
    app.methods.downloadPostBackup = function () {
      $v.PostManager.backupPost()
      //this.close()
      return this
    }
    app.methods.changePostMetadata = function () {
      let fieldPostTitle = $v.EditorManager.FieldPostTitle
      fieldPostTitle.set(this.postTitle)
      
      let fieldPostLabels = $v.EditorManager.FieldPostLabels
      fieldPostLabels.set(this.postLabels)
      return this
    }
    app.methods.copyInput = function (event) {
      //console.log(event)
      let button = event.target
      let text = $(button).parents('.ui.input:first').find('input').val()
      //console.log(text)
      CopyPasteHelper.copyPlainText(text)
      return this
    }
    app.methods.copyHTML = function () {
      SummerNoteCode.CopyCodeClick((message) => {
        return this.$t(message)
      })
      return this
    }
    app.methods.saveOneFileHTML = function  () {
      let html = SummerNoteCode.GetOneFileHTML((message) => {
        return this.$t(message)
      })
      
      let htmlTemplate = `<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>${this.postTitle}</title>

</head>

<body>

<h1>${this.postTitle}</h1>
${html}

</body>
</html>`
      
      let blob = new Blob([htmlTemplate], {type: "text/html;charset=utf-8"});
      saveAs(blob, DayjsHelper.nowMMDDHHmmFormat() + ` ${this.postTitleSafe}.html`)
      
      return this
    }
    app.methods.saveOneFileHTMLtoDOC  = function () {
      let html = SummerNoteCode.GetOneFileHTML((message) => {
        return this.$t(message)
      })
      
      let htmlTemplate = `<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>${this.postTitle}</title>

</head>

<body>

<h1>${this.postTitle}</h1>
${html}

</body>
</html>`
      
      let zip = new JSZip()
      let filename = DayjsHelper.nowMMDDHHmmFormat() + ` ${this.postTitleSafe}.rtf`
      zip.file(filename, htmlTemplate)
      zip.generateAsync({type: "blob"}).then((content) => {
        // see FileSaver.js
        saveAs(content, filename + `.zip`)
        //$v.PageLoader.close()
        //FunctionHelper.triggerCallback(callback, content)
      })
      
      return this
    }
    app.methods.openBackupPage=function () {
      let config = $v.ConfigManager
      if (config.enableBackupPageButton === false
              || config.backupPageURL === 'https://drive.google.com/drive/u/0/my-drive') {
        config.open('backup')
      }
      else {
        config.openBackupPageURL()
      }
    }
    app.methods.triggerUploadPostBackup= function (e) {
      this.getUI().find('input:file[name="uploadPosts"]').click()
      return this
    }
    app.methods.uploadPosts=function (e) {
      $v.PostManager.uploadPosts(e, this.postId, (post) => {
        this.afterUploadPost(post)
      })
      return this
    }
    app.methods.dropPosts= function (e) {
      $v.PostManager.dropPosts(e, this.postId, (post) => {
        this.afterUploadPost(post)
      })
      return this
    }
    app.methods.afterUploadPost=function (post) {
      //console.log('afterUploadPost')
      //console.log(post)
      
      if (typeof(post) !== 'object') {
        console.log('This is not a valided post data.')
        return false
      }
      
      if (typeof(post.title) === 'string') {
        this.postTitle = post.title
      }
      else {
        this.postTitle = ''
      }
      
      if (typeof(post.labels) === 'string') {
        this.postLabels = post.labels
      }
      else if (Array.isArray(post.labels)) {
        this.postLabels = post.labels.join(', ')
      }
      else {
        this.postLabels = ''
      }
      
      if (typeof(post.editURL) === 'string') {
        this.editURL = post.editURL
      }
      else {
        this.editURL = ''
      }
      
      if (typeof(post.publicURL) === 'string') {
        this.publicURL = post.publicURL
      }
      else {
        this.publicURL = ''
      }
      
      if (typeof(post.postSEOLink) === 'string') {
        this.postSEOLink = post.postSEOLink
      }
      else {
        this.postSEOLink = ''
      }
      
      if (typeof(post.editNote) === 'string') {
        this.editNote = post.editNote
      }
      else {
        this.editNote = ''
      }
      
      this.resetUploadInput()
      this.close()
      return this
    }
    app.methods.resetUploadInput = function () {
      this.getUI().find('input:file[name="uploadPosts"]').val('')
    }
    app.methods.generateSEOLink = function  () {
      let postTitle = this.postTitle
      
      let slashPos = postTitle.indexOf(' / ')
      if (slashPos === -1) {
        slashPos = postTitle.indexOf(' / ')
      }
      if (slashPos > -1) {
        postTitle = postTitle.slice(slashPos + 3).trim()
      }

      // console.log(postTitle)
      
      this.convertPostTitleToSEOLink(postTitle)
    }
    app.methods.fixSEOLink = function  () {
      let link = this.postSEOLink
      
      if (link.indexOf(' ') === -1
              && (new RegExp('[^\x00-\x7F]', 'g')).test(link) === false
              && (new RegExp('[A-Z]', 'g')).test(link) === false) {
        return false
      }
      
      this.convertPostTitleToSEOLink(link)
    }
    app.methods.convertPostTitleToSEOLink = function (link) {
      let seoLink = link.toLowerCase().trim()
      seoLink = seoLink.replace(/[^a-zA-Z ]/g, "")
      seoLink = seoLink.replace(/[^\x00-\x7F]/g, "-")
      seoLink = seoLink.split(' ').join('-')
      seoLink = seoLink.split(':').join('-')
      
      
      while (seoLink.length > 0 && seoLink.indexOf('--') > -1) {
        seoLink = seoLink.split('--').join('-')
      }
      
      while (seoLink.length > 0 && seoLink.startsWith('-')) {
        seoLink = seoLink.slice(1)
      }
      while (seoLink.length > 0 && seoLink.endsWith('-')) {
        seoLink = seoLink.slice(0, -1)
      }
      
      if (seoLink === '-' || seoLink === '') {
        return false
      }
      
      
      this.postSEOLink = seoLink
    }
    app.methods.getTitleRecommend = async function () {
      let html = SummerNoteCode.CopyCodeClick((message) => {
        return this.$t(message)
      }, false)

      let text = $(html).text()

      // console.log(text)
      let promot = `請為以下文字產生100字以內的中文文章標題：` + text
      CopyPasteHelper.copyPlainText(promot)

      WindowHelper.popup(`https://chat.openai.com/chat`)
    }

    app.methods.getPostBodyText = function () {
      let postBody = $v.EditorManager.FieldPostBody.getElement()
      let text = postBody.text()
      // let text = postBody.html()
      // text = text.replace(/<\/?[^>]+(>|$)/g, ' ');
      // while (text.indexOf('  ') > -1) {
      //   text = text.split('  ').join(' ')
      // }
      return text
    }


    app.methods.getLabelRecommend = async function () {
      this.isLabelRecommending = true
      let text = this.getPostBodyText()
      let traned = await this.trans(text)
      let recommends = await this.getKeywords(traned)
      recommends = recommends.filter(t => !this.isURL(t)).map(r => {
        let words = r.split(' ')

        words = words.filter(t => !this.isURL(t)).map(w => {
          return w.slice(0, 1).toUpperCase() + w.slice(1)
        })
        return words.join('')
      })
      // console.log(recommends)

      this.isLabelRecommending = false
      this.labelRecommends = recommends
    }
    app.methods.trans = async function (text, sourceLangage = 'zh', targetLanguage = 'en') {
      let appsScriptURL = $v.ConfigManager.apiKeysTrans

      if (appsScriptURL === '') {
        return `NoAPIKey`
      }

      var requestOptions = {
        method: 'POST',
        redirect: 'follow',
        body: text
      };

      let requestURL = appsScriptURL + '?s=' + sourceLangage + '&t=' + targetLanguage

      let res = await fetch(requestURL, requestOptions)
      let result = await res.text()
      console.log(result)
      // console.log(result.output)
      result = JSON.parse(result)
      return result.output
    }
    app.methods.getKeywords  = function (output) {
      let apiKey = $v.ConfigManager.apiKeysAPILayer
      if (apiKey === '') {
        return ['NoAPIKey']
      }

      return new Promise(async (resolve, reject) => {
        var myHeaders = new Headers();
        myHeaders.append("ap" + "ik" + "ey", apiKey);

        var raw = output

        var requestOptions = {
          method: 'POST',
          redirect: 'follow',
          headers: myHeaders,
          body: raw
        };

        let res = await fetch("https://api.apilayer.com/keyword", requestOptions)
        let text = await res.text()
        let json = JSON.parse(text)
        let result = json.result

        result = result.map(({text}) => {
          return decodeURIComponent(JSON.parse('"' + text.replace(/\"/g, '\\"') + '"'))
        }).filter(t => !this.isURL(t))

        result.sort((a, b) => {
          return a.length - b.length
        })

        resolve(result)
      })
    }
    app.methods.isURL = function (str) {
      
      return !!this.URLpattern.test(str);
    }
    app.methods.addLabelRecommend = function (label) {
      let currentLabels = this.postLabels.split(',').map(i => i.trim().toLowerCase())
      
      if (currentLabels.indexOf(label.toLowerCase()) === -1) {
        if (this.postLabels.trim() !== '') {
          this.postLabels = this.postLabels + ', '
        }
        this.postLabels = this.postLabels + label
      }
    }
    app.methods.openGoogleTransLink  = function () {
      WindowHelper.popup(this.googleTransLink)
    }

    PublishManagerMethodsChatGPT(app)
    PublishManagerMethodsMarkdown(app)
}