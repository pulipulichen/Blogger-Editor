let SummerNoteKeyMap = {
  pc: {
    'ENTER': 'insertParagraph',
    'CTRL+Z': 'undo',
    'CTRL+Y': 'redo',
    //'TAB': 'tab',
    //'SHIFT+TAB': 'untab',
    'CTRL+S': 'DelayForceExec',  // DelayForceExec
    'CTRL+B': 'bold',
    'CTRL+I': 'italic',
    'CTRL+U': 'underline',
    'CTRL+SHIFT+S': 'strikethrough',
    'CTRL+M': 'comment',
    'CTRL+ALT+M': 'uncomment',
    'CTRL+ALT+H': 'htmlify',
    'ALT+X': 'SaveSnippet',
    'ALT+S': 'ReadAloud',
    //'CTRL+SHIFT+E': 'comment',
    'CTRL+BACKSLASH': 'removeFormat',
    'CTRL+SHIFT+L': 'justifyLeft',
    'CTRL+SHIFT+E': 'justifyCenter',
    // 'CTRL+SHIFT+R': 'justifyRight',
    'CTRL+SHIFT+J': 'justifyFull',
    'CTRL+SHIFT+NUM7': 'insertUnorderedList',
    'CTRL+SHIFT+NUM8': 'insertOrderedList',
    'CTRL+LEFTBRACKET': 'outdent',
    'CTRL+RIGHTBRACKET': 'indent',
    'SHIFT+TAB': 'outdent',
    'TAB': 'indent',
    'CTRL+NUM0': 'formatPara',
    'CTRL+NUM1': 'formatH1',
    'CTRL+NUM2': 'formatH2',
    'CTRL+NUM3': 'formatH3',
    'CTRL+NUM4': 'formatH4',
    'CTRL+NUM5': 'formatH5',
    'CTRL+NUM6': 'formatH6',
    'CTRL+ENTER': 'insertHorizontalRule',
    'CTRL+K': 'linkDialog.show',
    'CTRL+L': 'linkDialog.show'
  },
  mac: {
    'ENTER': 'insertParagraph',
    'CMD+Z': 'undo',
    'CMD+SHIFT+Z': 'redo',
    'TAB': 'tab',
    'SHIFT+TAB': 'untab',
    'CMD+B': 'bold',
    'CMD+I': 'italic',
    'CMD+U': 'underline',
    'CMD+SHIFT+S': 'strikethrough',
    'CMD+M': 'comment',
    'CMD+SHIFT+X': 'SaveSnippet',
    'CMD+BACKSLASH': 'removeFormat',
    'CMD+SHIFT+L': 'justifyLeft',
    'CMD+SHIFT+E': 'justifyCenter',
    // 'CMD+SHIFT+R': 'justifyRight',
    'CMD+SHIFT+J': 'justifyFull',
    'CMD+SHIFT+NUM7': 'insertUnorderedList',
    'CMD+SHIFT+NUM8': 'insertOrderedList',
    'CMD+LEFTBRACKET': 'outdent',
    'CMD+RIGHTBRACKET': 'indent',
    'CMD+NUM0': 'formatPara',
    'CMD+NUM1': 'formatH1',
    'CMD+NUM2': 'formatH2',
    'CMD+NUM3': 'formatH3',
    'CMD+NUM4': 'formatH4',
    'CMD+NUM5': 'formatH5',
    'CMD+NUM6': 'formatH6',
    'CMD+ENTER': 'insertHorizontalRule',
    'CMD+K': 'linkDialog.show'
  }
}
export default SummerNoteKeyMap