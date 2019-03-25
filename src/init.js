$(() => {
  TemplateHelper.init(() => {
    $summernote = $('#summernotePostBody')
    $summernote.summernote(summernotePostBodyConfig);
    
    $('#summernotePostTitle').summernote(summernotePostTitleConfig);
  })
})