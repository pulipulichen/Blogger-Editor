import Vue from 'vue'



require('./helpers/ConfigHelper.js')

//require('./vendor/garlic/garlic.min.js')
//require('./vendor/dayjs/dayjs.min.js')

require('./helpers/FunctionHelper.js')
require('./helpers/CopyPasteHelper.js')
require('./helpers/FileSystemHelper.js')
require('./helpers/TemplateHelper.js')
require('./helpers/FileSystemHelper.js')
require('./helpers/WebSQLDatabaseHelper.js')
require('./helpers/DelayExecHelper.js')
require('./helpers/BloggerImageHelper.js')
require('./helpers/WindowHelper.js')
//require('./helpers/SummerNoteHelper.js')
require('./helpers/VueHelper.js')
require('./helpers/DayjsHelper.js')
require('./helpers/SemanticUIHelper.js')
require('./helpers/FileHelper.js')

window.$v = {}

import PageLoaderSfc from './views/PageLoader/PageLoader.vue'
VueHelper.init(PageLoaderSfc)

import BrowserDetectorComponent from './views/BrowserDetector/BrowserDetector.vue'
VueHelper.init(BrowserDetectorComponent)

import PostManagerComponent from './views/PostManager/PostManager.vue'
VueHelper.init(PostManagerComponent)

import ThemeManagerComponent from './views/ThemeManager/ThemeManager.vue'
VueHelper.init(ThemeManagerComponent)

import EditorManagerComponent from './views/EditorManager/EditorManager.vue'
VueHelper.init(EditorManagerComponent)

import NavBarComponent from './views/NavBar/NavBar.vue'
VueHelper.init(NavBarComponent)

// --------------------

require('./init.js')