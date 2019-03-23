let summernoteConfig = {
  height: 'calc(100vh - 60px)',                 // set editor height
  minHeight: 'calc(100vh - 60px)',             // set minimum height of editor
  maxHeight: null,             // set maximum height of editor
  focus: true,                  // set focus to editable area after initializing summernote
  disableResizeEditor: true,
  //disableDragAndDrop: false,
  callbacks: {
    onImageUpload: function(files) {
      // upload image to server and create imgNode...
      //$summernote.summernote('insertNode', imgNode);
      //console.log(files[0])
      FileSystemHelper.copy(files, function (urlList) {
        //console.log(urlList)
        urlList.forEach(imgUrl => {
          //let imgUrl = urlList[0]
          let imgNode = $(`<a href="${imgUrl}"><img src="${imgUrl}" /></a>`)[0]
          $summernote.summernote('insertNode', imgNode);
        })
      })
    },
    onDrop: function (files) {
      //console.log(files.length)
      
      let loop = (i) => {
        if (i < files.length) {
          let file = files[i];
          let type = file.type
          let name = file.name
          //console.log(imageFile)

          FileSystemHelper.copy(file, function (url) {
            let node
            if (type.startsWith('image')) {
              node = $(`<a href="${url}"><img src="${url}" alt="${name}" title="${name}" /></a>`)[0]
            }
            else {
              node = $(`<a href="${url}">${name}</a>`)[0]
            }
            $summernote.summernote('insertNode', node);

            i++
            loop(i)
          })
        }
      }
      loop(0)
    },
    onPaste: function(e) {
      console.log('Called event paste');
      console.log(e)
      var orgEvent = e.originalEvent;
      for (var i = 0; i < orgEvent.clipboardData.items.length; i++) {
        if (orgEvent.clipboardData.items[i].kind === "file" 
                && orgEvent.clipboardData.items[i].type.startsWith('image/')) {
          var imageFile = orgEvent.clipboardData.items[i].getAsFile();
          
          var fileReader = new FileReader();

          fileReader.onloadend = function () {
            let file = fileReader.result
            
            FileSystemHelper.copy(file, function (imgUrl) {
              let imgNode = $(`<img src="${imgUrl}" />`)[0]
              $summernote.summernote('insertNode', imgNode);
            })
          }

          fileReader.readAsDataURL(imageFile);
          break;
        }
      }
    }
  }
}

$(document).ready(function() {
  $summernote = $('#summernote')
  $summernote.summernote(summernoteConfig);
});