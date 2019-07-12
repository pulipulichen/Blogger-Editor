//jQuery = require('./vendor/jquery/jquery.min.js')
//jQuery = require('jquery')
//$ = jQuery
//import $ from 'jquery'
//window.$ = $
//window.jQuery = $

import $ from 'jquery'
window.$ = window.jQuery = $

//require('./vendor/semantic-ui-niwsf/styles/bundle-semantic.niwsf.css')
require('./vendor/semantic-ui-niwsf/semantic.niwsf.less')
require('./vendor/semantic-ui-niwsf/semantic.niwsf.js')
//require('./vendor/semantic-ui-niwsf/styles/semantic.css') // for test
//require('./vendor/semantic-ui-niwsf/semantic.js') // for test

//require('./vendor/semantic-ui-niwsf/semantic.raw.css')
//require('./vendor/bootstrap/css/bootstrap.min.css')

//require('./vendor/summernote/summernote.css')
//require('./vendor/summernote/summernote.js')

require('./vendor/summernote/summernote-lite.less')
require('./vendor/summernote/summernote-lite.js')

//console.log(typeof($.summernote))
//require('summernote')

require('./vendor/google-analytics/analytics.js')

// ----------------------------------

require('./styles/semantic-ui.less')
require('./styles/summernote.less')
require('./styles/custom.less')
require('./styles/templateReform.less')
require('./styles/electronInPageSearch.less')

