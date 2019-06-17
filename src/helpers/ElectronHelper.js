let ElectronHelper = {
  init: function () {
    try {
      const remote = require('electron').remote;
      const settings = remote.require('electron-settings');
      window.ElectronSettings = settings
    }
    catch (e) {}
  }
}

window.ElectronHelper = ElectronHelper
export default ElectronHelper