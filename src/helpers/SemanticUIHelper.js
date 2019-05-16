let SemanticUIHelper = {
  openTab: function (tab) {
    //console.log(tab)
    //return
    if (typeof(tab.srcElement) === 'object') {
      tab = tab.srcElement
    }
    
    tab = $(tab)
    if (tab.hasClass('active')) {
      return
    }
    
    let dataTab = tab.attr('data-tab')
    //console.log(dataTab)
    let menuContainer = tab.parents('.menu:first')
    let tabContainer = menuContainer.parent()
    
    menuContainer.find('.item.active').removeClass('active')
    tab.addClass('active')
    
    tabContainer.children(`.tab[data-tab="${dataTab}"]`).show()
    tabContainer.children(`.tab[data-tab!="${dataTab}"]`).hide()
  },
  initDrop: function () {
    let dragoverClassname = 'dragover'
    
    //let doc = $('body')
    let doc = $(document)
    let body = $('body')
    
    //let timer = null
    
    doc.on('dragenter', (e) => {
      e.preventDefault()
      e.stopPropagation()
      body.addClass(dragoverClassname)
      //console.log('body dragenter')
    })
    
    doc.on('dragover', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
    
    doc.on('drop', (e) => {
      //body.addClass(dragoverClassname)
      //console.log('body dragenter')
      e.preventDefault()
      e.stopPropagation()
      body.removeClass(dragoverClassname)
      return false
    })
    /*
    doc.on('dragover', () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        body.removeClass(dragoverClassname)
        timer = null
        console.log('body dragleave')
      }, 1000)
    })
    */
    doc.on('dragleave', (e) => {
      //console.log(e)
      //console.log([e.clientX, e.clientY])
      if (e.clientX === 0 || e.clientY === 0) {
        body.removeClass(dragoverClassname)
        //console.log('body dragleave')
      }
    })
  },
  wrapNIWSF: function (text) {
    return `<span class="non-invasive-web-style-framework">${text}</span>`
  },
}

window.SemanticUIHelper = SemanticUIHelper
export default SemanticUIHelper