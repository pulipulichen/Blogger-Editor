/* global SemanticUIHelper, BloggerImageHelper, CopyPasteHelper, GoogleAnalyticsHelper */

import SummerNoteHelper from './SummerNoteHelper.js'
require('./../../../vendor/beautify/beautify-html.js')
//console.log(html_beautify)

let SummerNoteCode = {
  insertMore: function ($t, context, doRender = true, showLabel = true) {
    let contents = `<i class="ellipsis horizontal icon"></i>`
    if (showLabel) {
      contents = contents + $t('Read More')
    }
    contents = SemanticUIHelper.wrapNIWSF(contents)
    
    let tooltip = $t('Insert Read More')
    let click = () => {
      this.insertMoreClick()
    }
    return SummerNoteHelper.buildButton('insertMore', contents, tooltip, click, doRender)
  },
  insertMoreClick: function () {
    let postBody = $v.EditorManager.FieldPostBody
    postBody.getElement().find('a[name="more"]').remove()
    //postBody.insert('<a name="more"></a><!--more-->')
    //postBody.insert('<hr />')
    //postBody.insert('<!--more-->')
    //postBody.insert('<a name="more"></a>')
    
    //postBody.insert('<p><a name="more"></a><!--more--></p>')
    //postBody.insert('<hr />')
    //postBody.insert('<h2>[H2 Title]</h2>')
    postBody.insert('<p><a name="more"></a><!--more--></p><hr /><h2>[H2 Title]</h2><p>paragraph...</p>')
  },
  CopyCode: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="code icon"></i>` + $t('Copy Code'))
    let tooltip = $t('Copy Code')
    let click = () => {
      this.CopyCodeClick($t)
    }
    return SummerNoteHelper.buildButton('CopyCode', contents, tooltip, click, doRender)
  },
  CopyCodeClick: function ($t, warning = true) {
    let postBody = $v.EditorManager.FieldPostBody.getElement()
    postBody = this.CleanCodeClick(postBody)
    postBody = postBody.clone()

    // 檢查第一個圖片有沒有height
    if (postBody.find('img:first').length > 0 && postBody.find('img:first').attr('width') !== undefined) {
      if (warning === true && typeof($t) === 'function') {
        try {
          alert($t('First image has width!'))
        }
        catch (e) {}
      }
    }

    // 請把有http的部分全部換掉
    //console.log(postBody.html())
    postBody = BloggerImageHelper.filterPostBody(postBody)
    //console.log(postBody.html())
    
    postBody.find('[data-filename]').removeAttr('data-filename')
    postBody.find('[data-ocr]').removeAttr('data-ocr')
    
    postBody.find(`a[href*="http://pulipuli.blogspot.com/"],a[href*="https://pulipuli.blogspot.com/"]`).each((i, ele) => {
      let value = ele.href
      value = value.slice(value.indexOf('.com/') + 4)
      ele.href = value
    })
    
    postBody.find(`a[href*="http://pulipuli.blogspot.tw/"],a[href*="https://pulipuli.blogspot.tw/"]`).each((i, ele) => {
      let value = ele.href
      value = value.slice(value.indexOf('.tw/') + 3)
      ele.href = value
    })
    
    postBody.find(`a[href*="http://blog.pulipuli.info/"],a[href*="https://blog.pulipuli.info/"]`).each((i, ele) => {
      let value = ele.href
      value = value.slice(value.indexOf('.info/') + 5)
      ele.href = value
    })
    
    // 把最後幾個元素，沒有內容的部分刪除
    let lastNode = postBody.children(':last')
    while (lastNode.html().trim() === '') {
      lastNode.remove()
      
      lastNode = postBody.children(':last')
    }

    //let code = this.getPostSummerNote().summernote('code');
    let code = postBody.html()

    //console.log(code)

    code = code.replace(`<p><a name="more"></a><!--more--></p>`, '<!--more-->')
    code = code.replace(`<a name="more"></a><!--more--></p>`, '</p><!--more-->')
    code = code.replace(`<p><a name="more"><br></a></p>`, '<!--more-->')
    code = code.replace(`<a name="more"></a>`, '')
    code = code.replace(`<p><!--more--></p>`, '<!--more-->')
    code = code.replace(`<!--more--><hr></p>`, '</p><!--more--><hr />')
    code = code.split('</p><').join('</p>\n<')
    
    //code = code.replace(`<br /></p>`, '</p>')
    //code = code.replace(`<br /></`, '</')

    while (code.endsWith('<p><br></p>')) {
      code = code.slice(0, -11).trim()
    }
    
    if (code.indexOf('<!--more-->') === -1) {
      try {
        alert($t('<!--more--> is not found'))
      }
      catch (e) {}
    }
    
    // Beautiful HTML
    code = html_beautify(code, {
      "indent_size": 2,
      "indent_char": " ",
      "indent_with_tabs": false
    })
    
    CopyPasteHelper.copyPlainText(code)
    
    GoogleAnalyticsHelper.send('SummerNoteCode.CopyCodeClick', {
      'codeLength': code.length
    })
    
    return code
  },
  extractYouTubeVideoId: function (url) {
    var videoId = false;
    var match = url.match(/(?:\?v=|\/embed\/|\/watch\?v=|\/vi\/|\/e\/|youtu\.be\/|\/user\/\w+\/u\/\d+\/|\/attribution_link\?a=|\/embed\/videoseries\?list=|\/playlist\?list=)([A-Za-z0-9_-]+)/);
    
      if (match) {
          videoId = match[1];
      }
      
      return videoId;
  },
  GetOneFileHTML: function ($t, warning = true) {
    let code = this.CopyCodeClick($t, warning)
    
    code = this.replaceAll(code , `<a href="//`, `<a href="https://`)
    code = this.replaceAll(code , `<img src="//`, `<img src="https://`)
    code = this.replaceAll(code , `<iframe frameborder="0" src="//`, `<iframe frameborder="0" src="https://`)
    code = this.replaceAll(code , `<!--more-->`, ``)
    
    let partProcess = (part, i) => {
      if (i === 0) {
        return part
      }
      
      let url = part.slice(0, part.indexOf('"'))
      let urlParts = url.split('/')
      if (url.startsWith('https://blogger.googleusercontent.com/img/a/') === false && urlParts[7] && urlParts[7].startsWith('s')) {
        urlParts[7] = 's1600'
      }
      url = urlParts.join('/')
      
      part = url + part.slice(part.indexOf('"'))
      return part
    }

    code = code.split('<img src="').map(partProcess).join('<img src="')
    
    code = code.split('<img src="').map(partProcess).join('<img src="')

    
    let codeObj = $(`<div>${code}</div>`)

    codeObj.find('*[style*="text-decoration-line: underline"]').each(function() {
      $(this).wrapInner('<u></u>');
    });

    codeObj.find('*[style*="font-weight: bold"]').each(function() {
      $(this).wrapInner('<b></b>');
    });

    codeObj.find('h2,h3,h4,h5,h6').each(function() {
      $(this).wrapInner('<b></b>');
    });

    codeObj.find('h5,h6').each(function() {
      $(this).wrapInner('<i></i>');
    });
    
    let _this = this
    codeObj.find('iframe.note-video-clip').each(function() {
      var iframeSrc = $(this).attr('src');
      let videoID = _this.extractYouTubeVideoId(iframeSrc)
      
      if (videoID) {
          var thumbnailUrl = 'https://img.youtube.com/vi/' + videoID + '/maxresdefault.jpg';
          $(this).replaceWith('<a href="https://youtu.be/' + videoID + '"><img src="' + thumbnailUrl + '" alt="YouTube Thumbnail"></a>');
      }
    });


    codeObj.find('img').each((i, img) => {
      img = $(img)
      img.removeAttr('width')
      img.removeAttr('height')
      
      // img.css({
      //   // width: '100%',
      //   width: '50%',
      //   maxWidth: '14cm',
      //   height: 'auto',
      //   maxHeight: '24cm'
      // })

      // img.attr('width', "50%")
      img.attr('border', "1")
    })

    codeObj.find('*[style*="display: none"]').remove()
    
    codeObj.find('iframe.note-video-clip').each((i, iframe) => {
      let src = iframe.src
      iframe = $(iframe)
      iframe.parents('p:first').after(`<p><a href="${src}" target="_blank">${src}</a></p>`)
      iframe.remove()
    })
    
    code = codeObj.html()
    
    //console.log(code)
    
    return code
  },
  replaceAll (code, replaced, replaceWith) {
    return code.split(replaced).join(replaceWith)
  },
  CleanCode: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="eraser icon"></i>`+$t('Clean'))
    let tooltip = $t('Clean Code')
    let click = () => {
      this.CleanCodeClick()
    }
    return SummerNoteHelper.buildButton('CleanCode', contents, tooltip, click, doRender)
  },
  skipTagList: ['hr', 'td', 'tr', 'th', 'caption', 'code', 'table'],
  CleanCodeClick: function (postBody) {
    //let code = this.getPostSummerNote().summernote('code');
    if (postBody === undefined) {
      postBody = $v.EditorManager.FieldPostBody.getElement()
    }
    
    let children = postBody.children()

    // Clean empty ndoes
    children.each((i, child) => {
      //console.log(child.innerHTML.trim())
      let $child = $(child)
      let tagName = child.tagName.toLowerCase()
      if (this.skipTagList.indexOf(tagName) > -1) {
        return false
      }
      
      let html = child.innerHTML.trim().toLowerCase()
      if (html === '' || html === '<br>') {
        $child.remove()
        return false
      }

      let subchild = $child.children()
      //console.log([subchild.length, subchild.eq(0)[0], subchild.eq(0).attr('tagName'), subchild.eq(0).prop('tagName')])
      //return
      //console.log([subchild.length, subchild.eq(0).prop('tagName').toLowerCase()])
      /*
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
      */

      /*
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
      */

      //html = child.innerHTML.trim().toLowerCase()
      //console.log(html)
      while (html.startsWith('<br>')) {
        $child.find('br:first').remove()
        html = child.innerHTML.trim().toLowerCase()
      }
      while (html.endsWith('<br>')) {
        $child.find('br:last').remove()
        html = child.innerHTML.trim().toLowerCase()
      }
      
      subchild = $child.contents()
      if (subchild.length === 0) {
        $(child).remove()
      }
    })  // children.each((i, child) => {
    
    postBody.find(`[style*="font-family:"],[style*="font-size:"],[style*="text-indent:"],[style*="background-color:"]`).each((i, ele) => {
      ele = $(ele)
      ele.css('font-family', '')
      ele.css('font-size', '')
      ele.css('text-indent', '')
      let backgroundColor = ele.css('background-color').toLowerCase()
      if (backgroundColor === 'transparent' || backgroundColor === 'rgba(0, 0, 0, 0)') {
        ele.css('background-color', '')
      }
      let style = ele.attr('style')
      if (style !== undefined && (style.trim() === '' || style === ';')) {
        ele.removeAttr('style')
      }
    })
    
    postBody.find(`[align="left"]`).each((i, ele) => {
      ele = $(ele)
      if (ele.attr('align') === 'left') {
        ele.removeAttr('align')
      }
    })
    
    /**
     * @author Pulipuli Chen 20220306 
     * Exclude https://blogger.googleusercontent.com/img/a/
     */
    // https://blogger.googleusercontent.com/img/a/AVvXsEhPDOJwwZqvyYrW6xR2A7JrTnvqmNZVdH73PGC3Nxy9k16oqUmG02QuDgXePDcRVY58QQyfE1-yj5sMuyrA17CDnpgXiF-2hfiLhvDoiewS8FnWV4GmZHIMXXuKc1P-CApX4pk0TMmY8ziKF-1vFLPTABbKT-Six7UmGNbT8AifuJmP6jXXOSU
    postBody.find(`a[href*=".googleusercontent.com/"]:not(a[href*="https://blogger.googleusercontent.com/img/a/"])`).each((i, ele) => {
      let link = ele.href
      
      link = link.slice(link.indexOf('//'))
      link = link.replace('/s1600-h/', '/s1600/')
      ele.href = link
    })
    
    postBody.find(`img[src*=".googleusercontent.com/"]:not(img[src*="https://blogger.googleusercontent.com/img/a/"])`).each((i, ele) => {
      let link = ele.src
      link = link.slice(link.indexOf('//'))
      link = link.replace('/s1600-h/', '/s1600/')
      ele.src = link
    })
    
    postBody.find(`[style=""]`).removeAttr('style')
    
    postBody.find(`.note-editor-comment`).removeAttr('title').removeClass('note-editor-comment')
    
    postBody.find('span').each((i, span) => {
      let outerHTML = span.outerHTML
      if (outerHTML.startsWith('<span>')) {
        //outerHTML = outerHTML.slice('<span>'.length, (outerHTML - '</span>'.length))
        //span.replaceWith()
        span.outerHTML = span.innerHTML
      }
    })
    
    postBody.children('p').each((i, p) => {
      if (p.innerHTML.trim() === '') {
        $(p).remove()
      }
      else {
        $(p).children('p').each((i, p2) => {
          if (p2.innerHTML.trim() !== '') {
            $(p2).replaceWith(p2.innerHTML)
          }
          else {
            $(p2).remove()
          }
        })
      }
    })
    
    postBody.find('a').each((i, a) => {
      if (a.innerHTML.trim() === '') {
        $(a).remove()
      }
    })
    
    // 處理anchor的問題
    postBody.find('a[href^="file:///"][href*="index.htm#"]').each((i, a) => {
      let href = a.href
      a.href = href.slice(href.lastIndexOf('#'))
    })
    
    postBody.find('a[href^="http://#"]').each((i, a) => {
      let href = a.href
      a.href = href.slice(href.lastIndexOf('#'))
      $(a).removeAttr("target")
    })

    let ulList = postBody.children('ul')
    for (let i = 0; i < ulList.length; i++) {
      let ul = ulList.eq(i)

      let next = ul.next()
      if (next.length === 1 && next.prop('tagName') && next.prop('tagName').toLowerCase() === 'ul') {
        next.children().appendTo(ul)
        next.remove()

        ulList = postBody.children('ul')
        i = 0
      }
    }
    
    $v.EditorManager.FieldPostBody.cleanUnusedFileSystem()
    
    return postBody
  },
  SaveSnippet: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="file code outline icon"></i>` + $t('Snippet'))
    let tooltip = $t('Save Snippet')
    let click = () => {
      this.SaveSnippetClick()
    }
    return SummerNoteHelper.buildButton('SaveSnippet', contents, tooltip, click, doRender)
  },
  SaveSnippetClick: function () {
    // 先看有沒有選取
    let FieldPostBody = $v.EditorManager.FieldPostBody
    if (FieldPostBody.hasSelectedRange() === false) {
      $v.SnippetInserter.open()
      return undefined
    }
    
    //console.log('#TODO SaveSnippetClick')
    let nodeText = FieldPostBody.getSelectedNodeAndRemove()
    //console.log(node)
    let SnippetInserter = $v.EditorManager.SnippetInserter
    SnippetInserter.saveSnippet(nodeText, () => {
      SnippetInserter.loadSnippet()
    })
  },
  ReadAloud: function ($t, context, doRender) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="assistive listening systems icon"></i>`)
    let tooltip = $t('Read Aloud')
    let click = () => {
      //this.SaveSnippetClick()
      console.log('Read Aloud')
    }
    return SummerNoteHelper.buildButton('readAloud', contents, tooltip, click, doRender)
  },
}

export default SummerNoteCode