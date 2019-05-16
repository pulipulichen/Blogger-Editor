import SummerNoteHelper from './SummerNoteHelper.js'

let SummerNoteCode = {
  insertMore: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="ellipsis horizontal icon"></i> More`)
    let tooltip = 'Insert More'
    let click = () => {
      let postBody = $v.EditorManager.FieldPostBody
      postBody.getElement().find('a[name="more"]').remove()
      //postBody.insert('<a name="more"></a><!--more-->')
      postBody.insert('<hr />')
      postBody.insert('<!--more-->')
      postBody.insert('<a name="more"></a>')
      
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  CopyCode: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="code icon"></i>Copy Code`)
    let tooltip = 'Copy Code'
    let click = () => {
      let postBody = $v.EditorManager.FieldPostBody.getElement()
      postBody = this.CleanCodeClick(postBody)
      
      //let code = this.getPostSummerNote().summernote('code');
      let code = postBody.html()
      
      code = code.replace(`<a name="more"></a>`, '')
      //code = code.replace(`<br /></p>`, '</p>')
      //code = code.replace(`<br /></`, '</')
      
      CopyPasteHelper.copyPlainText(code)
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  CleanCode: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`<i class="eraser icon"></i>Clean`)
    let tooltip = 'Clean Code'
    let click = () => {
      this.CleanCodeClick()
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
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
      let html = child.innerHTML.trim().toLowerCase()
      if (html === '' || html === '<br>') {
        $child.remove()
        return
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
    
    postBody.find(`[style*="font-family:"],[style*="text-indent:"],[style*="background-color:"]`).each((i, ele) => {
      ele = $(ele)
      ele.css('font-family', '')
      ele.css('text-indent', '')
      let backgroundColor = ele.css('background-color').toLowerCase()
      if (backgroundColor === 'transparent' || backgroundColor === 'rgba(0, 0, 0, 0)') {
        ele.css('background-color', '')
      }
      let style = ele.attr('style')
      if (style.trim() === '' || style === ';') {
        ele.removeAttr('style')
      }
    })
    
    postBody.find(`[style=""]`).removeAttr('style')
    
    return postBody
  },
}

export default SummerNoteCode