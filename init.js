$(() => {
  TemplateHelper.init(() => {
    $summernote = $('#summernote')
    $summernote.summernote(summernoteConfig);
  })
})