(function($) {
  $.extend($.summernote.lang, {
    'zh-TW': {
      font: {
        bold: '粗體',
        italic: '斜體',
        underline: '底線',
        clear: '清除格式',
        height: '行高',
        name: '字體',
        strikethrough: '刪除線',
        subscript: '下標',
        superscript: '上標',
        size: '字號',
        comment: '註解',
        uncomment: '取消註解',
        htmlify: '轉換為HTML',
        textify: 'HTML轉換為純文字',
      },
      image: {
        image: '圖片',
        insert: '插入圖片',
        resizeFull: '縮放至100%',
        resizeHalf: '縮放至 50%',
        resizeQuarter: '縮放至 25%',
        floatLeft: '靠左浮動',
        floatRight: '靠右浮動',
        floatNone: '取消浮動',
        shapeRounded: '形狀: 圓角',
        shapeCircle: '形狀: 圓',
        shapeThumbnail: '形狀: 縮略圖',
        shapeNone: '形狀: 無',
        dragImageHere: '將圖片拖曳至此處',
        dropImage: '將圖片放至此處',
        selectFromFiles: '從本機上傳',
        maximumFileSize: '文件大小最大值',
        maximumFileSizeError: '文件大小超出最大值。',
        url: '圖片網址',
        remove: '移除圖片',
        original: '原始尺寸',
        copy: '複製連結',
        open: '開啟圖片',
        save: '下載圖片'
      },
      video: {
        video: '影片',
        videoLink: '影片連結',
        insert: '插入影片',
        url: '影片網址',
        providers: '(Youtube, Instagram, DailyMotion, 優酷)'
      },
      comment: {
          dialogTitle: '編輯註解',
          remove: '移除註解',
          update: '更新註解'
      },
      link: {
        link: '連結',
        insert: '插入連結',
        unlink: '取消連結',
        edit: '編輯連結',
        textToDisplay: '顯示文字',
        url: '連結網址',
        title: '連結標題 (選填)',
        openInCurrentWindow: '在此視窗開啟',
        openInNewWindow: '在新視窗開啟',
        openInPopup: '在彈跳視窗開啟',
        copy: '複製連結',
        remove: '刪除'
      },
      table: {
        table: '表格',
        addRowAbove: 'Add row above',
        addRowBelow: 'Add row below',
        addColLeft: 'Add column left',
        addColRight: 'Add column right',
        delRow: 'Delete row',
        delCol: 'Delete column',
        delTable: 'Delete table'
      },
      hr: {
        insert: '水平線'
      },
      style: {
        style: '樣式',
        p: '一般',
        blockquote: '引用區塊',
        pre: '程式碼區塊',
        h1: '標題 1',
        h2: '標題 2',
        h3: '標題 3',
        h4: '標題 4',
        h5: '標題 5',
        h6: '標題 6',
        formatPara: "格式化為<p>",
        formatCode: "格式化為<code>",
        formatH1: "格式化為<h1>",
        formatH2: "格式化為<h2>",
        formatH3: "格式化為<h3>",
        formatH4: "格式化為<h4>",
        formatH5: "格式化為<h5>",
        formatH6: "格式化為<h6>",
      },
      lists: {
        unordered: '項目清單',
        ordered: '編號清單'
      },
      options: {
        help: '快捷鍵',
        fullscreen: '全螢幕',
        codeview: '原始碼'
      },
      paragraph: {
        paragraph: '段落',
        outdent: '取消縮排',
        indent: '增加縮排',
        left: '靠右對齊',
        center: '靠中對齊',
        right: '靠右對齊',
        justify: '左右對齊'
      },
      color: {
        recent: '字型顏色',
        more: '更多',
        background: '背景',
        foreground: '前景',
        transparent: '透明',
        setTransparent: '透明',
        reset: '重設',
        resetToDefault: '默認'
      },
      shortcut: {
        shortcuts: '快捷鍵',
        close: '關閉',
        textFormatting: '文字格式',
        action: '動作',
        paragraphFormatting: '段落格式',
        documentStyle: '文件格式',
        extraKeys: '額外按鍵'
      },
      help: {
        'insertParagraph': '插入段落',
        'undo': '復原上一步',
        'redo': '重作上一步',
        'tab': '向內增加縮排',
        'untab': '向外減少縮排',
        'bold': '為選取文字增加粗體',
        'italic': '為選取文字增加斜體',
        'underline': '為選取文字增加底線',
        'strikethrough': '為選取文字增加刪除線',
        'removeFormat': '清除所有格式設定',
        'justifyLeft': '靠左對齊',
        'justifyCenter': '置中',
        'justifyRight': '靠右對齊',
        'justifyFull': '左右對齊',
        'insertUnorderedList': '建立項目符號清單',
        'insertOrderedList': '建立編號清單',
        'outdent': '向內增加縮排',
        'indent': '向外減少縮排',
        'formatPara': '將現在的區塊設為段落(&lt;p>標籤)',
        'formatH1': '將現在的區塊設為標題1(&lt;h1>標籤)',
        'formatH2': '將現在的區塊設為標題1(&lt;h2>標籤)',
        'formatH3': '將現在的區塊設為標題1(&lt;h3>標籤)',
        'formatH4': '將現在的區塊設為標題1(&lt;h4>標籤)',
        'formatH5': '將現在的區塊設為標題1(&lt;h5>標籤)',
        'formatH6': '將現在的區塊設為標題1(&lt;h6>標籤)',
        'insertHorizontalRule': '插入水平線',
        'linkDialog.show': '顯示連結對話視窗',
        'iframeDialog.show': '顯示Iframe對話視窗',
        'commentDialog.show': '顯示註解對話視窗',
        'comment': '新增註解',
        'uncomment': '移除註解',
        'htmlify': '將選取文字轉換成HTML元素',
        'textify': '將選取HTML元素轉換成文字',
        'SaveSnippet': '將選取文字轉換成預設範本',
      },
      history: {
        undo: '復原',
        redo: '取消復原'
      },
      specialChar: {
        specialChar: 'SPECIAL CHARACTERS',
        select: 'Select Special characters'
      },
      iframe: {
        title: "標題 (選填)",
        url: "網址",
        insert: "插入iframe",
        newWindow: "開啟新視窗",
        popupWindow: "開啟彈跳視窗"
      }
    }
  });
})(jQuery);
