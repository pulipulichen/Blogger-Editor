import Vue from 'vue'
import Msg from './modules/NavBar/NavBar.vue'
new Vue({
    el: '#mainContent',
    components:{Msg}
})

require('./vendor/garlic/garlic.min.js')
require('./vendor/dayjs/dayjs.min.js')

//require('./vendor/popper/popper.min.js')
//require('./vendor/bootstrap/js/bootstrap.js')

require('./helpers/FunctionHelper.js')
require('./helpers/CopyPasteHelper.js')
require('./helpers/FileSystemHelper.js')
require('./helpers/TemplateHelper.js')
require('./helpers/FileSystemHelper.js')

require('./modules/PostsManager/PostsManager.js')
require('./modules/ThemeManager/ThemeManager.js')
require('./modules/EditorManager/EditorManager.js')
require('./modules/EditorManager/SummerNotePostTitleHelper.js')
require('./modules/EditorManager/SummerNotePostBodyHelper.js')
