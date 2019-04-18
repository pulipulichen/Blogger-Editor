let SummerNoteButtons = {
  config: function () {
    return {
      
      // ---------------
      // Buttons on Toolbar
      // ---------------
      
      CopyHTML: (c) => {
        return this.CopyCode(c)
      },
      ImageReplacer: (c) => {
        return this.ImageReplacer(c)
      },
      IframePrompt: (c) => {
        return this.IframePrompt(c)
      },
      FileUploader: (c) => {
        return this.FileUploader(c)
      },
      CodeInserter: (c) => {
        return this.CodeInserter(c)
      },
      OutlineNavigator: (c) => {
        return this.OutlineNavigator(c)
      },
      SnippetInserter: (c) => {
        return this.SnippetInserter(c)
      },
      
      // -------
      
      imageSizeOriginal: (c) => {
        return this.imageSizeOriginal(c)
      },
      imageSizeDefault: (c) => {
        return this.imageSizeDefault(c)
      },
      insertMore: (c) => {
        return this.insertMore(c)
      },
      transSelected: (c) => {
        return this.transSelected(c)
      },
      downloadImageTemplate: (c) => {
        return this.downloadImageTamplate(c)
      },
      CleanCode: (c) => {
        return this.CleanCode(c)
      },
      
      styleP: (c) => {
        return this.styleP(c)
      },
      styleH1: (c) => {
        return this.styleH1(c)
      },
      styleH2: (c) => {
        return this.styleH2(c)
      },
      styleH3: (c) => {
        return this.styleH3(c)
      },
      styleH4: (c) => {
        return this.styleH4(c)
      },
      styleH5: (c) => {
        return this.styleH5(c)
      },
      styleH6: (c) => {
        return this.styleH6(c)
      },
      
      // ---------------
      // Buttons on Popover
      // ---------------
      
      popoverImageSizeOriginal: (c) => {
        return this.popoverImageSizeOriginal(c)
      },
      popoverImageSizeDefault: (c) => {
        return this.popoverImageSizeDefault(c)
      },
      popoverImageSave: (c) => {
        return this.popoverImageSave(c)
      },
      popoverImageOpen: (c) => {
        return this.popoverImageOpen(c)
      },
    }
  },
  build: function (contents, tooltip, click) {
    let ui = $.summernote.ui;

    // create button
    let button = ui.button({
      contents: contents,
      tooltip: tooltip,
      click: click
    });

    return button.render(); 
  },
  wrapNIWSF: function (text) {
    return `<span class="non-invasive-web-style-framework">${text}</span>`
  },
  
  // -------------------------
  // model buttons
  // -------------------------
  
  CopyCode: function (context) {
    let contents = this.wrapNIWSF(`<i class="code icon"></i>Copy Code`)
    let tooltip = 'Copy Code'
    let click = () => {
      //let code = this.getPostSummerNote().summernote('code');
      let code = $v.EditorManager.FieldPostBody.getHTML()
      CopyPasteHelper.copyPlainText(code)
    }
    return this.build(contents, tooltip, click)
  },
  CleanCode: function (context) {
    let contents = this.wrapNIWSF(`<i class="eraser icon"></i>Clean`)
    let tooltip = 'Clean Code'
    let click = () => {
      //let code = this.getPostSummerNote().summernote('code');
      let postBody = $v.EditorManager.FieldPostBody.getElement()
      let children = postBody.children()
      
      // Clean empty ndoes
      children.each((i, child) => {
        //console.log(child.innerHTML.trim())
        let html = child.innerHTML.trim().toLowerCase()
        if (html === '' || html === '<br>') {
          $(child).remove()
          return
        }
        
        let subchild = $(child).children()
        //console.log([subchild.length, subchild.eq(0)[0], subchild.eq(0).attr('tagName'), subchild.eq(0).prop('tagName')])
        //return
        //console.log([subchild.length, subchild.eq(0).prop('tagName').toLowerCase()])
        let l = 0
        let firstTagName = subchild.eq(l).prop('tagName')
        while (firstTagName !== undefined 
                && firstTagName.toLowerCase() === 'br') {
          subchild.eq(l).remove()
          l++
          if (l === subchild.length) {
            break
          }
          firstTagName = subchild.eq(l).prop('tagName')
        }
        
        l = subchild.length - 1
        let lastTagName = subchild.eq(l).prop('tagName')
        while (lastTagName !== undefined 
                && lastTagName.toLowerCase() === 'br') {
          subchild.eq(l).remove()
          l--
          if (l === 0) {
            break
          }
          lastTagName = subchild.eq(l).prop('tagName')
        }
        
        subchild = $(child).contents()
        if (subchild.length === 0) {
          $(child).remove()
        }
      })
    }
    return this.build(contents, tooltip, click)
  },
  
  
  ImageReplacer: function (context) {
    let contents = this.wrapNIWSF(`<i class="image icon"></i>Upload Images`)
    let tooltip = 'Replace Images with Blogger'
    let click = () => {
      $v.ImageReplacer.open()
    }
    return this.build(contents, tooltip, click)
  },
  IframePrompt: function (context) {
    let contents = this.wrapNIWSF(`<i class="plus square outline icon"></i> Iframe`)
    let tooltip = 'Insert iframe'
    let click = () => {
      $v.IframePrompt.open()
    }
    return this.build(contents, tooltip, click)
  },
  FileUploader: function (context) {
    let contents = this.wrapNIWSF(`<i class="upload icon"></i> Upload File`)
    let tooltip = 'Upload file and insert links'
    let click = () => {
      $v.FileUploader.open()
    }
    return this.build(contents, tooltip, click)
  },
  CodeInserter: function (context) {
    let contents = this.wrapNIWSF(`<i class="code icon"></i> Insert Code`)
    let tooltip = 'Insert code'
    let click = () => {
      $v.CodeInserter.open()
    }
    return this.build(contents, tooltip, click)
  },
  OutlineNavigator: function (context) {
    let contents = this.wrapNIWSF(`<i class="sitemap icon"></i> Outline`)
    let tooltip = 'Outline Navigation'
    let click = () => {
      $v.OutlineNavigator.toggle()
    }
    return this.build(contents, tooltip, click)
  },
  SnippetInserter: function (context) {
    let contents = this.wrapNIWSF(`<i class="quote left icon"></i> Snippet`)
    let tooltip = 'Insert snippet'
    let click = () => {
      $v.SnippetInserter.open()
    }
    return this.build(contents, tooltip, click)
  },
  
  // -------------------------
  // style buttons
  // -------------------------
  
  styleTagName: function (tagName) {
    let target = $v.EditorManager.FieldPostBody.getSelectTarget()
    //console.log($(target).html())
    let parent = target.sc.parentNode
    if (parent.tagName.toLowerCase() === tagName.toLocaleLowerCase()) {
      return
    }

    parent = $(parent)
    if (parent.hasClass('note-editing-area') === true 
            || parent.hasClass('note-editable') === true) {
      //console.log('has class note-editing-area')
      return
    }
    
    let content = parent.html()
    let grandParent = parent.parent()
    while (grandParent.hasClass('note-editing-area') === false 
            && grandParent.hasClass('note-editable') === false) {
      parent = grandParent
      grandParent = parent.parent()
    }
    
    parent.replaceWith(`<${tagName}>${content}</${tagName}>`)
  },
  
  styleP: function (context) {
    let contents = this.wrapNIWSF(`&lt;p&gt;`)
    let tooltip = 'Set as &lt;p&gt; tag.'
    let click = () => {
      this.styleTagName('p')
    }
    return this.build(contents, tooltip, click)
  },
  styleH1: function (context) {
    let tagName = 'h1'
    let contents = this.wrapNIWSF(`&lt;${tagName}&gt;`)
    let tooltip = `Set as &lt;${tagName}&gt; tag.`
    let click = () => {
      this.styleTagName(tagName)
    }
    return this.build(contents, tooltip, click)
  },
  styleH2: function (context) {
    let tagName = 'h2'
    let contents = this.wrapNIWSF(`&lt;${tagName}&gt;`)
    let tooltip = `Set as &lt;${tagName}&gt; tag.`
    let click = () => {
      this.styleTagName(tagName)
    }
    return this.build(contents, tooltip, click)
  },
  styleH3: function (context) {
    let tagName = 'h3'
    let contents = this.wrapNIWSF(`&lt;${tagName}&gt;`)
    let tooltip = `Set as &lt;${tagName}&gt; tag.`
    let click = () => {
      this.styleTagName(tagName)
    }
    return this.build(contents, tooltip, click)
  },
  styleH4: function (context) {
    let tagName = 'h4'
    let contents = this.wrapNIWSF(`&lt;${tagName}&gt;`)
    let tooltip = `Set as &lt;${tagName}&gt; tag.`
    let click = () => {
      this.styleTagName(tagName)
    }
    return this.build(contents, tooltip, click)
  },
  styleH5: function (context) {
    let tagName = 'h5'
    let contents = this.wrapNIWSF(`&lt;${tagName}&gt;`)
    let tooltip = `Set as &lt;${tagName}&gt; tag.`
    let click = () => {
      this.styleTagName(tagName)
    }
    return this.build(contents, tooltip, click)
  },
  styleH6: function (context) {
    let tagName = 'h6'
    let contents = this.wrapNIWSF(`&lt;${tagName}&gt;`)
    let tooltip = `Set as &lt;${tagName}&gt; tag.`
    let click = () => {
      this.styleTagName(tagName)
    }
    return this.build(contents, tooltip, click)
  },
  
  // -------------------------
  // image buttons
  // -------------------------
  
  removeImageTargetSize: function (target) {
    target = $(target)

    target.removeAttr('width')
    target.removeAttr('height')

    let link = target.attr('src')
    //console.log(link)
    if (BloggerImageHelper.isBloggerImageLink(link)) {
      if (BloggerImageHelper.isFullSizeLink(link) === false) {
        target.attr('src', BloggerImageHelper.getFullSize(link))
        //console.log('change src: ', target.attr('src'))
      } 
    }
    //console.log('@TODO Resize to original')
  },
  popoverImageSizeOriginal: function (context) {
    let contents = this.wrapNIWSF(`<i class="expand arrows icon"></i> Resize Original`)
    let tooltip = 'Resize to original'
    let click = () => {
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      this.removeImageTargetSize(target)
    }
    return this.build(contents, tooltip, click)
  },
  popoverImageSave: function (context) {
    let contents = this.wrapNIWSF(`<i class="save icon"></i> Save`)
    let tooltip = 'Save image'
    let click = () => {
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      target = $(target)
      let link = target.attr('src')
      //console.log(link)
      let name = link.slice(link.lastIndexOf('/') + 1)
      //console.log(name)
      //WindowHelper.popup(link, name)
      //window.open(link, name)
      FileHelper.download(link, name)
    }
    return this.build(contents, tooltip, click)
  },
  popoverImageOpen: function (context) {
    let contents = this.wrapNIWSF(`<i class="share icon"></i> Open`)
    let tooltip = 'Open image in new tab'
    let click = () => {
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      target = $(target)
      let link = target.attr('src')
      //console.log(link)
      let name = link.slice(link.lastIndexOf('/') + 1)
      //console.log(name)
      //WindowHelper.popup(link, name)
      //window.open(link, name)
      //console.log([link, name])
      WindowHelper.popup(link, name)
    }
    return this.build(contents, tooltip, click)
  },
  imageSizeOriginal: function (context) {
    let contents = this.wrapNIWSF(`<i class="expand arrows icon"></i> Resize Original`)
    let tooltip = 'Resize images to original'
    let click = () => {
      let postBody = $v.EditorManager.FieldPostBody.getElement()
      postBody.find('img').each((i, img) => {
        this.removeImageTargetSize(img)
      })
    }
    return this.build(contents, tooltip, click)
  },
  insertMore: function (context) {
    let contents = this.wrapNIWSF(`<i class="ellipsis horizontal icon"></i> More`)
    let tooltip = 'Insert More'
    let click = () => {
      let postBody = $v.EditorManager.FieldPostBody
      postBody.getElement().find('a[name="more"]').remove()
      postBody.insert('<a name="more"></a><!--more-->')
    }
    return this.build(contents, tooltip, click)
  },
  
  setImageTargetSize: function (target, size) {
    target = $(target)

    let resize = BloggerImageHelper.calcResize(size, target)
    if (resize !== undefined) {
      target.attr('width', resize.width)
        .attr('height', resize.height)
    }

    let link = target.attr('src')
    //console.log(link)
    if (BloggerImageHelper.isBloggerImageLink(link)) {
      target.attr('src', BloggerImageHelper.getSize(link, size))
      //console.log('change src: ', target.attr('src'))
    }
  },
  popoverImageSizeDefault: function (context) {
    let contents = this.wrapNIWSF(`<i class="compress icon"></i> Resize Default`)
    let tooltip = 'Resize to default size'
    let click = () => {
      let target = $v.EditorManager.FieldPostBody.getSelectTarget()
      let defaultSize = $v.EditorManager.imageSizeDefault
      this.setImageTargetSize(target, defaultSize)
    }
    return this.build(contents, tooltip, click)
  },
  imageSizeDefault: function (context) {
    let contents = this.wrapNIWSF(`<i class="compress icon"></i> Resize Default`)
    let tooltip = 'Resize to default size'
    let click = () => {
      let defaultSize = $v.EditorManager.imageSizeDefault
      let postBody = $v.EditorManager.FieldPostBody.getElement()
      postBody.find('img').each((i, img) => {
        this.setImageTargetSize(img, defaultSize)
      })
    }
    return this.build(contents, tooltip, click)
  },
  
  
  // -----------------------------
  // Others
  // -----------------------------
  
  
  transSelected: function (context) {
    let contents = this.wrapNIWSF(`<i class="language icon"></i> Trans`)
    let tooltip = 'Translate Selected'
    let click = () => {
      let text = $v.EditorManager.FieldPostBody.getSelectText()
      text = encodeURI(text)
      let url = `https://translate.google.com/#view=home&op=translate&sl=auto&tl=auto&text=${text}`
      WindowHelper.popup(url)
    }
    return this.build(contents, tooltip, click)
  },
  
  downloadImageTamplate: function (context) {
    let contents = this.wrapNIWSF(`<i class="object group outline icon"></i> Image Template`)
    let tooltip = 'Download image template'
    let click = () => {
      let path = './static/image-template.dps'
      //FileHelper.download(path)
      //let title = "test.dps"
      let title = $v.EditorManager.FieldPostTitle.getText().trim()
      if (title.indexOf('/') > -1) {
        title = title.slice(0, title.indexOf('/')).trim()
      }
      if (title.length > 30) {
        title = title.slice(0,30)
      }
      
      title = title + '.dps'
      //$(`<a href="${path}" download="${title}"></a>`).click()
      
      FileHelper.download(path, title)
    }
    return this.build(contents, tooltip, click)
  },
}

export default SummerNoteButtons