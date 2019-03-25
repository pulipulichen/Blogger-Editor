import Vue from 'vue'

require('./vendor/garlic/garlic.min.js')
require('./vendor/dayjs/dayjs.min.js')

//require('./vendor/popper/popper.min.js')
//require('./vendor/bootstrap/js/bootstrap.js')

require('./helpers/FunctionHelper.js')
require('./helpers/CopyPasteHelper.js')
require('./helpers/FileSystemHelper.js')
require('./helpers/TemplateHelper.js')
require('./helpers/FileSystemHelper.js')

//VueHelper = require('./helpers/VueHelper.js')
//VueHelper.render('NavBar', './views/NavBar/NavBar.vue')
import NavBar from './views/NavBar/NavBar.vue'
new Vue({
  el: "#NavBar",
  render: h => h(NavBar),
})

require('./views/PostsManager/PostsManager.js')
require('./views/ThemeManager/ThemeManager.js')
require('./views/EditorManager/EditorManager.js')
require('./views/EditorManager/SummerNotePostTitleHelper.js')
require('./views/EditorManager/SummerNotePostBodyHelper.js')
