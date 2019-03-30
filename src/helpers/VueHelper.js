VueHelper = {
  mountLocalStorage: function (vue, key) {
    if (localStorage.getItem(key)) {
      try {
        vue[key] = localStorage.getItem(key);
      } catch(e) {
        localStorage.removeItem(key);
      }
    }
  },
  persistLocalStorage: function (vue, key) {
    localStorage[key] = vue[key];
  }
}