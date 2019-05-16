import SummerNoteHelper from './SummerNoteHelper.js'

let SummerNoteStyle = {
  
  styleP: function (context) {
    let contents = SemanticUIHelper.wrapNIWSF(`&lt;p&gt;`)
    let tooltip = 'Set as &lt;p&gt; tag.'
    let click = () => {
      this.styleTagName('p')
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  styleH1: function (context) {
    let tagName = 'h1'
    let contents = SemanticUIHelper.wrapNIWSF(`&lt;${tagName}&gt;`)
    let tooltip = `Set as &lt;${tagName}&gt; tag.`
    let click = () => {
      this.styleTagName(tagName)
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  styleH2: function (context) {
    let tagName = 'h2'
    let contents = SemanticUIHelper.wrapNIWSF(`&lt;${tagName}&gt;`)
    let tooltip = `Set as &lt;${tagName}&gt; tag.`
    let click = () => {
      this.styleTagName(tagName)
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  styleH3: function (context) {
    let tagName = 'h3'
    let contents = SemanticUIHelper.wrapNIWSF(`&lt;${tagName}&gt;`)
    let tooltip = `Set as &lt;${tagName}&gt; tag.`
    let click = () => {
      this.styleTagName(tagName)
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  styleH4: function (context) {
    let tagName = 'h4'
    let contents = SemanticUIHelper.wrapNIWSF(`&lt;${tagName}&gt;`)
    let tooltip = `Set as &lt;${tagName}&gt; tag.`
    let click = () => {
      this.styleTagName(tagName)
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  styleH5: function (context) {
    let tagName = 'h5'
    let contents = SemanticUIHelper.wrapNIWSF(`&lt;${tagName}&gt;`)
    let tooltip = `Set as &lt;${tagName}&gt; tag.`
    let click = () => {
      this.styleTagName(tagName)
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  styleH6: function (context) {
    let tagName = 'h6'
    let contents = SemanticUIHelper.wrapNIWSF(`&lt;${tagName}&gt;`)
    let tooltip = `Set as &lt;${tagName}&gt; tag.`
    let click = () => {
      this.styleTagName(tagName)
    }
    return SummerNoteHelper.buildButton(contents, tooltip, click)
  },
  
  // -------------------------------

  // -------------------------
  // style buttons
  // -------------------------
  blockList: ['li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'],
  styleTagName: function (tagName) {
    let postBody = $v.EditorManager.FieldPostBody
    let target = postBody.getSelectTarget()
    //console.log($(target).html())
    let parent = target.sc.parentNode
    //console.log(target)

    //target = $(target.sc)
    parent = $(parent)
    if (parent.hasClass('note-editing-area') === true 
            || parent.hasClass('note-editable') === true) {
      //console.log('has class note-editing-area')
      return
    }
    let content = parent.html()
    //let grandParent = parent.parent()
    if (parent.prop('tagName').toLowerCase() === tagName.toLocaleLowerCase()) {
      return
    }
    //console.log(['parent tagName', tagName])

    let disableList = ['td', 'tr', 'th', 'caption', 'code']
    if (disableList.indexOf(tagName) > -1) {
      return
    }

    //let grandTagName = grandParent.prop('tagName').toLowerCase()
    //console.log(['firstTagName', tagName])
    let blockList = this.blockList

    let skip = false
    //let pass = false
    let targetParent
    parent.parents().each((i, ele) => {
      if (skip === true || targetParent !== undefined) {
        return
      }
      if (typeof(ele.className) === 'string' 
              && ele.className.indexOf('note-editable') > -1) {
        skip = true
        return
      }

      let tn = ele.tagName.toLowerCase()
      //console.log(tn)

      if (blockList.indexOf(tn) > -1) {
        //tagName = tn
        targetParent = $(ele)
        //pass = true
        skip = true
        return
      }
    })

    if (targetParent === undefined) {
      targetParent = parent
    }

    /*

    if (blockList.indexOf(grandTagName) > -1) {
      tagName = grandTagName
      parent = grandParent
    }
    else if (blockList.indexOf(tagName) === -1) {
      while (grandParent.hasClass('note-editing-area') === false 
              && grandParent.hasClass('note-editable') === false) {
        parent = grandParent
        grandParent = parent.parent()
        if (parent.prop('tagName') !== 'undefined') {
          tagName = parent.prop('tagName')
        }
      }
    }
    */
    let newParent = $(`<${tagName}>${content}</${tagName}>`)
    targetParent.replaceWith(newParent)
    //$(() => {
    //  parent.focus()
    //  newParent.focus()
    //})
    //parent.replaceWith(newParent)
    let p = newParent[0]
    let s = window.getSelection()
    let r = document.createRange()
    r.setStart(p, p.childElementCount)
    r.setEnd(p, p.childElementCount)
    s.removeAllRanges()
    s.addRange(r)
    
    
    postBody.change()
  },
}

export default SummerNoteStyle