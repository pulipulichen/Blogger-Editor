 
let ElectronHelper = {
  init: function () {
    if (this.isElectronEnvironment()) {
      this.initElectronInPageSearch()
    }
  },
  isElectronEnvironment: function () {
    return (typeof(process) === 'object' 
            && typeof(process.versions) === 'object'
            && typeof(process.versions['electron']) === 'string')
  },
  filterProtocol: function (url) {
    if (typeof(url) === 'string' && url.startsWith('//')) {
      if (this.isElectronEnvironment()) {
        return 'http:' + url
      }
      else {
        return url
      }
    }
    else {
      return url
    }
  },
  initElectronInPageSearch: function () {
    const searchInPage = require('electron-in-page-search').default;
    const remote = require('electron').remote;
   
    // Create an instance with the current window
        let searcher = remote.getCurrentWebContents()
        //console.log(typeof(searcher.send))
        //searcher.send = () => {}
        const inPageSearch = searchInPage(searcher);
        
        // Alternatively add the key event listener [CTRL+F]
        window.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) {
                inPageSearch.openSearchWindow();
            }
        }, false);
    
  }
}

ElectronHelper.init()

window.ElectronHelper = ElectronHelper