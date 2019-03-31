SemanticUIHelper = {
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
    console.log(dataTab)
    let menuContainer = tab.parents('.menu:first')
    let tabContainer = menuContainer.parent()
    
    menuContainer.find('.item.active').removeClass('active')
    tab.addClass('active')
    
    tabContainer.children(`.tab[data-tab="${dataTab}"]`).show()
    tabContainer.children(`.tab[data-tab!="${dataTab}"]`).hide()
  }
}