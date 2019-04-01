import Vue from 'vue'

//require('./vendor/garlic/garlic.min.js')
require('./vendor/dayjs/dayjs.min.js')

//require('./vendor/popper/popper.min.js')
//require('./vendor/bootstrap/js/bootstrap.js')

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


require('./helpers/ConfigHelper.js')

//TemplateManager = import('./views/ThemeManager/TemplateManager.js')

window.$v = {}

import PageLoaderSfc from './views/PageLoader/PageLoader.vue'
VueHelper.init(PageLoaderSfc)

import BrowserDetectorComponent from './views/BrowserDetector/BrowserDetector.vue'
//new Vue({
//  el: "#BrowserDetector",
//  render: h => h(BrowserDetectorComponent),
//})
VueHelper.init(BrowserDetectorComponent)

import PostManagerComponent from './views/PostManager/PostManager.vue'
//new Vue({
//  el: "#PostManager",
//  render: h => h(PostManagerComponent),
//})
VueHelper.init(PostManagerComponent)

import ThemeManagerComponent from './views/ThemeManager/ThemeManager.vue'
//new Vue({
//  el: "#ThemeManager",
//  render: h => h(ThemeManagerComponent),
//})
VueHelper.init(ThemeManagerComponent)

import EditorManagerComponent from './views/EditorManager/EditorManager.vue'
//new Vue({
//  el: "#EditorManager",
//  render: h => h(EditorManagerComponent),
//})
VueHelper.init(EditorManagerComponent)

import NavBarComponent from './views/NavBar/NavBar.vue'
//new Vue({
//  el: "#NavBar",
//  render: h => h(NavBarComponent),
//})
VueHelper.init(NavBarComponent)

// --------------------

require('./init.js')