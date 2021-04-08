/* global VueHelper, InitHelper */

//import Vue from 'vue'
//import VueI18n from 'vue-i18n'

//Vue.use(VueI18n)

require('./InitHelper.js')

require('./helpers/ConfigHelper.js')
require('./helpers/VueHelper.js')
require('./helpers/I18nHelper.js')

//require('./vendor/garlic/garlic.min.js')
//require('./vendor/dayjs/dayjs.min.js')

require('./helpers/FunctionHelper.js')
require('./helpers/CopyPasteHelper.js')
require('./helpers/FileSystemHelper.js')
//require('./helpers/TemplateHelper.js')
require('./helpers/FileSystemHelper.js')
require('./helpers/WebSQLDatabaseHelper.js')
require('./helpers/DelayExecHelper.js')
//require('./helpers/BloggerImageHelper.js')
import BloggerImageHelper from './helpers/BloggerImageHelper.js'

require('./helpers/WindowHelper.js')
//require('./helpers/SummerNoteHelper.js')
require('./helpers/DayjsHelper.js')
require('./helpers/SemanticUIHelper.js')
require('./helpers/FileHelper.js')
require('./helpers/ScrollHelper.js')
require('./helpers/EventManager.js')
require('./helpers/GoogleAnalyticsHelper.js')
require('./helpers/TesseractHelper.js')
require('./helpers/URLHelper.js')

window.$v = {}

// -------------

import PageLoaderSfc from './helpers/PageLoader/PageLoader.vue'
VueHelper.init(PageLoaderSfc)

import WindowAlertSfc from './helpers/WindowAlert/WindowAlert.vue'
VueHelper.init(WindowAlertSfc)

import WindowConfirmSfc from './helpers/WindowConfirm/WindowConfirm.vue'
VueHelper.init(WindowConfirmSfc)

// -------------

import BrowserDetectorComponent from './views/BrowserDetector/BrowserDetector.vue'
VueHelper.init(BrowserDetectorComponent)

import PostManagerComponent from './views/PostManager/PostManager.vue'
VueHelper.init(PostManagerComponent)

import ThemeManagerComponent from './views/ThemeManager/ThemeManager.vue'
VueHelper.init(ThemeManagerComponent)

import EditorManagerComponent from './views/EditorManager/EditorManager.vue'
VueHelper.init(EditorManagerComponent)

import ConfigManagerSfc from './views/ConfigManager/ConfigManager.vue'
VueHelper.init(ConfigManagerSfc)

import PublishManagerSfc from './views/PublishManager/PublishManager.vue'
VueHelper.init(PublishManagerSfc)

import StatisticIndicatorComponent from './views/NavBar/StatisticIndicator/StatisticIndicator.vue'
VueHelper.init(StatisticIndicatorComponent)

import NavBarSidebarComponent from './views/NavBar/NavBarSidebar/NavBarSidebar.vue'
VueHelper.init(NavBarSidebarComponent)

import NavBarComponent from './views/NavBar/NavBar.vue'
VueHelper.init(NavBarComponent)

// --------------------

//require('./init.js')
InitHelper.init()