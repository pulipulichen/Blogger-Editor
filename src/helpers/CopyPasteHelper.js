CopyPasteHelper = {
  copyPlainText: function (text) {
    var copyTextInput = document.getElementById("puliClipboardInput")
    if (copyTextInput === null) {
      var copyTextInput = document.createElement("textarea");
      copyTextInput.id = "puliClipboardInput"
      //copyTextInput.type = "text"
      document.body.appendChild(copyTextInput);
    }

    copyTextInput.value = text

    copyTextInput.style = "display: block; position: absolute; top: -1000px; left: -1000px;"
    /* Select the text field */
    copyTextInput.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");

    copyTextInput.style = "display: none"
  },
  copyRichFormat: function (str) {
    function listener(e) {
      e.clipboardData.setData("text/html", str);
      e.clipboardData.setData("text/plain", str);
      e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
  }
}
