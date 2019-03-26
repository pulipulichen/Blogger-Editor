$(() => {
  TemplateHelper.init(() => {
    $summernote = $('#summernotePostBody')
    $summernote.summernote(summernotePostBodyConfig);
    
    $('#summernotePostTitle').summernote(summernotePostTitleConfig);
  })
  
  setTimeout(() => {
    $.getScript('dist/views.min.js')
  }, 10000)
})